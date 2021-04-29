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
    import { assign } from 'svelte/internal'

    let GRID_COLOR = '#80DDF2'

    let LABELS_AMOUNT = 3
    let N_FOR_LABEL = 80
    let MAX = 100
    let COLORS = [
        '#FF0DC0',
        '#F22E62',
        '#25BCFF',
        '#205459',
        '#16a085',
        '#27ae60',
        '#8e44ad',
        '#e74c3c',
        '#d35400',
        '#f39c12',
        '#f1c40f',
        '#2c3e50',
    ]

    // Note that error must be < max/2
    let ERROR = 25

    // distance of centers from origin
    let RADIUS = MAX / 2 - ERROR

    // Functions
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
            change = p.label != min
            p.label = min
        })

        labels = labels
        return change
    }

    // Assign each observation to the cluster with the nearest mean
    function Fit() {
        let change = Assignment()
        Update()

        setInterval(() => {
            change = Assignment()
            Update()

            if (!change) return
        }, 4000)
    }
</script>

<main>
    <a
        class="title"
        href="https://en.wikipedia.org/wiki/K-means_clustering"
        target="_blank"
    >
        <h1>k-means clustering</h1>
        <h1>k-means clustering</h1>
        <h1>k-means clustering</h1>
    </a>

    <div class="graph">
        <Graphic
            width={500}
            height={500}
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
        <Terminal on:assign={Assignment} on:update={Update} on:fit={Fit} />
    </div>
</main>

<style>
    .title {
        grid-area: title;

        display: flex;
        align-items: center;
        justify-content: center;
    }
    a:hover {
        text-decoration: none;
    }
    h1:nth-child(1) {
        color: #ef29f2;
        animation: glitch-anim 5s infinite linear alternate-reverse;
        margin-left: -2px;
    }
    h1:nth-child(2) {
        color: #00fff9;
        animation: glitch-anim2 1s infinite linear alternate-reverse;
        margin-right: -2px;
    }
    h1:nth-child(3) {
        color: #fff;
    }
    h1 {
        position: absolute;

        text-transform: uppercase;
        font-size: 2rem;
        font-weight: 400;
    }

    main {
        background-color: rgba(0, 0, 0, 0.95);

        width: 100vw;
        height: 100vh;

        text-align: center;
        padding: 1em;
        margin: 0;
        padding: 0;

        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 60px 1fr;
        grid-template-areas:
            'title controller'
            'graph controller';
    }

    .graph {
        grid-area: graph;
    }

    .controller {
        grid-area: controller;

        height: fit-content;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        justify-content: center;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
