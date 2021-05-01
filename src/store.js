import { writable } from 'svelte/store'

export const logs = writable(["Try 'help' command"])

export const Print = (message) => {
    logs.update((l) => [...l, message])

    // console.log(logs)
    if (logs.length > 100) {
        logs.set(logs.slice(0, logs.length - 100))
    }
}

export const BreakLine = () => {
    logs.update((l) => [...l, 1])
}

export const ClearLog = () => {
    logs.set([])
}

export const Prompt = (command) => {
    Print(`USER>${command}`)
}
