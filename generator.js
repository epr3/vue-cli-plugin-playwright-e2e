const path = require("path");

module.exports = (api, options, rootOptions) => {
  let devDependencies = {};
  let plugin = "";
  if (options.testingFramework === "jest") {
    plugin = "vue-cli-plugin-playwright-jest";
    devDependencies = {
      [plugin]: "^1.0.0",
    };
  }
  if (options.testingFramework === "mocha") {
    plugin = "vue-cli-plugin-playwright-mocha";
    devDependencies = {
      [plugin]: "^1.0.0",
    };
  }

  api.extendPackage({
    devDependencies,
  });

  api.onCreateComplete(() => {
    require("child_process").spawnSync("vue", ["invoke", plugin], {
      stdio: "inherit",
      cwd: path.join(process.cwd(), rootOptions.projectName),
    });
  });
};
