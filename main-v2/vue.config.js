module.exports = {
  pages: {
    'index': {
      entry: './src/pages/dashboard/main.js',
      template: 'public/index.html',
      title: 'Dashboard',
      chunks: [ 'chunk-vendors', 'chunk-common', 'index' ]
    },
    'login': {
      entry: './src/pages/login/main.js',
      template: 'public/index.html',
      title: 'Login',
      chunks: [ 'chunk-vendors', 'chunk-common', 'login' ]
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}
