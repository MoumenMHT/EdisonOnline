<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum, ModelResultDataSectionEnum } from '@interface/Model.ts';
import Tips from "@component/report/reportTips.vue";
import Articles from "@component/report/reportArticles.vue";
import Recommendations from '@component/report/reportRecommendations.vue';
import { ref } from 'vue';
import { ChartService } from '@service/chart.service.ts';
// import numberBall from '@component/numberBall.vue';
import { getModelData } from '@util/ReportHelper.ts';
import { TempoGlobalContent, IChunksParts } from '@interface/Models.ts';
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";
import ReportInteractiveChart from '@component/report/ReportInteractiveChart.vue';
import { ChartMetadata } from '@component/report/ReportInteractiveChart.vue';

interface ITempoPartsChunk {
    chunk_id: number;
    chunk_is_fast: number;
    one_part: number;
    part: number;
    slut: number;
    start: number;
}

interface ITempoParts {
    chunks: ITempoPartsChunk
}

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
    reportId: number,
}>();

const partsTempoData = getModelData<ITempoParts[]>(props.modelData, ModelResultDataModelEnum.Tempo, ModelResultDataSectionEnum.Parts);
const globalTempoData = getModelData<TempoGlobalContent>(props.modelData, ModelResultDataModelEnum.Tempo, ModelResultDataSectionEnum.Global);
const chunkPartsData = getModelData<IChunksParts[]>(props.modelData, ModelResultDataModelEnum.Chunk, ModelResultDataSectionEnum.Parts);
const partsMetadata = ref<ChartMetadata>(
    {
        datasets: [
            {
                data: []
            }
        ]
    });
const valid = ref(true);

const myChart = ref();
const lineChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            data: [] as any[],
            fill: true,
            borderColor: ChartService.borderColor[0],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 1, // So endusers can easily click on the data points
            pointHoverRadius: 8,
        },
    ]
});
const lineChartOptions = ChartService.getDefaultLineOptions({
    plugins: {
        legend: {
            display: false,
        },
    }
});
/*    'number of fast paragraphs': number;
    'number of slow paragraphs': number;
    'percentage of fast paragraphs': number;*/

const numberFastParagraphs = ref<number>(0)
const numberSlowParagraphs = ref<number>(0)
const percentageFastParagraphsRaw = ref<number>(0);

// const percentageFastParagraphs = computed(() => {
//     return Math.round(percentageFastParagraphsRaw.value * 100) +'%';
// });
// const percentageSlowParagraphs = computed(() => {
//     return Math.round((1 - percentageFastParagraphsRaw.value) * 100) +'%';
// });

try {
    if (globalTempoData?.content !== undefined) {
        numberFastParagraphs.value = globalTempoData.content['number of fast paragraphs'];
        numberSlowParagraphs.value = globalTempoData.content['number of slow paragraphs'];
        percentageFastParagraphsRaw.value = globalTempoData.content['percentage of fast paragraphs'];
    }
    
    if (partsTempoData?.content !== undefined) {
        for (const chunks of partsTempoData.content) {
            let chunk = chunks.chunks;
            lineChartData.value.labels.push(chunk.part.toString() + '%');
            lineChartData.value.datasets[0].data.push(chunk.chunk_is_fast);

            var chunkPartsTempo = chunkPartsData?.content?.find((x) => x.chunks.chunk_id == chunk.chunk_id);
            partsMetadata.value.datasets[0].data.push({
                text: chunkPartsTempo?.chunks.part_text ?? [],
            });
        }
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}

try {
    // Resize chart before and after printing to make sure it fits printable area
    window.addEventListener('beforeprint', () => {
        const chart = myChart.value?.getChart();
        if (chart != undefined && chart.resize != undefined) {
            chart?.resize(700, 300);
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
    <div class="tempo report-wrapper">
        <div class="container chart">
            <div class="header">
                <div class="header-left">
                    <report-what-is :report-id="reportId" />
                </div>
<!--                <div class="header-right tempo">-->
<!--                    <div class="tempo-section">-->
<!--                        <div class="headline">Langsomme perioder</div>-->
<!--                        <div class="body">-->
<!--                            <div class="left">-->
<!--                                <number-ball :value="numberSlowParagraphs" size="5rem" font-size="M" background="#A255B4" />-->
<!--                            </div>-->
<!--                            <div class="right">-->
<!--                                <number-ball :value="percentageSlowParagraphs" size="5rem" font-size="M" background="#A255B4" />-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="tempo-section">-->
<!--                        <div class="headline">Hurtige perioder</div>-->
<!--                        <div class="body">-->
<!--                            <div class="left">-->
<!--                                <number-ball :value="numberFastParagraphs" size="5rem" font-size="M" background="#58A04C" />-->
<!--                            </div>-->
<!--                            <div class="right">-->
<!--                                <number-ball :value="percentageFastParagraphs" size="5rem" font-size="M" background="#58A04C" />-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
            <div class="header column">
                <div class="headline">Tempokurve: <span>{{ manuscriptRevisionData.title }}</span></div>
            </div>
            <div class="column chart">
                <ReportInteractiveChart chartType="line" :chartData="lineChartData" :chartOptions="lineChartOptions" :chartMetadata="partsMetadata" chartCssClass="h-20rem" />
            </div>
            <recommendations :report-id="reportId" :model-data="modelData" :manuscript-revision-data="manuscriptRevisionData" />
            <ReportInfoButtons :report-id="reportId" />
        </div>
        <tips :report-id="reportId" />
        <articles :report-id="reportId"/>
    </div>
</template>

<style scoped lang="scss">
.header-right.tempo {
    > .tempo-section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        align-content: stretch;

        min-width: 20.2rem;
        
        &:last-child {
            margin-top: 1rem;
        }
        
        > .headline {
            align-self: center;
            color: #E4B200;
            text-align: center;
            font-family: var(--font-family);
            font-size: 1.73894rem;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
        }
        
        > .body {
            display: flex;
            flex-direction: row;
            width: 100%;
            padding: 1rem;
            background: #5B5B5B;
            border-radius: 5rem;
            border: 1px solid #E4B200;
            
            position: relative;
            
            > .left {
                z-index: 1;
                
                &:before {
                    content: "";
                    border: 1px solid #E4B200;
                    position: absolute;
                    top: 50%;
                    width: calc(100% - 2rem - 6px);
                    left: calc(2px + 1rem);
                    z-index: -1;
                }
            }
            > .right {
                margin-left: auto;
                z-index: 1;

                > div {
                    border: 1px solid #E4B200;
                }
            }
        }
    }
}
</style>