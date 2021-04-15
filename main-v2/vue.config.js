module.exports = {
  pages: {
    'index': {
      entry: './src/pages/main.js',
      template: 'public/index.html',
      title: 'Dashboard',
      chunks: [ 'chunk-vendors', 'chunk-common', 'index' ]
    },
  },
  transpileDependencies: [
    'vuetify'
  ]
}
