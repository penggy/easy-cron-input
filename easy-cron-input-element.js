import Vue from 'vue'

import 'document-register-element/build/document-register-element'
import VueCustomElement from 'vue-custom-element'

Vue.use(VueCustomElement)

import EasyCronInput from 'components/EasyCronInput.vue'
Vue.customElement(EasyCronInput.name, EasyCronInput)