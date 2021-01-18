module.exports = (api, options) => {
  const {
    info,
    chalk,
    execa,
    resolveModule,
    loadModule,
    semver,
  } = require("@vue/cli-shared-utils");

  let registerCommand = {};

  if (api.hasPlugin("unit-jest") || options.testingFramework === "jest") {
    registerCommand = {
      options: {
        "--watch": "run tests in watch mode",
      },
      details:
        `All jest command line options are supported.\n` +
        `See https://facebook.github.io/jest/docs/en/cli.html for more details.`,
    };
    console.log("has-jest");
  }

  if (api.hasPlugin("unit-mocha") || options.testingFramework === "mocha") {
    console.log("has-mocha");
    registerCommand = {
      options: {
        "--watch, -w": "run in watch mode",
        "--grep, -g": "only run tests matching <pattern>",
        "--slow, -s": '"slow" test threshold in milliseconds',
        "--timeout, -t": "timeout threshold in milliseconds",
        "--bail, -b": "bail after first test failure",
        "--require, -r": "require the given module before running tests",
        "--include": "include the given module into test bundle",
        "--inspect-brk": "Enable inspector to debug the tests",
      },
      details:
        `The above list only includes the most commonly used options.\n` +
        `For a full list of available options, see\n` +
        `https://sysgears.github.io/mochapack/docs/installation/cli-usage.html`,
    };
  }

  if (options.testingFramework === "mocha") {
    api.chainWebpack((webpackConfig) => {
      const vue = loadModule("vue", api.service.context);
      const isVue3 = vue && semver.major(vue.version) === 3;

      // when target === 'node', vue-loader will attempt to generate
      // SSR-optimized code. We need to turn that off here.
      webpackConfig.module
        .rule("vue")
        .use("vue-loader")
        .tap((options) => {
          if (isVue3) {
            options.isServerBuild = false;
          } else {
            options.optimizeSSR = false;
          }

          return options;
        });
    });
  }

  api.registerCommand(
    "test:e2e",
    {
      description: "run e2e tests with Playwright",
      usage: "vue-cli-service test:e2e [options]",
      ...registerCommand,
    },
    async (args, rawArgs) => {
      info(`Starting e2e tests...`);

      //   const { url, server } = args.url
      //     ? { url: args.url }
      //     : await api.service.run("serve");

      //   const configs =
      //     typeof args.config === "string" ? args.config.split(",") : [];
      // }
    }
  );
};

module.exports.defaultModes = {
  "test:e2e": "production",
};
