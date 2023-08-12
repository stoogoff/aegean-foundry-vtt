
import Vue from 'vue'

Vue.filter('localise', value => game.i18n.localize(value))
