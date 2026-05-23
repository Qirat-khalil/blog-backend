// import dotenv from "dotenv";
// dotenv.config()

// import ImageKit from 'imagekit';
// const res = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: process.env.IMAGEKIT_URL_END_POINT,


// });
// console.log("PUBLIC KEY:", process.env.IMAGEKIT_PUBLIC_KEY)
// console.log("PRIVATE KEY:", process.env.IMAGEKIT_PRIVATE_KEY)
// console.log("URL:", process.env.IMAGEKIT_URL_END_POINT)
// // console.log("publiccccccccc keyyy",publicKey);


// async function uploadImage(buffer) {
//   try {
//     const result = await res.files.upload({
//       file: buffer.toString('base64'), 
//       fileName: "image.jpg",           
//     });
//     return result;
//   } catch (error) {
//     console.error("Upload failed:", error.message);
//     throw error;
//   }
// }

// export default uploadImage;

import dotenv from "dotenv";
dotenv.config()

import ImageKit from 'imagekit';

// console.log("PUBLIC KEY:", process.env.IMAGEKIT_PUBLIC_KEY)

const res = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_END_POINT,
});

async function uploadImage(buffer) {

  try {

    const result = await res.upload({

      file: buffer.toString('base64'),

      fileName: "image.jpg",
    });

    return result;

  } catch (error) {

    console.error(
      "Upload failed:",
      error.message
    );

    throw error;
  }
}



const deleteImage = async (fileId) => {

  try {

    const result = await res.deleteFile(fileId)
console.log('result---->',result);

    return result

  } catch (error) {

    console.log(error)

    throw error
  }
}

export { uploadImage, deleteImage };

























// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_APIKEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// // ======================
// // Upload Image Function
// // ======================

// const uploadImg = async (file) => {
//   try {

//     // File check
//     if (!file) {
//       throw new Error("File not found");
//     }

//     console.log("req.file ---->", file);

//     // Dynamic file name
//     const fileName = `blog-${
//       file.originalname.split(".")[0]
//     }_${Date.now()}`;

//     console.log("fileName ---->", fileName);

//     // Upload to cloudinary
//     const uploadResult = await new Promise((resolve, reject) => {

//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           public_id: fileName,
//           folder: "blogs",
//           use_filename: true,
//           unique_filename: true,
//           overwrite: false,
//           resource_type: "auto",
//         },

//         (error, result) => {

//           if (error) {
//             console.log("cloudinary error ---->", error);
//             return reject(error);
//           }

//           console.log("cloudinary result ---->", result);

//           resolve(result);
//         }
//       );

//       // Send file buffer to cloudinary
//       uploadStream.end(file.buffer);
//     });

//     console.log("uploadResult ---->", uploadResult);

//     // Return useful data
//     return {
//       image: uploadResult.secure_url,
//       public_id: uploadResult.public_id,
//     };

//   } catch (error) {

//     console.log("Upload Error ---->", error);

//     throw error;
//   }
// };

// // ======================
// // Delete Image Function
// // ======================

// const deleteImg = async (public_id) => {
//   try {

//     if (!public_id) {
//       throw new Error("Public ID is required");
//     }

//     const result = await cloudinary.uploader.destroy(public_id, {
//       resource_type: "image",
//     });

//     console.log("Delete Result ---->", result);

//     return result;

//   } catch (error) {

//     console.log("Delete Error ---->", error);

//     throw error;
//   }
// };

// export { uploadImg, deleteImg };