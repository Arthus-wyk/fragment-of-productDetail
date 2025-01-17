import qiniu from 'qiniu';
import { NextApiRequest, NextApiResponse } from 'next';

const accessKey = process.env.QINIU_ACCESS_KEY;
const secretKey = process.env.QINIU_SECRET_KEY;
const bucket = process.env.QINIU_BUCKET;

// 创建认证对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// 创建配置对象
const config = new qiniu.conf.Config();

// 空间对应的机房
config.zone = qiniu.zone.Zone_as0; // 根据你的存储空间所在的区域设置

// 创建 BucketManager 对象
const bucketManager = new qiniu.rs.BucketManager(mac, config);
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { key } = req.body;
  
  // 创建鉴权对象
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: bucket,
    expires: 7200
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken=putPolicy.uploadToken(mac);
    res.status(200).json({ data:uploadToken  });
  }
  else if(req.method='DELETE'){
    const { key } = req.body;
// 创建 BucketManager 对象
const bucketManager = new qiniu.rs.BucketManager(mac, config);
    // 调用 delete 方法删除文件
    if(bucket){
      bucketManager.delete(bucket, key, function (err, respBody, respInfo) {
        if (err) {
          console.log(err);
          res.status(500).json({ error: err.message });
          return;
        }
  
        if (respInfo.statusCode === 200) {
          res.status(200).json({ message: 'File deleted successfully' });
        } else {
          res.status(respInfo.statusCode).json({ error: respBody });
        }
      });
    }
    
  }
   else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}