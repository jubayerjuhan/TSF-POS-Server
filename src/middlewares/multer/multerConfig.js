import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create new storage with dynamic destination folder
const createStorage = (folderName) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const folderPath = path.join(__dirname, "..", "..", "images", folderName);
      console.log("Destination folder path: ", folderPath); // Add this line
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = uuidv4();
      const fileExt = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
    },
  });
};

// Example usage: Create upload function for avatars and products
export const avatarUpload = multer({ storage: createStorage("avatars") });
export const productUpload = multer({ storage: createStorage("products") });
