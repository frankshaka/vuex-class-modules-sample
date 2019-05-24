import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import { Foo } from '~/store/foo'


Vue.use(Vuex)


describe('Foo', () => {

    it('should add name to names', () => {
        const store = new Store({})
        const foo = new Foo({ store, name: 'foo' })
        expect(foo.names.length).toBe(0)
        foo.addName('1234')
        expect(foo.names.length).toBe(1)
        expect(foo.names[0]).toBe('1234')
    })

    it('should remove name from names', () => {
        const store = new Store({})
        const foo = new Foo({ store, name: 'foo' })
        expect(foo.names.length).toBe(0)
        foo.addName('1234')
        expect(foo.names.length).toBe(1)
        expect(foo.names[0]).toBe('1234')
        foo.removeName('1234')
        expect(foo.names.length).toBe(0)
    })

})
