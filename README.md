# vuex-class-modules-sample

This project demonstrates a practice of how to adopt [vuex-class-modules](https://github.com/gertqin/vuex-class-modules) in a [Vue.js](https://vuejs.org) project written in TypeScript.

## Run

Enter `npm start` (after `npm install`) in Terminal, then open a web browser, and navigate to `http://localhost:1234`. This is a simple web app with two buttons and a div. When the "Add" button is clicked, a random number is appended to the div. When the "Remove All" button is clicked, all numbers are removed. If the generated number contains the number "4", it will be automatically removed from the list.

## Type-safe

I have the following requirements for a *type-safe* Vue+Vuex practice:

- Support namespaced modules, with types;
- Support module dependencies, in a type-safe way;
- Support working with Vue components, in a type-safe way;
- Support working outside Vue components, in a type-safe way;
- (Optionally) Support property watching, in a type-safe way;
- (Optionally) Support unit testing, in a type-safe way;

I've searched through [a bunch of Vuex type-safe libraries](https://www.npmjs.com/search?q=vuex%20type), and found `vuex-class-modules` the most satisfying with the above requirements.

### Namespaced Modules

`vuex-class-modules` supports namespaced Vuex module from the ground up. And it's great to see that it supports *only* namespaced modules, because I think [non-namespaced modules are a design disaster](https://github.com/vuejs/vuex/issues/855).

### Module Dependencies

In a large-scale app that relies heavily on a Vuex store, we may have to split the store into multiple modules, where some modules may require others' state/getters/mutations/actions to fulfil their own responsibilities, thus forming *module dependencies*. In a conventional Vuex store, we achieve this by accessing `rootState`/`rootGetters` and/or commit/dispatch with `{ root: true }`, which has no type checking support and has a great possibility to cause *dependency cycles*. Using `vuex-class-modules`, we can declare dependent modules explicitly as private properties and receive them via constructor parameters:

```typescript
/// store/bar.ts
import { VuexModule, Module, RegisterOptions } from 'vuex-class-modules'
import { Foo } from './foo'

@Module
export class Bar extends VuexModule {
    private foo: Foo
    constructor(foo: Foo, options: RegisterOptions) {
        super(options)
        this.foo = foo
    }
    get getter() {
        return this.foo.state
    }
}

/// store/index.ts
import { Store } from 'vuex'
import { Foo } from './foo'
import { Bar } from './bar'

export const store = new Store({})
export const foo = new Foo({ store, name: 'foo' })
export const bar = new Bar(foo, { store, name: 'bar' })
```

Now it's impossible to create dependency cycles because you have to create dependent modules in prior.

### Working With Vue Components

`vuex-class-modules` does not provide mapping/binding helpers, but it allows us to directly access module properties/methods, so we can make computed properties and methods easily in a Vue component class (decorated by `vue-class-component`), like this:

```typescript
import { someModule } from '~/store'

@Component
export default class App extends Vue {
    // State
    get someState() { return someModule.someState }  // types are inferred automatically
    // Getters
    get someGetter() { return someModule.someGetter }  // types are inferred automatically
    // Mutations
    commitMutation = someModule.commitMutation  // types are inferred automatically
    // Actions
    dispatchAction = someModule.dispatchAction  // types are inferred automatically
}
```

Compare it with decorated mappers (using `vuex-class`):

```typescript
import { namespace } from 'vuex-class'

import { SomeModule } from '~/store/some-module'

const someModule = namespace('someModule')

@Component
export default class App extends Vue {
    // State
    @someModule.State property: typeof SomeModule.prototype.property
    // Getters
    @someModule.Getter getter: typeof SomeModule.prototype.getter
    // Mutations
    @someModule.Mutation commitMutation: typeof SomeModule.prototype.commitMutation
    // Actions
    @someModule.Action dispatchAction: typeof SomeModule.prototype.dispatchAction
}
```

Using `vuex-class-modules` is more straight-forward and requires less typings as well as less third-party libraries.

### Working Outside Vue Components

Vuex modules defined using `vuex-class-modules` can be accessed directly by simply importing it from anywhere, which is useful when defining plugins and helpers, in a type-safe way compared with `store.getters['xxx']`, `store.commit()` and `store.dispatch()`.

```typescript
import { someEventEmitter } from '~/someEventEmitter'
import { foo } from '~/store'

someEventEmitter.on('some-event', (event) => {
    if (foo.someGetter === 'xxx') {
        foo.commitMutation(event.value)  // type checking happens against `event.value`
    } else {
        foo.dispatchAction().then(() => {
            foo.commitMutation(event.value)   // type checking happens against `event.value`
        })
    }
})
```

### Property Watching

As a convenience method, `vuex-class-modules` provides `someModule.$watch()` for watching changes of a particular state or getter.

```typescript
import { someModule } from '~/store'
import { someFunction } from '~/someFeature'

someModule.$watch(
    m => m.someGetter,
    (newValue, oldValue) => {  // types are inferred automatically
        someFunction(newValue)   // type checking happens against `newValue`
    }
)
```

However, since we can access module properties directly, we can also define watch behaviors using `store.watch()`:

```typescript
import { store, someModule } from '~/store'
import { someFunction } from '~/someFeature'

store.watch(
    () => someModule.someState,
    (newValue, oldValue) => {  // types are inferred automatically
        someFunction(newValue)   // type checking happens against `newValue`
    }
)
```

Before [this issue](https://github.com/gertqin/vuex-class-modules/issues/15) is fixed, we have to use `store.watch()` in general, because `someModule.$watch()` breaks for watching state changes and works only for getters.

## Unit Testing

Some other libraries like [vuex-module-decorators](https://github.com/championswimmer/vuex-module-decorators) force a module class to create one single instance globally (accessible via `getModule(SomeModule)`). This is not friendly in a unit testing environment where we may want to construct multiple module instances within a single test suite.

`vuex-class-modules` avoid this drawback and allows us to create as many as module instances of a single module class. This provides great flexibility for us to organize our test cases.

P.S. I spent some time setting up an environment for testing module classes defined using `vuex-class-modules`. The trickiest part is to transpile all `node_modules/vuex-class-modules/lib/*.js` files when executing tests, because these files are not plain JavaScript (e.g. `export { Action } from './actions'` in `vuex-class-modules/lib/index.js`) which cause fatal errors. I finally solved it by whitelisting all .js files in `vuex-class-modules` for transformation and setting `ts-jest/presets/js-with-ts` as the Jest preset with `"allowJs": true` in TypeScript configuration for the testing environment.
