import { Util } from "cloudinary-core";

export const openUploadWidget = (options, callback) => {
  const scOptions = Util.withSnakeCaseKeys(options);
  console.log(scOptions)
  window.cloudinary.openUploadWidget(scOptions, callback);
};
