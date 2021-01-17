module.exports = (api, options, rootOptions, invoking) => {
  if (api.hasPlugin("unit-jest") || options.testingFramework === "jest") {
    api.render("./template-jest", { hasTS: api.hasPlugin("typescript") });
  }
  if (api.hasPlugin("unit-mocha") || options.testingFramework === "mocha") {
    api.render("./template-mocha", { hasTS: api.hasPlugin("typescript") });
  }

  let extendPackage = {};

  if (options.testingFramework === "jest") {
    extendPackage = {
      jest: {
        preset: api.hasPlugin("babel")
          ? "@vue/cli-plugin-unit-jest"
          : "@vue/cli-plugin-unit-jest/presets/no-babel",
      },
    };
  }

  if (options.testingFramework === "mocha") {
    // mochapack currently does not support webpack 5 yet
    require("@vue/cli-plugin-webpack-4/generator")(
      api,
      {},
      rootOptions,
      invoking
    );

    extendPackage = {
      devDependencies: {
        "@vue/cli-plugin-webpack-4": require("../package.json").dependencies[
          "@vue/cli-plugin-webpack-4"
        ],
        chai: "^4.2.0",
      },
    };
  }

  api.extendPackage({
    scripts: {
      "test:e2e": "vue-cli-service test:e2e",
      ...extendPackage,
    },
  });

  if (api.hasPlugin("eslint")) {
    applyESLint(api, options);
  }

  if (api.hasPlugin("typescript")) {
    applyTS(api, options, invoking);
  }
};

const applyESLint = (module.exports.applyESLint = (api, options) => {
  if (options.testingFramework === "jest") {
    api.extendPackage({
      eslintConfig: {
        overrides: [
          {
            files: [
              "**/__tests__/*.{j,t}s?(x)",
              "**/tests/unit/**/*.spec.{j,t}s?(x)",
            ],
            env: {
              jest: true,
            },
          },
        ],
      },
    });
  }
  if (options.testingFramework === "mocha") {
    api.extendPackage({
      eslintConfig: {
        overrides: [
          {
            files: [
              "**/__tests__/*.{j,t}s?(x)",
              "**/tests/unit/**/*.spec.{j,t}s?(x)",
            ],
            env: {
              mocha: true,
            },
          },
        ],
      },
    });
  }
});

const applyTS = (module.exports.applyTS = (api, options, invoking) => {
  if (options.testingFramework === "jest") {
    api.extendPackage({
      jest: {
        preset: api.hasPlugin("babel")
          ? "@vue/cli-plugin-unit-jest/presets/typescript-and-babel"
          : "@vue/cli-plugin-unit-jest/presets/typescript",
      },
      devDependencies: {
        "@types/jest": "^26.0.19",
      },
    });

    if (invoking) {
      // inject jest type to tsconfig.json
      api.render((files) => {
        const tsconfig = files["tsconfig.json"];
        if (tsconfig) {
          const parsed = JSON.parse(tsconfig);
          if (
            parsed.compilerOptions.types &&
            !parsed.compilerOptions.types.includes("jest")
          ) {
            parsed.compilerOptions.types.push("jest");
          }
          files["tsconfig.json"] = JSON.stringify(parsed, null, 2) + "\n";
        }
      });
    }
  }

  if (options.testingFramework === "mocha") {
    api.extendPackage({
      devDependencies: {
        "@types/mocha": "^8.0.4",
        "@types/chai": "^4.2.11",
      },
    });
    // inject mocha/chai types to tsconfig.json
    if (invoking) {
      api.render((files) => {
        const tsconfig = files["tsconfig.json"];
        if (tsconfig) {
          const parsed = JSON.parse(tsconfig);
          const types = parsed.compilerOptions.types;
          if (types) {
            if (!types.includes("mocha")) {
              types.push("mocha");
            }
            if (!types.includes("chai")) {
              types.push("chai");
            }
          }
          files["tsconfig.json"] = JSON.stringify(parsed, null, 2) + "\n";
        }
      });
    }
  }
});
