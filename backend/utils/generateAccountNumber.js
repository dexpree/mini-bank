const generateAccountNumber = () => {
  return "MB" + Date.now(); 
};

module.exports = generateAccountNumber;
