<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    let command = ':help'
    let logs = []

    const COMMAND_LIB = {
        help: () => {
            logs = [...logs, '====================HELLO====================']
            logs = [...logs, '']
            logs = [...logs, ':help']
            logs = [...logs, 'Show this help']
            logs = [...logs, ':assign']
            logs = [
                ...logs,
                'Assign each observation to the cluster with the nearest mean.',
            ]
            logs = [...logs, ':update']
            logs = [
                ...logs,
                'Recalculate means (centroids) for observations assigned to each cluster.',
            ]
            logs = [...logs, ':fit']
            logs = [
                ...logs,
                'Repeat :assign and :update until the assignments no longer change.',
            ]
        },
        assign: () => {
            dispatch('assign')
        },
        update: () => {
            dispatch('update')
        },
        fit: () => {
            dispatch('fit')
        },
    }

    function Excute() {
        if (command[0] == ':') {
            const cmd = command.slice(1)
            if (COMMAND_LIB[cmd]) {
                COMMAND_LIB[cmd]()
            } else {
                logs = [...logs, `Command not found: ${cmd}`]
            }
        }
        command = ''
    }

    const onKeyPress = (e) => {
        if (e.charCode === 13) Excute()
    }
</script>

<div class="terminal">
    <ul>
        {#each logs as log}
            <li>{log}</li>
        {/each}
    </ul>

    <input bind:value={command} on:keypress={onKeyPress} />
</div>

<style>
    .terminal {
        height: 100vh;
        width: 45ch;

        display: flex;
        flex-direction: column;

        font-family: 'Source Code Pro', monospace;
    }

    .terminal input {
        margin-top: auto;

        background: transparent;
        border: none;
        outline: none;
        border-radius: 0;

        color: white;
    }

    ul {
        padding: 0;
        margin: 0;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }
    li {
        list-style: none;
        padding: 0;

        text-align: left;
        color: white;
    }

    .terminal input::before {
        content: '>';
        color: white;
        height: 100%;
        width: 1ch;
    }
</style>
