import { ConfigType } from '@nestjs/config';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { HttpClientService } from '@tresdoce-nestjs-toolkit/http-client';
import qiniu from 'qiniu';
import { config } from '../../config';
import axios from 'axios';
import { ParamUploadByUrl } from '../dtos/qiniuapis.dto';
import * as http from 'http';

@Injectable()
export class QiniuapisService {
  constructor(
    @Inject(config.KEY) private readonly appConfig: ConfigType<typeof config>,
    private readonly httpClient: HttpClientService,
  ) {}
  async qiniuUpload(file: Express.Multer.File) {
    try {
      const accessKey = this.appConfig.services.qiniuApi.ak;
      const secretKey = this.appConfig.services.qiniuApi.sk;
      const bucket = this.appConfig.services.qiniuApi.bucketName;
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      const options = {
        scope: bucket,
      };
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);
      const config = new qiniu.conf.Config();
      // 空间对应的区域，若不配置将自动查询
      config.regionsProvider = qiniu.httpc.Region.fromRegionId('z2');
      const localFile = file.path;
      const formUploader = new qiniu.form_up.FormUploader(config);
      const putExtra = new qiniu.form_up.PutExtra();
      const key = file.filename;

      const bucketManager = new qiniu.rs.BucketManager(mac, config);
      const publicBucketDomain = this.appConfig.services.qiniuApi.cdn;

      // 文件上传
      const { data, resp } = await formUploader.putFile(uploadToken, key, localFile, putExtra);

      const result = {
        data: '',
        code: 0,
        msg: '',
      };
      if (resp.statusCode === 200) {
        console.log(data);
        // 公开空间访问链接
        const publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
        console.log(publicDownloadUrl);
        result.data = publicDownloadUrl;
      } else {
        console.log(resp.statusCode);
        console.log(data);
        result.code = resp.statusCode;
        result.msg = data;
      }
      return result;
    } catch (error) /* istanbul ignore next */ {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async uploadToQiniu(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
    const accessKey = this.appConfig.services.qiniuApi.ak;
    const secretKey = this.appConfig.services.qiniuApi.sk;
    const bucket = this.appConfig.services.qiniuApi.bucketName;
    const publicBucketDomain = this.appConfig.services.qiniuApi.cdn;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = { scope: bucket };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const key = null;

    return new Promise((resolve, reject) => {
      formUploader.put(uploadToken, key, buffer, putExtra, (err, body, info) => {
        if (err) {
          reject(err);
        }
        if (info.statusCode === 200) {
          resolve(`${publicBucketDomain}/${body.hash}`);
        } else {
          reject(new Error(`Upload failed with status code ${info.statusCode}`));
        }
      });
    });
  }

  base64ToBuffer(base64: string): { buffer: Buffer; mimeType: string } {
    const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }
    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    return { buffer, mimeType };
  }
  /**
   * Downloads an image from a given URL and converts it to a base64 string.
   *
   * @param url The URL of the image to download.
   * @returns A Promise that resolves to a string in the format of `data:[mimeType];base64,[base64]`.
   */
  async downloadImageToBase64(url: string): Promise<string> {
    const response = await axios.get<Buffer>(url, {
      responseType: 'arraybuffer',
      // Disable keep-alive to avoid connection pooling issues
      httpAgent: new http.Agent({ keepAlive: false }),
    });
    const base64 = Buffer.from(response.data).toString('base64');
    const mimeType: string = response.headers['content-type'];
    return `data:${mimeType};base64,${base64}`;
  }

  async qiniuUploadByUrl(file: ParamUploadByUrl) {
    try {

      const response = {
        data: '',
        code: 0,
        msg: '',
      };
      const base64 = await this.downloadImageToBase64(file.url);
      const { buffer, mimeType } = await this.base64ToBuffer(base64)
      const filename = `filename-${Date.now()}.${mimeType.split('/')[1]}`;
      const result = await this.uploadToQiniu(buffer, filename, mimeType);
      if(!result) {
        response.code = 1;
        response.msg = '上传失败';
        return response
      }
      response.data = result;
      return response;
    } catch(err) {
      throw new HttpException(err.response.data, err.response.status);
    }
  }
}
