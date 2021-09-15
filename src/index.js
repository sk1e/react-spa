import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

let app = require('./server').default;

if (module.hot) {
  module.hot.accept('./server', function () {
    console.log('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = process.env.PORT || 3000;

export default express()
  .use(
    '/services',
    createProxyMiddleware({
      target: 'https://globallab.org/',
      changeOrigin: true,
    }),
  )
  .use((req, res) => app.handle(req, res))
  .listen(port, () => {
    console.log(`> Started on port ${port}`);
  });
