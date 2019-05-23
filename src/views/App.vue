<template>

<div id="app">
    <button @click="add" :disabled="addButtonDisabled">Add</button>
    <button @click="removeAll" :disabled="removeAllButtonDisabled">Remove All</button>
    <p>{{ nameString }}</p>
</div>    

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

// Obtain operational Vuex modules
import { foo, bar } from '~/store'

@Component
export default class App extends Vue {

    addButtonDisabled: boolean = false
    removeAllButtonDisabled: boolean = false

    //
    // Map Vuex assets
    // Types are inferred automatically
    //

    // Vuex State
    get names() { return foo.names }

    // Vuex Getters
    get sortedNames() { return bar.sortedNames }

    // Vuex Mutations
    addName = foo.addName

    // Vuex Actions
    clearNames = bar.clearNames

    //
    // Vue computed properties
    //

    get nameString() {
        return `[ ${this.sortedNames.join(', ')} ]`  // Type-safe here
    }

    //
    // Vue methods
    //

    add() {
        const name = Math.floor(Math.random() * 10000).toString()
        this.addName(name)   // Type-safe here
    }

    removeAll() {
        this.addButtonDisabled = true
        this.removeAllButtonDisabled = true

        this.clearNames().then(() => {   // Type-safe here
            this.addButtonDisabled = false
            this.removeAllButtonDisabled = false
        })
    }

}
</script>
