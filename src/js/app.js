// Import Vue
import Vue from 'vue';
import VueMasonry from 'vue-masonry-css'
import VueLazyload from 'vue-lazyload'



// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import Framework7-Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import App Component
import App from '../components/app.vue';

import store from './store'
// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

Vue.use(VueMasonry);



Vue.use(VueLazyload, {
  preLoad: 1.5,
  
})

// Init App
new Vue({
  el: '#app',
  store,
  render: (h) => h(App),

  // Register App Component
  components: {
    app: App
  },
});