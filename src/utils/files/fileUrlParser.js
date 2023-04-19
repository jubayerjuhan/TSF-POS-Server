export const fileUrlParser = (file) => {
  const destinationFolder = file.destination.split("src/images")[1];
  return destinationFolder + "/" + file.filename;
};
