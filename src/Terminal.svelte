<script>
    import { createEventDispatcher, beforeUpdate, afterUpdate } from 'svelte'
    import { logs, Print, ClearLog, BreakLine, Prompt } from './store'
    const dispatch = createEventDispatcher()

    let history = []
    let command = 'help'

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
            Print('==============K-MEANS CLUSTERING==============')
            BreakLine()
            Print('help')
            Print('Show this help')
            BreakLine()
            Print('assign')
            Print(
                'Assign each observation to the cluster with the nearest mean.'
            )
            BreakLine()
            Print('update')
            Print(
                'Recalculate means (centroids) for observations assigned to each cluster.'
            )
            BreakLine()
            Print('fit')
            Print(
                'Repeat assign and update until the assignments no longer change.'
            )
            BreakLine()
            Print('set --help')
            Print('To show how to set variables')
            BreakLine()
            Print('reset')
            Print(
                'Shuffle data again, it will recreate centers of data and random change position of labels'
            )
            BreakLine()
            Print('git be email web')
            Print('Show about me')
            BreakLine()
            Print('clear history')
            Print('Same with terminal')
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
                Print(c)
            })
        },
        clear: () => {
            ClearLog()
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
        web: () => {
            window.open('https://vanviethieuanh.com/', '_blank')
        },
        email: () => {
            navigator.clipboard.writeText('vanviethieuanh@gmail.com')
            Print('✉ Email copied to clipboard!')
        },
        mail: () => {
            navigator.clipboard.writeText('vanviethieuanh@gmail.com')
            Print('✉ Email copied to clipboard!')
        },
    }

    function Excute() {
        history.push(command)
        Prompt(command)

        if (command.slice(0, 3) == 'set') {
            const commands = command.split(' ')
            command = ''

            if (commands[1] == '--help') {
                Print(`set label <n>`)
                Print(`Set the amount of label (2≤n≤9)`)
                BreakLine()
                Print(`set data <n>`)
                Print(
                    `Set the amount data for each label (n ≥ 10 , should be < 100 for better visualize)`
                )
                BreakLine()
                Print(`set error <n>`)
                Print(`Set the error range for data from center point (5≤n≤50)`)
                return
            }

            if (commands[1] == 'label' && commands[2] && !isNaN(commands[2])) {
                if (commands[2] <= 9 && commands[2] >= 2) {
                    dispatch('setLabel', { num: parseInt(commands[2]) })
                    return
                }
            }

            if (commands[1] == 'data' && commands[2] && !isNaN(commands[2])) {
                if (commands[2] >= 10) {
                    dispatch('setData', { num: parseInt(commands[2]) })
                    return
                }
            }
            if (commands[1] == 'error' && commands[2] && !isNaN(commands[2])) {
                if (commands[2] <= 50 && commands[2] >= 5) {
                    dispatch('setError', { num: parseInt(commands[2]) })
                    return
                }
            }

            Print(`Type "set --help" for more information`)
            return
        }

        if (COMMAND_LIB[command]) {
            COMMAND_LIB[command]()
        } else {
            Print(`Command not found: ${command}`)
        }
        command = ''
    }

    const onKeyPress = (e) => {
        if (e.charCode === 13) Excute()
    }
</script>

<div class="terminal">
    <div class="logs">
        <ul bind:this={logs_list}>
            {#each $logs as log}
                {#if log == 1}
                    <br />
                {:else}
                    <li>{log}</li>
                {/if}
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
