module.exports = {

  mode: 'spa', //vue-qartがSSRに対応していないため

  /*
  ** Headers of the page
  */
  head: {
    title: 'XDS-Wallet-App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#2196F3' },


  // router:{
  //   middleware:["auth-cookie"]
  // },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },

    vendor: ['element-ui']

  },
  plugins: [
    '~plugins/element-ui'
  ],
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  modules: [
    // Simple usage
    'cookie-universal-nuxt',
 
    // With options
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
 ]
}

