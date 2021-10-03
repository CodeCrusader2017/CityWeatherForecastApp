import { checkUserInput } from '../src/client/js/checkUserInput' 

test('Checks user input is valid', () => {
  //expect(addEventListener).toBeNull();
  expect(checkUserInput("")).toBe(false);
});

module.exports = checkUserInput;



