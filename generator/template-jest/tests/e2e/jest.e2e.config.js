module.exports = {
  preset: <%_ if (hasTS) { _%><%_ if (hasBabel) { _%>"vue-cli-plugin-playwright-e2e/presets/typescript-and-babel"<%_ } else { _%>"vue-cli-plugin-playwright-e2e/presets/typescript"<%_ } _%><%_ } else { _%>"vue-cli-plugin-playwright-e2e/presets/default"<%_ } _%>
};
