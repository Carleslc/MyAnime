export default async ({ Vue }) => {
  function kebabCase(s) {
    return s
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  const ComponentContext = require.context('components/', true, /\.vue$/i, 'lazy');

  ComponentContext.keys().forEach((componentFilePath) => {
    const componentName = kebabCase(componentFilePath.split('/').pop().split('.')[0]);
    Vue.component(componentName, () => ComponentContext(componentFilePath));
  });
};
