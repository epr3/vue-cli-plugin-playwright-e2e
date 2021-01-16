const deepmerge = require("deepmerge");
const defaultPreset = require("../default/jest-preset");

module.exports = deepmerge(defaultPreset, {
  moduleFileExtensions: ["ts"],
  transform: {
    "^.+\\.tsx?$": require.resolve("ts-jest"),
  },
});
