<script>
    import { createEventDispatcher, beforeUpdate, afterUpdate } from 'svelte'
    import { logs } from './store'
    const dispatch = createEventDispatcher()

    let history = []
    let command = 'help'
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
            logs.update((l) => [...l, 'help'])
            logs.update((l) => [...l, 'Show this help'])
            logs.update((l) => [...l, 'assign'])
            logs.update((l) => [
                ...l,
                'Assign each observation to the cluster with the nearest mean.',
            ])
            logs.update((l) => [...l, 'update'])
            logs.update((l) => [
                ...l,
                'Recalculate means (centroids) for observations assigned to each cluster.',
            ])
            logs.update((l) => [...l, 'fit'])
            logs.update((l) => [
                ...l,
                'Repeat assign and update until the assignments no longer change.',
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
        reset: () => {
            dispatch('reset')
        },
        history: () => {
            history.forEach((c) => {
                logs.update((l) => [...l, c])
            })
        },
        clear: () => {
            logs.set([])
        },
        git: () => {
            window.open(
                'https://github.com/vanviethieuanh/k-means-clustering',
                '_blank'
            )
        },
        github: () => {
            window.open(
                'https://github.com/vanviethieuanh/k-means-clustering',
                '_blank'
            )
        },
        be: () => {
            window.open('https://www.behance.net/vanviethieuanh', '_blank')
        },
        behance: () => {
            window.open('https://www.behance.net/vanviethieuanh', '_blank')
        },
        email: () => {
            navigator.clipboard.writeText('vanviethieuanh@gmail.com')
            logs.update((l) => [...l, 'Email copied to clipboard!'])
        },
    }

    function Excute() {
        history.push(command)

        if (command.slice(0, 3) == 'set') {
            const commands = command.split(' ')
            command = ''

            if (commands[1] == '--help') {
                logs.update((l) => [...l, `set label <n>`])
                logs.update((l) => [...l, `Set the amount of label (1<n<5)`])
                logs.update((l) => [...l, `set data <n>`])
                logs.update((l) => [
                    ...l,
                    `Set the amount data for each label (10<n<100)`,
                ])
                logs.update((l) => [...l, `set error <n>`])
                logs.update((l) => [
                    ...l,
                    `Set the error range for data from center point (0<n<50)`,
                ])
                return
            }

            if (commands[1] == 'label' && commands[2] && !isNaN(commands[2])) {
                dispatch('setLabel', { num: parseInt(commands[2]) })
                return
            }

            if (commands[1] == 'data' && commands[2] && !isNaN(commands[2])) {
                dispatch('setData', { num: parseInt(commands[2]) })
                return
            }
            if (commands[1] == 'error' && commands[2] && !isNaN(commands[2])) {
                dispatch('setError', { num: parseInt(commands[2]) })
                return
            }

            logs.update((l) => [...l, `Type "set --help" for more information`])
            return
        }

        if (COMMAND_LIB[command]) {
            logs.update((l) => [...l, `USER>${command}`])
            COMMAND_LIB[command]()
        } else {
            logs.update((l) => [...l, `Command not found: ${command}`])
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

    <input bind:value={command} on:keypress={onKeyPress} />
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
</style>
