import Vue from "vue";
import VueApollo from 'vue-apollo'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createProvider } from './vue-apollo'
import './assets/main.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount("#app");
