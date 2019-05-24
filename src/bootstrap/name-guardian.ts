import { foo, store } from '~/store'

let timeout: NodeJS.Timeout | null = null

store.watch(
    () => {
        return foo.names
    },
    (names) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            const badNames = names.filter((name) => name.includes('4'))
            for (const name of badNames) {
                foo.removeName(name)
            }
        }, 400)
    },
)
