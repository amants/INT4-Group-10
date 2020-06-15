const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const nextRuntimeDotenv = require('next-runtime-dotenv')

const withConfig = nextRuntimeDotenv({
  public: [
    'API_URL',
    'GOOGLE_CAPTCHA_V2_CLIENT_KEY',
    'GOOGLE_CAPTCHA_V3_CLIENT_KEY',
    'GA_KEY'
  ]
})

module.exports = withConfig(withPlugins([
  [optimizedImages, {
    optimizeImages: true,
  }],

  // your other plugins here

]));
