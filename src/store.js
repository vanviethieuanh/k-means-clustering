import { writable } from 'svelte/store'

export const logs = writable(["Try 'help' command"])

export const Print = (message) => {
    logs.update((l) => {
        if (l.length > 100) {
            return [...l, message].slice(l.length - 100)
        }
        return [...l, message]
    })
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
