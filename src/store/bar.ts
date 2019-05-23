import { VuexModule, Module, Action, RegisterOptions } from 'vuex-class-modules'

import { Foo } from './foo'

@Module
export class Bar extends VuexModule {

    private foo: Foo

    constructor(foo: Foo, options: RegisterOptions) {
        super(options)
        this.foo = foo
    }

    get sortedNames() {
        return [ ...this.foo.names ].sort()
    }

    @Action
    async clearNames() {
        const names = [...this.foo.names].reverse()
        let first = true
        for (const name of names) {
            if (first) {
                first = false
            } else {
                await new Promise((resolve) => setTimeout(() => resolve(), 80))
            }
            this.foo.removeName(name)
        }
    }

}

