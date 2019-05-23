# vuex-class-modules-sample

This project demonstrates a practice of how to adopt [vuex-class-modules](https://github.com/gertqin/vuex-class-modules) in a Vue.js project written in TypeScript.

## Run

Enter `npm start` (after `npm install`) in Terminal, then open a web browser, and navigate to `http://localhost:1234`. This is a simple web app with two buttons and a div. When the "Add" button is clicked, a random number is appended to the div. When the "Remove All" button is clicked, all numbers are removed.

## Type-safe

I have the following requirements for a *type-safe* Vue/Vuex practice:

- Support Vuex modules with namespaces;
- Support easily mapping Vuex assets into a Vue component, in a type-safe way;
- Access state/getters/mutations/actions of any Vuex module, from anywhere (especially from within another module), in a type-safe way;
- (Optionally) Support watching for any state/getter, *outside* a Vue component, in a type-safe way;

I've searched through a bunch of Vuex type-safe libraries, and found `vuex-class-modules` the most satisfying with the above requirements.

> Support Vuex modules with namespaces;

`vuex-class-modules` supports this from the ground up.

> Support easily mapping Vuex assets into a Vue component, in a type-safe way;

`vuex-class-modules` does not provide mapping/binding helpers, but it allows us to directly access module properties/methods, so we can make getters and methods easily in a Vue component class (decorated by `vue-class-component`), like this:

```typescript
import { someModule } from '~/store'

@Component
export default class App extends Vue {
    // State
    get property() { return someModule.property }
    // Getters
    get getter() { return someModule.getter }
    // Mutations
    commitMutation = someModule.commitMutation
    // Actions
    dispatchAction = someModule.dispatchAction
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

Using `vuex-class-modules` is more straight-forward and requiring less typings as well as less dependencies.

> Access state/getters/mutations/actions of any Vuex module, from anywhere (especially from within another module), in a type-safe way;

In a large-scale app that relies heavily on a Vuex store, we may have to split the store into multiple modules, where some modules may require others' state/getters/mutations/actions to fulfil their own responsibilities. In a conventional Vuex store definitions, we achieve this by accessing `rootState`/`rootGetters` or commit/dispatch with `{ root: true }` as the third parameter. Using `vuex-class-modules`, we can define private properties for external modules, and receive functional module objects via constructor parameters:

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

This is way more intuitive and convenient, and also type-safe.

> (Optionally) Support watching any state/getter, *outside* a Vue component, in a type-safe way;

As a convenience method, `vuex-class-modules` provides `someModule.$watch()` for watching state/getter changes.

```typescript
import { someModule } from './store'

someModule.$watch(
    m => m.someGetter,
    (newValue, oldValue) => { console.log(newValue, oldValue) }
)
```

However, since we can access module objects and their properties directly, we can also define watch behaviors using `store.watch()`:

```typescript
import { store, someModule } from './store'

store.watch(
    () => someModule.someState,
    (newValue, oldValue) => { console.log(newValue, oldValue) }
)
```

Before [this issue](https://github.com/gertqin/vuex-class-modules/issues/15) is fixed, we have to use `store.watch()` for watching state and getter changes, while `someModule.$watch()` breaks when watching for state changes.
