import Vue from 'vue'
import App from './App.vue'
import {
  LayoutPlugin,
  IconsPlugin,
  BVToastPlugin,
  FormInputPlugin,
  FormSelectPlugin,
  BIcon,
  BIconBoxArrowUpRight,
  BIconFlagFill,
  BIconClipboard
} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './main.scss'

import countries from 'i18n-iso-countries'
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

Vue.config.productionTip = false

Vue.use( LayoutPlugin )
Vue.use( IconsPlugin )
Vue.use( BVToastPlugin )
Vue.use( FormInputPlugin )
Vue.use( FormSelectPlugin )

Vue.component('BIcon', BIcon)
Vue.component('BIconArrowUp', BIconBoxArrowUpRight)
Vue.component('BIconFlagFill', BIconFlagFill)
Vue.component('BIconClipboard', BIconClipboard)

new Vue({
  render: h => h(App),
}).$mount('#app')
