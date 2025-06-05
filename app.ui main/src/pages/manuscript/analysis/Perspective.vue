<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import {ModelResultData, ModelResultDataModelEnum, ModelResultDataSectionEnum} from '@interface/Model.ts';
import Tips from "@component/report/reportTips.vue";
import Articles from "@component/report/reportArticles.vue";
import Recommendations from '@component/report/reportRecommendations.vue';
import { ref } from 'vue';
import { getModelData, perspectiveColor, perspectiveTranslater } from "@util/ReportHelper.ts";
import {IChunksParts, IPerspectiveGlobal, IPerspectiveParts} from "@interface/Models.ts";
import { percentFormatter } from "@util/numberHelper.ts";
import { chartDataSet, ChartService } from "@service/chart.service.ts";
import Chart from "primevue/chart";
import CircleProgress from "@component/circleProgress.vue";
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";
import ReportInteractiveChart from '@component/report/ReportInteractiveChart.vue';
import { ChartMetadata } from '@component/report/ReportInteractiveChart.vue';

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
    reportId: number,
}>();

const data = getModelData<IPerspectiveGlobal>(props.modelData, ModelResultDataModelEnum.Perspective);
const partsData = getModelData<IPerspectiveParts[]>(props.modelData, ModelResultDataModelEnum.Perspective, ModelResultDataSectionEnum.Parts)?.content;
const perspectiveParts = ref<IPerspectiveParts[]>();
const perspectiveData = ref<IPerspectiveGlobal>();
const chunkPartsData = getModelData<IChunksParts[]>(props.modelData, ModelResultDataModelEnum.Chunk, ModelResultDataSectionEnum.Parts);
const partsMetadata = ref<ChartMetadata>(
    {
        datasets: [
            {
                data: []
            },
            {
                data: []
            },
            {
                data: []
            }
        ]
    });

const valid = ref(true);
const doughnutChart = ref();
const lineChart = ref();

const notForTable = ['pronouns count'];
const tableData = ref<any[]>([]);
const doughnutChartOptions = ChartService.getDefaultDoughnutOptions({
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            display: false,
        }
    }
});
const pieChartData = ref({
    labels: ['1rst person indicators', '2nd person indicators', '3rd person indicators'],
    datasets: [] as chartDataSet[]
});

const lineChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            label: '1. Personsindikatorer',
            data: [] as number[],
            fill: false,
            borderColor: ChartService.borderColor[0],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 1, // So endusers can easily click on the data points
            pointHoverRadius: 8,
        },
        {
            label: '2. Personsindikatorer',
            data: [] as number[],
            fill: false,
            borderColor: ChartService.borderColor[1],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[1], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 1, // So endusers can easily click on the data points
            pointHoverRadius: 8,
        },
        {
            label: '3. Personsindikatorer',
            data: [] as number[],
            fill: false,
            borderColor: ChartService.borderColor[2],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[2], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 1, // So endusers can easily click on the data points
            pointHoverRadius: 8,
        },
    ]
});

const lineChartOptions = ChartService.getDefaultLineOptions({});

