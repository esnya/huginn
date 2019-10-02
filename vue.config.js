module.exports = {
  configureWebpack: {
    module: {
      noParse: /firebase\/setup\.js$/,
    },
  },
  pages: {
    index: {
      entry: './src/main.ts',
      template: './src/templates/index.pug',
      favicon: './src/assets/エンジェリング.png',
    },
  },
};
