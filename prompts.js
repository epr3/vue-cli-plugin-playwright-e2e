module.exports = (pkg) => {
  const prompts = [];

  if (
    "@vue/cli-plugin-unit-mocha" in (pkg.devDependencies || {}) ||
    "@vue/cli-plugin-unit-jest" in (pkg.devDependencies || {})
  ) {
    return prompts;
  }

  prompts.push({
    type: "list",
    name: "testingFramework",
    message: "Choose a testing framework for Playwright:",
    choices: ["Jest", "Mocha"],
    filter: function (val) {
      return val.toLowerCase();
    },
  });

  return prompts;
};
