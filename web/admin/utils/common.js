//image upload s3
import aws from "aws-sdk";

//const imageThumbnail = require("image-thumbnail");

//aws
aws.config.update({
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  region: process.env.AWS_S3_REGION,
});

const s3 = new aws.S3();

const uploadFile = (data, name) => {
  return new Promise((resolve, reject) => {
    try {
      const key = `secure/kristagram/${name}.jpg`;

      //covert base64 to buffer
      const buffer = Buffer.from(data, "base64");

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key, // File name you want to save as in S3
        Body: buffer, // passed buffer data
        ACL: "public-read",
        region: process.env.AWS_S3_REGION,
        ContentEncoding: "base64",
        ContentType: `image/jpeg`,
      };

      // Uploading files to the bucket
      s3.upload(params, function (err, data) {
        if (err) {
          return reject(err);
        }
        var path = data.Key;

        resolve(path);
      });
    } catch (error) {
      console.log("error", error);
      return reject(error);
    }
  });
};

export default uploadFile;
