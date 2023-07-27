import multer from "multer";

// Multer configuration (for image upload)
const storage = multer.diskStorage({});

export const multerUpload = multer({ storage });
