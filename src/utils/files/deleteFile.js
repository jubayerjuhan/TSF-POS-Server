import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// creating __dirname variable for es6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteFile = (folder, filename) => {
  // Get the absolute path to the file you want to delete
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "images",
    `${folder}`,
    `${filename}`
  );

  console.log(filePath);
  // Use the unlink method to delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File deleted successfully");
  });
};

export default deleteFile;
