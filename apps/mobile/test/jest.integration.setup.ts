afterEach(() => {
  jest.clearAllMocks();
});

jest.setTimeout(10000);


jest.mock("react-native-worklets", () => require("react-native-worklets/src/mock"));