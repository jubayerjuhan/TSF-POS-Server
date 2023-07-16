function generateSaleId() {
  const timestamp = Date.now().toString(); // Get the current timestamp as a string
  const randomNum = Math.floor(Math.random() * 9000) + 1000; // Generate a random number between 1000 and 9999
  const uniqueNumber = timestamp.substr(-4) + randomNum.toString(); // Combine timestamp and random number

  return uniqueNumber;
}

export default generateSaleId;
