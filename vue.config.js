module.exports = {
  pages: {
    index: {
      entry: './src/main.ts',
      template: './src/templates/index.pug',
      favicon: './src/assets/icon.png',
    },
  },
  pwa: {
    workboxOptions: {
      importWorkboxFrom: 'local',
    },
  },
};
