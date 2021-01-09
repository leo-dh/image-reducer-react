const path = require('path');
exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: require.resolve('@open-wc/webpack-import-meta-loader'),
        },
      ],
    },
  });
  actions.setWebpackConfig({
    resolve: {
      alias: {
        Codecs: path.resolve(__dirname, 'static/codecs'),
      },
    },
  });
};
