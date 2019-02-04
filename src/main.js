import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueLodash from 'vue-lodash'
import draggable from 'vuedraggable'


/** Для перетаскивания элементов списка взял готовое решение - https://github.com/SortableJS/Vue.Draggable
       */
Vue.component('draggable', draggable)
Vue.use(VueLodash)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAcbre1LhlyGfOPtN1EUAbpLfynXb-aeKs',
    libraries: 'places',
  },

})
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
