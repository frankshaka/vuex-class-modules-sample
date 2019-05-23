import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import { Foo } from './foo'
import { Bar } from './bar'


Vue.use(Vuex)


// Create the Vuex store
export const store = new Store({})


// Register Vuex modules
export const foo = new Foo({ store, name: 'foo' })
export const bar = new Bar(foo, { store, name: 'bar' })  // bar relies upon foo
