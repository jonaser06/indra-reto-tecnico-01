/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "@shelf/jest-dynamodb",
  testEnvironment: "node",
  collectCoverage: true,
  verbose: true,
  testMatch: ["**/*.(test|steps).+(ts|tsx|js)"],
  setupFiles: ["dotenv/config"],
  coveragePathIgnorePatterns: ["/node_modules/", "/test/", "/dist/", "/src/common/"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: false,
        testEnvironment: "node",
        collectCoverage: true,
      },
    ],
  },
};
