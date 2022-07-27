import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    ENV: process.env.UMI_ENV,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
});
