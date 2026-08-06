const t = require('@babel/types');

module.exports = function importMetaEnvPlugin() {
  return {
    name: 'replace-import-meta-env',
    visitor: {
      MemberExpression(path) {
        const { node } = path;
        if (
          node.object &&
          node.object.type === 'MetaProperty' &&
          node.object.meta &&
          node.object.meta.name === 'import' &&
          node.object.property &&
          node.object.property.name === 'meta' &&
          !node.computed &&
          node.property &&
          node.property.type === 'Identifier' &&
          node.property.name === 'env'
        ) {
          path.replaceWith(
            t.memberExpression(
              t.identifier('globalThis'),
              t.identifier('__import_meta_env__')
            )
          );
          path.skip();
        }
      }
    }
  };
};