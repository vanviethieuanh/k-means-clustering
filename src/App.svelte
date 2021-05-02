<script>
    import Terminal from './Terminal.svelte'
    import {
        Graphic,
        XAxis,
        YAxis,
        XGridLines,
        YGridLines,
        Point,
    } from '@snlab/florence'
    import { Print } from './store'

    let canvasSize = Math.min(window.innerWidth, window.innerHeight) - 20
    let GRID_COLOR = '#80DDF2'

    let LABELS_AMOUNT = 3
    let N_FOR_LABEL = 80
    let MAX = 100
    let COLORS = [
        '#fe00fe',
        '#fe007f',
        '#fe0000',
        '#febf00',
        '#fefe00',
        '#00fe00',
        '#00fefe',
        '#0080ff',
        '#3f00fe',
    ]

    // Note that error must be < max/2
    let ERROR = 30

    // distance of centers from origin
    let RADIUS = MAX / 2 - 20

    // Functions
    const graphSize = function () {
        canvasSize = Math.min(window.innerWidth, window.innerHeight) - 20
        console.log(canvasSize)
    }

    const euclideanDistance = function (a, b) {
        let x = a.x - b.x
        let y = a.y - b.y

        return Math.sqrt(x * x + y * y)
    }
    const generateData = function (nForLabel, centers) {
        let data = []
        centers.forEach(({ x, y }) => {
            for (let j = 0; j < nForLabel; j++) {
                const angle = Math.PI * 2 * Math.random()
                const point = {
                    x: x + ERROR * Math.cos(angle) * Math.random(),
                    y: y + ERROR * Math.sin(angle) * Math.random(),
                    label: -1,
                }
                data.push(point)
            }
        })
        return data
    }
    const Mean = (includes) => {
        const len = includes.length

        if (len == 0)
            return {
                x: MAX / 2,
                y: MAX / 2,
            }

        let x_sum = 0
        let y_sum = 0

        includes.forEach((p) => {
            x_sum += p.x
            y_sum += p.y
        })

        return {
            x: x_sum / len,
            y: y_sum / len,
        }
    }

    // Initalizing Labels and Centers
    let centers = []
    let labels = []
    for (let i = 0; i < LABELS_AMOUNT; i++) {
        labels.push({
            x: Math.random() * MAX,
            y: Math.random() * MAX,
            color: COLORS[i],
        })

        centers.push({
            x: MAX / 2 + Math.cos((Math.PI / LABELS_AMOUNT) * 2 * i) * RADIUS,
            y: MAX / 2 + Math.sin((Math.PI / LABELS_AMOUNT) * 2 * i) * RADIUS,
        })
    }

    // Gen data
    let data = []
    data = generateData(N_FOR_LABEL, centers)

    // Event Handler
    // Recalculate means for observations assigned to each cluster.
    function Update() {
        labels.forEach((label, index) => {
            Object.assign(label, Mean(data.filter((p) => p.label == index)))
        })
        labels = labels
    }

    // Assign each observation to the cluster with the nearest mean
    function Assignment() {
        let change = false
        let contain = []

        for (let i = 0; i < LABELS_AMOUNT; i++) {
            contain.push(0)
        }

        data.forEach((p) => {
            let minDis = euclideanDistance(p, labels[0])
            let min = 0

            labels.forEach((label, index) => {
                const dis = euclideanDistance(p, label)
                if (dis < minDis) {
                    min = index
                    minDis = dis
                }
            })
            if (!change) change = p.label != min
            contain[min] += 1
            p.label = min

            Print(`Assigned (${p.x}, ${p.y}) to ${min}`)
        })
        for (let i = 0; i < LABELS_AMOUNT; i++) {
            Print(`Label ${i} now contain ${contain[i]} points`)
        }

        labels = labels
        return change
    }

    // Assign each observation to the cluster with the nearest mean
    function Fit() {
        let interval = 1

        let change = Assignment()
        Update()

        let fit = setInterval(() => {
            change = Assignment()
            Update()
            interval++

            if (!change) {
                Print(`Fitted after ${interval} interation(s)`)
                clearInterval(fit)
            }
        }, 2000)
    }

    function setLabel(e) {
        const num = e.detail.num
        if (LABELS_AMOUNT > num) {
            data.map((p) => {
                p.label = -1
            })
            labels = labels.slice(0, num)
        } else {
            for (let i = LABELS_AMOUNT; i < num; i++) {
                labels.push({
                    x: Math.random() * MAX,
                    y: Math.random() * MAX,
                    cor: COLORS[i],
                })
            }
            labels = labels
        }
        LABELS_AMOUNT = num
    }

    function setData(e) {
        const num = e.detail.num
        N_FOR_LABEL = num
        Reset()
    }

    function setError(e) {
        const num = e.detail.num
        ERROR = num
        data = generateData(N_FOR_LABEL, centers)
    }

    function Reset() {
        centers = []
        for (let i = 0; i < LABELS_AMOUNT; i++) {
            Object.assign(labels[i], {
                x: Math.random() * MAX,
                y: Math.random() * MAX,
            })

            centers.push({
                x:
                    MAX / 2 +
                    Math.cos((Math.PI / LABELS_AMOUNT) * 2 * i) * RADIUS,
                y:
                    MAX / 2 +
                    Math.sin((Math.PI / LABELS_AMOUNT) * 2 * i) * RADIUS,
            })
        }
        centers = centers
        labels = labels

        data = []
        data = generateData(N_FOR_LABEL, centers)
    }
</script>

<svelte:window on:resize={graphSize} />

<main>
    <div class="graph">
        <Graphic
            width={canvasSize}
            height={canvasSize}
            scaleX={[-6, MAX + 6]}
            scaleY={[-6, MAX + 6]}
            flipY
            padding={20}
        >
            {#each data as point}
                <Point
                    x={point.x}
                    y={point.y}
                    radius={2}
                    fill={point.label == -1
                        ? '#8B8B8B'
                        : labels[point.label].color}
                    opacity={0.9}
                    transition={2000}
                />
            {/each}
            {#each labels as label}
                <Point
                    x={label.x}
                    y={label.y}
                    radius={6}
                    fill={label.color}
                    transition={2000}
                />
                <Point
                    x={label.x}
                    y={label.y}
                    radius={10}
                    strokeWidth={1}
                    stroke={label.color}
                    strokeOpacity={0.5}
                    fill={label.color}
                    transition={2000}
                />
            {/each}
            <XAxis
                baseLineColor={GRID_COLOR}
                tickColor={GRID_COLOR}
                labelColor={GRID_COLOR}
                labelOpacity={0}
            />
            <YAxis
                baseLineColor={GRID_COLOR}
                tickColor={GRID_COLOR}
                labelColor={GRID_COLOR}
                labelOpacity={0}
            />
            <XGridLines color={GRID_COLOR} opacity={0.3} />
            <YGridLines color={GRID_COLOR} opacity={0.3} />
        </Graphic>
    </div>

    <div class="controller">
        <Terminal
            on:assign={Assignment}
            on:update={Update}
            on:fit={Fit}
            on:setLabel={setLabel}
            on:setData={setData}
            on:setError={setError}
            on:reset={Reset}
        />
    </div>
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;

        text-align: center;
        padding: 1em;
        margin: 0;
        padding: 0;

        display: grid;
        grid-template-columns: 1fr auto;
    }

    /* Portrait */
    @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
        main {
            grid-template-columns: auto;
            grid-template-rows: auto 1fr;
        }
    }
</style>
