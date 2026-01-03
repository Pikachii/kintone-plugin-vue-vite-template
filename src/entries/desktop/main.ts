import { createApp } from 'vue';
import App from './App.vue';

((_pluginId) => {
  const app = createApp(App);
  app.mount(`#app`);
})('');