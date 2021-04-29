<script>
    import { Graphic, XAxis, YAxis, Point, Symbol_ } from '@snlab/florence'

    let LABELS_AMOUNT = 4
    let N_FOR_LABEL = 50
    let MAX = 100
    let COLORS = ['#F28F38', '#F25757', '#037F8C', '#205459']

    // Note that error must be < max/2
    let ERROR = 20

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
                    label: 0,
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
        scaleX={[-6, MAX + 6]}
        scaleY={[-6, MAX + 6]}
        flipY
        padding={20}
    >
        {#each centers as center}
            <Symbol_
                x={center.x}
                y={center.y}
                radius={6}
                shape={'star5'}
                fill={'black'}
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
        {#each labels as label}
            <Point
                x={label.x}
                y={label.y}
                radius={6}
                strokeWidth={3}
                stroke={label.color}
                fill={'white'}
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
