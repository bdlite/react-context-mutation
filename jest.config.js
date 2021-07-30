module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx"
  ],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.jsx$": "babel-jest",
    "^.+\\.ts$": "ts-jest",
    "^.+\\.tsx$": "ts-jest"
  },
  globals: {
    "window": true,
    "ts-jest": {
      "tsConfig": "tsconfig.json"
    }
  },
  testMatch: [
    "<rootDir>/\_\_tests\_\_/\*\*/\*.js?(x)"
  ],
};