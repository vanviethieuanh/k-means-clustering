<script>
    import { Graphic, PointLayer, XAxis, YAxis, Point } from '@snlab/florence'

    let LABELS_AMOUNT = 4
    let N_FOR_LABEL = 30
    let MAX = 100

    let ERROR = 0.25

    let labels = []
    let data = []
    let colors = ['#F28F38', '#F25757', '#037F8C', '#205459']

    const euclideanDistance = function (a, b) {
        let x = a.x - b.x
        let y = a.y - b.y

        return Math.sqrt(x * x + y * y)
    }
    const getError = (max) => -ERROR + Math.random() * (2 * ERROR) * max
    const generateData = function (N, from, to, labels_amount) {
        let data = []
        let errorRange = to - from

        for (let i = from; i < to; i += Math.round(errorRange / N)) {
            const point = {
                x: i + getError(errorRange),
                y: i + getError(errorRange),
                label: Math.floor(Math.random * labels_amount),
            }
            data.push(point)
        }
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

    data = generateData(N_FOR_LABEL * LABELS_AMOUNT, 0, MAX, LABELS_AMOUNT)

    // Initalizing Labels
    for (let i = 0; i < LABELS_AMOUNT; i++) {
        const label = {
            x: Math.random() * MAX,
            y: Math.random() * MAX,
            color: colors[i],
        }
        labels.push(label)
    }

    // Arrange data to nearest point
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
        p.label = min
    })

    // Recalculate means for observations assigned to each cluster.
    function Update() {
        labels.forEach((label, index) => {
            Object.assign(label, Mean(data.filter((p) => p.label == index)))
        })
        labels = labels
    }

    // Assign each observation to the cluster with the nearest mean
    function Assignment() {
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
            p.label = min
        })

        labels = labels
    }
</script>

<main>
    <h1>k-means clustering</h1>
    <button on:click={Update}>Update</button>
    <button on:click={Assignment}>Assignment</button>
    <Graphic
        width={400}
        height={400}
        scaleX={[0, 150]}
        scaleY={[0, 150]}
        flipY
        padding={20}
    >
        {#each labels as label}
            <Point
                x={label.x}
                y={label.y}
                radius={6}
                strokeWidth={3}
                stroke={label.color}
                fill={'transparent'}
                transition={2000}
            />
        {/each}
        {#each data as point}
            <Point
                x={point.x}
                y={point.y}
                radius={3}
                fill={labels[point.label].color}
                transition={2000}
            />
        {/each}
        <XAxis baseLineColor={'#024959'} />
        <YAxis baseLineColor={'#024959'} />
    </Graphic>
</main>

<style>
    :global(body) {
        background: white;
    }

    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #005057;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
