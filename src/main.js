import Vue from 'vue'
import App from './App.vue'
import {
  LayoutPlugin,
  IconsPlugin,
  BVToastPlugin,
  FormInputPlugin,
  BIcon,
  BIconBoxArrowUpRight
} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use( LayoutPlugin )
Vue.use( IconsPlugin )
Vue.use( BVToastPlugin )
Vue.use( FormInputPlugin )

Vue.component('BIcon', BIcon)
Vue.component('BIconArrowUp', BIconBoxArrowUpRight)

new Vue({
  render: h => h(App),
}).$mount('#app')
