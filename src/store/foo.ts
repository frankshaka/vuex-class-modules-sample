import { VuexModule, Module, Mutation } from 'vuex-class-modules'

@Module
export class Foo extends VuexModule {

    names: string[] = []

    @Mutation
    addName(name: string) {
        this.names = this.names.concat([name])
    }

    @Mutation
    removeName(name: string) {
        this.names = this.names.filter(n => n !== name)
    }

}

