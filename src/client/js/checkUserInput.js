//Generic function to check user input is not blank (i.e. can be used to check not just city name if the application is modified in future to check other user input)
function checkUserInput(inputText) {  
  if(inputText != "") {
      return true;
  } else {
      return false;
  }
}

export { checkUserInput }