// __mocks__/lodash/isEqual.js
const isEqual = jest.fn((a, b) => {
  return a === b;
});

export default isEqual;
