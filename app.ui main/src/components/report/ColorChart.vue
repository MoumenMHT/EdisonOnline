<script setup lang="ts">
import { chartDataSet, ChartService } from '@service/chart.service.ts';
import { ref } from 'vue';
import Chart from 'primevue/chart';
import NumberBall from '@component/numberBall.vue';
import { cloneDeep } from 'lodash';

interface Props {
    items: ColorChartItem[];
    tableHeadText?: string;
    tableHeadValue?: string;
}
interface ChartDataSets {
    name: string;
    chartData: {labels: string[], datasets: chartDataSet[]};
}

const props = withDefaults(defineProps<Props>(), {
    items: props1 => props1.items || [] as ColorChartItem[],
    tableHeadText: 'Tema',
    tableHeadValue: 'Score',
});

const selectedItem = ref(0);

const myChart = ref();
const defaultChartData = {
    labels: [] as string[],
    datasets: [{
        backgroundColor: ChartService.backgroundColors,
        data: [] as number[],
        borderWidth: 2
    }] as chartDataSet[],
}

const chartOptions = ChartService.getDefaultBarOptions({
    indexAxis: 'y',
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        y: {
            display: false,
        },
        x: {
            display: false,
        },
    }
});

const chartDataSets: ChartDataSets[] = [];
for (const item of props.items) {
    const cd = cloneDeep(defaultChartData);
    cd.labels = item.data.map(x => x.name);
    cd.datasets[0].data = item.data.map(x => x.value);
    
    chartDataSets.push({
        name: item.headline,
        chartData: cd,
    })
}

try {
    // Resize chart before and after printing to make sure it fits printable area
    window.addEventListener('beforeprint', () => {
        const chart = myChart.value?.getChart();
        if (chart != undefined && chart.resize != undefined) {
            chart.resize(700, 200);
        }
    });
    window.addEventListener('afterprint', () => {
        const chart = myChart.value?.getChart();
        if (chart != undefined && chart.resize != undefined) {
            chart.resize();
        }
    });
} catch (e) {
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="color-chart-header header column" v-if="items.length > 1">
        <div class="headline text-align-center text-color">
            Klik dig igennem kategorierne
        </div>
        <div class="header-buttons noPrint">
            <div
                class="button"
                v-for="(item, index) in items"
                v-bind:class="{ 'active': selectedItem === index }"
                @click="selectedItem = index"
            >
                {{item.headline}}
            </div>
        </div>
    </div>
    <div class="header column">
        <div class="headline text-align-center text-color">
            De mest fremtrædende {{ items[selectedItem].headline.toLowerCase() }} er:
        </div>
    </div>
    <div class="color-chart-container">
        <div class="left">
            <Chart ref="myChart" type="bar" :data="chartDataSets[selectedItem].chartData" :options="chartOptions" style="height: 100%; width: 100%;" class="notFullViewWidth"/>
        </div>
        <div class="right data-table no-default">
            <div class="data-table-body">
                <div class="data-table-row">
                    <div class="data-table-cell">{{ tableHeadText.toUpperCase() }}</div>
                    <div class="data-table-cell">{{ tableHeadValue.toUpperCase() }}</div>
                </div>
                <div class="data-table-row" v-for="(item, index) in items[selectedItem].data">
                    <div class="data-table-cell">
                        <div class="cell-flex">
                            <NumberBall value="" size="2rem" :background="ChartService.backgroundColors[index]" />
                            <div>{{ index+1 }}. {{ item.name }}</div>
                        </div>
                    </div>
                    <div class="data-table-cell">
                        {{ item.value.toFixed(2) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.color-chart-header {
    > .header-buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 1rem;
        //margin-top: 2rem;

        > .button {
            border-radius: 4.5rem;
            border: 1px solid #E4B200;
            background: #5B5B5B;
            font-size: 1.5rem;
            font-weight: 700;
            padding: 0.5rem 2rem;
            cursor: pointer;
            user-select: none;

            @media print {
                background-color: #fff;
            }

            &.active {
                background: #E4B200;
                color: #000;
            }
        }
    }
}
.color-chart-container {
    border-radius: 1.25rem;
    border: 1px solid #E4B200;
    background: rgba(217, 217, 217, 0.13);

    display: flex;
    flex-direction: row;

    @media print {
        background-color: #fff;
        flex-direction: column;
    }

    > .left {
        flex-grow: 1;
        padding: 3rem 1rem 1rem 1rem;
        max-width: 75%; // This is bad solution to fix this, but need way more time to find the better solution.

        @media print {
            max-width: initial;
            padding: 1rem;
        }

        > .p-chart {
            border-left: 1px solid var(--primary-color);

            @media print {
                border-left: none;
            }
        }
    }

    > .right {
        margin-left: auto;

        @media print {
            margin-left: initial;
        }

        &.data-table {
            border-left: 1px solid rgba(255, 255, 255, 0.29);
            display: table;
            table-layout: fixed;
            //margin: 21px;
            overflow: hidden;

            @media print {
                border-left: none;
                border-top: 1px solid #000;
            }

            > .data-table-body {
                display: table-row-group;

                > .data-table-row {
                    display: table-row;

                    &:not(:last-child) {
                        > .data-table-cell {
                            border-bottom: 1px solid rgba(255, 255, 255, 0.29);

                            @media print {
                                border-color: #000;
                            }
                        }
                    }
                    &.primary {
                        color: var(--primary-color);
                    }

                    > .data-table-cell {
                        display: table-cell;
                        padding: 0.5rem 1rem;
                        vertical-align: middle;

                        &:not(:last-child) {
                            border-right: 1px solid rgba(255, 255, 255, 0.29);
                            @media print {
                                border-color: #000;
                            }
                        }

                        > .cell-flex {
                            display: flex;
                            align-content: center;
                            align-items: center;
                            flex-wrap: wrap;
                            justify-content: flex-start;

                            > div:last-child {
                                margin-left: 1rem;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>