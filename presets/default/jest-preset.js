module.exports = {
  preset: "jest-playwright-preset",
  moduleFileExtensions: ["js", "jsx", "json"],
  // support the same @ -> src alias mapping in source code
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // serializer for snapshots
  testMatch: ["**/tests/e2e/**/*.spec.[jt]s?(x)", "**/__tests__/*.[jt]s?(x)"],
  // https://github.com/facebook/jest/issues/6766
  watchPlugins: [
    require.resolve("jest-watch-typeahead/filename"),
    require.resolve("jest-watch-typeahead/testname"),
  ],
};
