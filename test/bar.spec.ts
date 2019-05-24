import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import { Foo } from '~/store/foo'
import { Bar } from '~/store/bar'


Vue.use(Vuex)


describe('Bar', () => {

    describe('sortedNames', () => {

        it('should get names from foo', () => {
            const store = new Store({})
            const foo = new Foo({ store, name: 'foo' })
            const bar = new Bar(foo, { store, name: 'bar' })
            expect(bar.sortedNames.length).toBe(0)
            foo.addName('1234')
            expect(bar.sortedNames.length).toBe(1)
            expect(bar.sortedNames[0]).toBe('1234')
        })

        it('should have the names sorted', () => {
            const store = new Store({})
            const foo = new Foo({ store, name: 'foo' })
            const bar = new Bar(foo, { store, name: 'bar' })
            expect(foo.names.length).toBe(0)
            expect(bar.sortedNames.length).toBe(0)
            foo.addName('456')
            foo.addName('123')
            expect(foo.names.length).toBe(2)
            expect(foo.names[0]).toBe('456')
            expect(foo.names[1]).toBe('123')
            expect(bar.sortedNames.length).toBe(2)
            expect(bar.sortedNames[0]).toBe('123')
            expect(bar.sortedNames[1]).toBe('456')
        })

    })

    describe('clearNames', () => {

        it('should remove all names', async () => {
            const store = new Store({})
            const foo = new Foo({ store, name: 'foo' })
            const bar = new Bar(foo, { store, name: 'bar' })
            expect(foo.names.length).toBe(0)
            foo.addName('456')
            foo.addName('123')
            expect(foo.names.length).toBe(2)
            expect(foo.names[0]).toBe('456')
            expect(foo.names[1]).toBe('123')

            await bar.clearNames()
            expect(foo.names.length).toBe(0)
        })

    })

})
