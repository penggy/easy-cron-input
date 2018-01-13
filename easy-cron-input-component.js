import EasyCronInput from 'components/EasyCronInput.vue'

EasyCronInput.install = function(Vue) {
     if (typeof window !== 'undefined' && window.Vue) {
          Vue = window.Vue
     }
     Vue.component(EasyCronInput.name, EasyCronInput);
}

export default EasyCronInput