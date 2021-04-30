<script>
    import { createEventDispatcher, beforeUpdate, afterUpdate } from 'svelte'
    import { logs } from './store'
    const dispatch = createEventDispatcher()

    let history = []
    let command = ':help'
    let term_logs
    logs.subscribe((value) => {
        term_logs = value
    })

    let logs_list
    let autoscroll

    beforeUpdate(() => {
        autoscroll =
            logs_list &&
            logs_list.offsetHeight + logs_list.scrollTop >
                logs_list.scrollHeight - 20
    })

    afterUpdate(() => {
        if (autoscroll) logs_list.scrollTo(0, logs_list.scrollHeight)
    })

    const COMMAND_LIB = {
        help: () => {
            logs.update((l) => [...l, ''])
            logs.update((l) => [
                ...l,
                '==============K-MEANS CLUSTERING==============',
            ])
            logs.update((l) => [...l, ''])
            logs.update((l) => [...l, ':help'])
            logs.update((l) => [...l, 'Show this help'])
            logs.update((l) => [...l, ':assign'])
            logs.update((l) => [
                ...l,
                'Assign each observation to the cluster with the nearest mean.',
            ])
            logs.update((l) => [...l, ':update'])
            logs.update((l) => [
                ...l,
                'Recalculate means (centroids) for observations assigned to each cluster.',
            ])
            logs.update((l) => [...l, ':fit'])
            logs.update((l) => [
                ...l,
                'Repeat :assign and :update until the assignments no longer change.',
            ])
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
        history: () => {
            history.forEach((c) => {
                logs.update((l) => [...l, c])
            })
        },
    }

    function Excute() {
        if (command[0] == ':') {
            history.push(command)
            const cmd = command.slice(1)
            if (COMMAND_LIB[cmd]) {
                logs.update((l) => [...l, `USER>${cmd}`])
                COMMAND_LIB[cmd]()
            } else {
                logs.update((l) => [...l, `Command not found: ${cmd}`])
            }
        }
        command = ''
    }

    function updateScroll() {
        var element = document.getElementById('yourDivID')
        element.scrollTop = element.scrollHeight
    }

    const onKeyPress = (e) => {
        if (e.charCode === 13) Excute()
    }
</script>

<div class="terminal">
    <div class="logs">
        <ul bind:this={logs_list}>
            {#each term_logs as log}
                <li>{log}</li>
            {/each}
        </ul>
    </div>

    <input bind:value={command} on:keypress={onKeyPress} autofocus />
</div>

<style>
    .terminal {
        height: 100vh;
        width: 45ch;

        display: grid;
        flex-direction: column;
        grid-auto-rows: 1fr auto;

        font-size: 14px;
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

    .logs {
        height: 100%;
        width: 100%;
        overflow: hidden;
        position: relative;
    }
    ul {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: -15px;
        overflow: auto;

        padding: 0;
        margin: 0;

        scrollbar-width: 4px;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    ul::-webkit-scrollbar {
        width: 4px;
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
