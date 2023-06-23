import multerS3 from 'multer-s3';
import { extname } from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import { StorageEngine } from 'multer';

class MulterStorage {
  private storage: StorageEngine;

  private name: string;

  constructor(name: string) {
    this.name = name;
    this.storage = multerS3({
      s3: new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
      }),
      bucket: process.env.AWS_S3_BUCKET || '',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: (_req, file, cb) => {
        // const key = Date.now() + extname(file.originalname);
        // file.filename = key;
        cb(null, `${this.name}${extname(file.originalname)}`);
      },
    });
  }

  public getName() {
    return this.name;
  }

  public multerConfig() {
    const config = {
      dest: 'src/media',
      storage: this.storage,
    };
    return config;
  }
}

export default MulterStorage;