try {
    if (data?.content !== undefined) {
        perspectiveData.value = data.content;
        for (let gstd in perspectiveData.value) {
            if (notForTable.includes(gstd)) {
                continue;
            }
            tableData.value.push({
                name: gstd,
                value: data.content[gstd],
            });
        }
        pieChartData.value.datasets.push({
            data: [
                data.content["percentage of 1rst person indicators"],
                data.content["percentage of 2nd person indicators"],
                data.content["percentage of 3rd person indicators"],
            ],
            backgroundColor: ChartService.backgroundColors,
            hoverBackgroundColor: ChartService.hoverBackgroundColors,
        });
    }
    if (partsData !== undefined) {
        perspectiveParts.value = partsData;
        for (const chunks of perspectiveParts.value) {
            let chunk = chunks.chunks;
            lineChartData.value.labels.push(chunk.part.toString() + '%');
            lineChartData.value.datasets[0].data.push(chunk["number of 1rst person indicators"]);
            lineChartData.value.datasets[1].data.push(chunk["number of 2nd person indicators"]);
            lineChartData.value.datasets[2].data.push(chunk["number of 3rd person indicators"]);

            var chunkPartsTempus = chunkPartsData?.content?.find((x) => x.chunks.chunk_id == chunk.chunk_id);
            var chartMetadataElement = {
                text: chunkPartsTempus?.chunks.part_text ?? [],
            }
            partsMetadata.value.datasets[0].data.push(chartMetadataElement);
            partsMetadata.value.datasets[1].data.push(chartMetadataElement);
            partsMetadata.value.datasets[2].data.push(chartMetadataElement);
        }
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}

try {
    // Resize chart before and after printing to make sure it fits printable area
    window.addEventListener('beforeprint', () => {
        const linechart = lineChart.value?.getChart();
        const doughnutchart = doughnutChart.value?.getChart();
        if (linechart != undefined && linechart.resize != undefined &&
            doughnutchart != undefined && doughnutchart.resize != undefined) {
            linechart.resize(725, 300);
            doughnutchart.resize(300, 300);
        }
    });
    window.addEventListener('afterprint', () => {
        const linechart = lineChart.value?.getChart();
        const doughnutchart = doughnutChart.value?.getChart();
        if (linechart != undefined && linechart.resize != undefined &&
            doughnutchart != undefined && doughnutchart.resize != undefined) {
            linechart.resize();
            doughnutchart.resize();
        }
    });
} catch (e) {
    console.error('Unhandled error:', e);
}

</script>

<template>
    <div class="report-wrapper">
        <div class="container">
            <div class="header printRow">
                <div class="header-left">
                    <report-what-is :report-id="reportId" />
                </div>
                <div v-if="perspectiveData" class="header-right">
                    <div class="flex flex-column gap-3 align-items-center text-primary" style="font-size: 1.75rem; font-weight: 700;">
                        Konsistensscore
                        <circle-progress
                            :percentage="Math.round(perspectiveData['consistence score'])"
                            size="15rem"
                            :progress-fill="perspectiveColor(perspectiveData['main person indicator'])"
                        />
                    </div>
                    <div class="subline center mt-3">
                        Perspektivet i din bog er:<br>
                        <span>{{ perspectiveTranslater(perspectiveData["main person indicator"]) }}</span>
                    </div>
                </div>
            </div>
            <div class="body column">
                <div v-if="perspectiveData" class="indicator-summary">
                    <div class="indicator-header">
                        Overblik over indikatorer
                    </div>
                    <div class="data-wrapper">
                        <div class="chart-container">
                            <Chart ref="doughnutChart" type="doughnut" :data="pieChartData" :options="doughnutChartOptions" class="h-full w-full flex justify-content-center notFullViewWidth" />
                        </div>
                        <div class="data-table">
                            <div class="data-table-body">
                                <div class="data-table-row header">
                                    <div class="data-table-cell">
                                        <div>Perspektiv</div>
                                    </div>
                                    <div class="data-table-cell">
                                        <div>{{ perspectiveTranslater(perspectiveData["main person indicator"]) }}</div>
                                    </div>
                                </div>
                                <div class="data-table-row">
                                    <div class="data-table-cell">
                                        <div class="field-container">
                                            <div class="colorcircle c1"></div>
                                            <span>1. Personsindikatorer</span>
                                        </div>
                                    </div>
                                    <div class="data-table-cell">
                                        <span>
                                            {{ perspectiveData["number of 1rst person indicators"] }}
                                        </span>
                                        <span>
                                            {{ percentFormatter.format(perspectiveData["percentage of 1rst person indicators"]) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="data-table-row">
                                    <div class="data-table-cell">
                                        <div class="field-container">
                                            <div class="colorcircle c2"></div>
                                            <span>2. Personsindikatorer</span>
                                        </div>
                                    </div>
                                    <div class="data-table-cell">
                                        <span>
                                            {{ perspectiveData["number of 2nd person indicators"] }}
                                        </span>
                                        <span>
                                            {{ percentFormatter.format(perspectiveData["percentage of 2nd person indicators"]) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="data-table-row">
                                    <div class="data-table-cell">
                                        <div class="field-container">
                                            <div class="colorcircle c3"></div>
                                            <span>3. Personsindikatorer</span>
                                        </div>
                                    </div>
                                    <div class="data-table-cell">
                                        <span>
                                            {{ perspectiveData["number of 3rd person indicators"] }}
                                        </span>
                                        <span>
                                            {{ percentFormatter.format(perspectiveData["percentage of 3rd person indicators"]) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <recommendations :report-id="reportId" :model-data="modelData" :manuscript-revision-data="manuscriptRevisionData" />
            <ReportInfoButtons :report-id="reportId" />
        </div>
        <div class="container">
            <div class="body column">
                <div class="flex justify-content-center" style="font-size: 1.75rem; font-weight: 700;">Udvikling i perspektiv</div>
                <div>
                    <ReportInteractiveChart chartType="line" :chartData="lineChartData" :chartOptions="lineChartOptions" :chartMetadata="partsMetadata" chartCssClass="h-20rem" />
                </div>
            </div>
        </div>
        <tips :report-id="reportId" />
        <articles :report-id="reportId"/>
    </div>
</template>

<style scoped lang="scss">

.indicator-summary {

    max-height: 27rem;
    
    @media print {
        max-height: initial;
    }

    > .indicator-header {
        color: #E4B200;
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
    }

    > .data-wrapper {
        display: flex;
        flex: 0 1 auto;
        justify-content: space-between;
        min-width: 38rem;
        border-radius: 0.6rem;
        border: 1px solid #E4B200;
        background: rgba(217, 217, 217, 0.13);
        
        @media print {
            flex-direction: column;
            align-items: center;
            background-color: #fff;
        }

        > .chart-container {
            width: calc(50% - 1px - 2rem);
            padding: 1rem;
            max-height: 16rem;

            @media print {
                max-height: 21rem;
                width: calc(100% - 1px - 2rem);
            }
        }

        > .data-table {
            display: table;
            table-layout: fixed;
            min-width: 50%;
            border-left: 1px solid rgba(255, 255, 255, 0.29);
            font-weight: 700;
            font-size: 1.75rem;
            
            @media print {
                width: 100%;
                border-left: none;
                border-top: 1px solid rgba(0, 0, 0, 0.5);
            }

            > .data-table-body {
                display: table-row-group;

                > .data-table-row {
                    display: table-row;

                    .field-container {
                        display: flex;
                        gap: 1.5rem;
                        padding: 1rem;
                        align-items: center;


                        > .colorcircle {
                            width: 1.2rem;
                            height: 1.2rem;
                            border-radius: 50%;
                            &.c1  {
                                background-color: var(--chart-background-1);
                            }
                            &.c2  {
                                background-color: var(--chart-background-2);
                            }
                            &.c3  {
                                background-color: var(--chart-background-3);
                            }
                        }
                    }

                    &:not(:last-child) {
                        > .data-table-cell {
                            border-bottom: 1px solid rgba(255, 255, 255, 0.29);

                            @media print {
                                border-bottom: 1px solid rgba(0, 0, 0, 0.5);
                            }
                        }
                    }

                    &.header {
                        > .data-table-cell {
                            display: table-cell;

                            > div {
                                padding: 1rem !important;
                            }

                            &:first-child {
                                border-right: 1px solid rgba(255, 255, 255, 0.29);
                                width: 25rem;

                                @media print {
                                    border-right: 1px solid rgba(0, 0, 0, 0.5);
                                }
                            }

                            &:last-child {
                                color: #E4B200;
                                text-align: center;
                            }
                        }
                    }

                    &:not(.header) {
                        > .data-table-cell {
                            display: table-cell;

                            > span {
                                padding: 1rem;
                            }

                            &:last-child {
                                display: flex !important;
                                align-items: center;
                                color: #E4B200;
                                width: 100%;
                                text-align: right;
                                flex-grow: 1;

                                > span {
                                    width: 50%;
                                    text-align: center;
                                    &:first-child {
                                        width: calc(50% - 1px);
                                        border-right: 1px solid rgba(255, 255, 255, 0.29);

                                        @media print {
                                            border-right: 1px solid rgba(0, 0, 0, 0.5);
                                        }
                                    }
                                }
                            }

                            &:first-child {
                                border-right: 1px solid rgba(255, 255, 255, 0.29);
                                width: 20rem;

                                @media print {
                                    border-right: 1px solid rgba(0, 0, 0, 0.5);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

</style>