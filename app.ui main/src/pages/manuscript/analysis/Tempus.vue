<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum, ModelResultDataSectionEnum } from '@interface/Model.ts';
import Tips from "@component/report/reportTips.vue";
import Articles from "@component/report/reportArticles.vue";
import Recommendations from '@component/report/reportRecommendations.vue';
import { ref, watch } from 'vue';
import { ChartService } from '@service/chart.service.ts';
import CircleProgress from '@component/circleProgress.vue';
import checkmark from '@asset/icons/circleCheckmark.svg';
import circleCross from '@asset/icons/circleCross.svg';
import circleLine from '@asset/icons/circleLine.svg';
import { IAudienceClassificationGlobal, IChunksParts, IGenreClassificationGlobal, ITenseGlobal, ITenseParts } from '@interface/Models.ts';
import { getModelData, recommendationValue } from '@util/ReportHelper.ts';
import { cloneDeep } from 'lodash';
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";
import { RecommendationService } from '@service/recommendation.service.ts';
import { useMainStore } from '@store/main.ts';
import { IRecommendationResponse } from '@interface/Recommendation.ts';
import { ChartMetadata } from '@component/report/ReportInteractiveChart.vue';
import ReportInteractiveChart from '@component/report/ReportInteractiveChart.vue';


interface tempusItem {
    name: string;
    value: number;
}

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
    reportId: number,
}>();

const store = useMainStore();
const lineChart = ref();
const lineChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'Datid',
            data: [] as number[],
            fill: false,
            backgroundColor: ChartService.backgroundColors[0],
            borderColor: ChartService.hoverBackgroundColors[0],
            borderWidth: 2,
            pointRadius: 1, // So endusers can easily click on the data points
            pointHoverRadius: 8
        },
        {
            label: 'Nutid',
            data: [] as number[],
            fill: false,
            backgroundColor: ChartService.backgroundColors[1],
            borderColor: ChartService.hoverBackgroundColors[1],
            borderWidth: 2,
            pointRadius: 1, // So endusers can easily click on the data points
            pointHoverRadius: 8,
        }
    ]
});
const lineChartOptions = ChartService.getDefaultLineOptions({
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                // color: '#ffffff',
            }
        },
    },
    scales: {
        y: {
            ticks: {
                // color: '#ffffff',
            }
        },
        x: {
            ticks: {
                // color: '#ffffff',
            }
        }
    }
});
const emptyTempusItem: tempusItem = {
    name: '',
    value: 0,
}

const primaryTempus = ref<tempusItem>(cloneDeep(emptyTempusItem));
const secondaryTempus = ref<tempusItem>(cloneDeep(emptyTempusItem));

const globalTense = getModelData<ITenseGlobal>(props.modelData, ModelResultDataModelEnum.Tense);
const partsTense = getModelData<ITenseParts[]>(props.modelData, ModelResultDataModelEnum.Tense, ModelResultDataSectionEnum.Parts);
const genreModelData = getModelData<IGenreClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.GenreClassification);
const audienceModelData = getModelData<IAudienceClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.AudienceClassification);
const chunkPartsData = getModelData<IChunksParts[]>(props.modelData, ModelResultDataModelEnum.Chunk, ModelResultDataSectionEnum.Parts);
const partsMetadata = ref<ChartMetadata>({
        datasets: [
            {
                data: []
            },
            {
                data: []
            }
        ]
    });

const globalTenseData = ref<ITenseGlobal>({ 
    "main tense": '', 
    "number of past tense": 0, 
    "number of present tense": 0, 
    "percentage of past tense": 0, 
    "percentage of present tense": 0, 
    "tenses count": {
        Past: 0,
        Pres: 0,
    } 
});
const partsTenseData = ref<ITenseParts[]>([]);
const genreData = ref<IGenreClassificationGlobal[]>([]);
const audienceData = ref<IAudienceClassificationGlobal[]>([]);
const AnalizedRAGData = ref<IRecommendationResponse>({
    message: '',
    RAG: '',
    RAGText: '',
    RAGLevel: '',
    rangeHigh: NaN,
    rangeLow: NaN,
});
const GivenRAGData = ref<IRecommendationResponse>({
    message: '',
    RAG: '',
    RAGText: '',
    RAGLevel: '',
    rangeHigh: NaN,
    rangeLow: NaN,
});

const RAGData = ref<IRecommendationResponse>({
    message: '',
    RAG: '',
    RAGText: '',
    RAGLevel: '',
    rangeHigh: NaN,
    rangeLow: NaN,
});
watch(
    () => store.AnalyzedOrGivenData,
    () => {
        if (store.AnalyzedOrGivenData === 'Angivet') {
            RAGData.value = cloneDeep(GivenRAGData.value);
        }
        else {
            RAGData.value = cloneDeep(AnalizedRAGData.value);
        }
    },
);

const valid = ref(true);

try {
    if (globalTense?.content !== undefined) {
        globalTenseData.value = globalTense.content;
    }
    if (partsTense?.content !== undefined) {
        partsTenseData.value = partsTense.content;
    }
    
    
    for (const content of partsTenseData.value) {
        // We only use first chunk in this.
        const chunk = content.chunks;

        lineChartData.value.labels.push(chunk.part.toString()+'%');
        lineChartData.value.datasets[0].data.push(chunk.tenses[0].Past ?? 0);
        lineChartData.value.datasets[1].data.push(chunk.tenses[0].Pres ?? 0);

        var chunkPartsTempus = chunkPartsData?.content?.find((x) => x.chunks.chunk_id == chunk.chunk_id);
        var chartMetadataElement = {
            text: chunkPartsTempus?.chunks.part_text ?? [],
        }
        partsMetadata.value.datasets[0].data.push(chartMetadataElement);
        partsMetadata.value.datasets[1].data.push(chartMetadataElement);
    }
    
    if (globalTenseData.value['main tense'] === 'Past') {
        primaryTempus.value.name = 'Datid';
        primaryTempus.value.value = Math.round(globalTenseData.value['percentage of past tense'] * 100);

        secondaryTempus.value.name = 'Nutid';
        secondaryTempus.value.value = Math.round(globalTenseData.value['percentage of present tense'] * 100);
    } else {
        primaryTempus.value.name = 'Nutid';
        primaryTempus.value.value = Math.round(globalTenseData.value['percentage of present tense'] * 100);

        secondaryTempus.value.name = 'Datid';
        secondaryTempus.value.value = Math.round(globalTenseData.value['percentage of past tense'] * 100);
    }

    if (genreModelData?.content !== undefined && audienceModelData?.content !== undefined) {
        genreData.value = genreModelData.content.sort((a, b) => b.score - a.score);
        audienceData.value = audienceModelData.content.sort((a, b) => b.score - a.score);
        const metric = store.getMetric(18);
        RecommendationService.getRecommendation(
            metric.id,
            store.getGenreId(genreData.value[0].class),
            store.getAudienceId(audienceData.value[0].class),
            recommendationValue(metric, props.modelData, props.manuscriptRevisionData)
        ).then(request => {
            const data = request.data.value;
            if (data !== undefined && data !== null) {
                if (store.AnalyzedOrGivenData !== 'Angivet') {
                    RAGData.value = data;
                }
                AnalizedRAGData.value = data;
            }
        });
        RecommendationService.getRecommendation(
            metric.id,
            store.getGenreId(props.manuscriptRevisionData.genre),
            store.getAudienceId(props.manuscriptRevisionData.audience),
            recommendationValue(metric, props.modelData, props.manuscriptRevisionData)
        ).then(request => {
            const data = request.data.value;
            if (data !== undefined && data !== null) {
                if (store.AnalyzedOrGivenData === 'Angivet') {
                    RAGData.value = data;
                }
                GivenRAGData.value = data;
            }
        });
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
try {
    // Resize chart before and after printing to make sure it fits printable area
    window.addEventListener('beforeprint', () => {
        const chart = lineChart.value?.getChart();
        if (chart != undefined && chart.resize != undefined)
            chart.resize(700, 300);
    });
    window.addEventListener('afterprint', () => {
        const chart = lineChart.value?.getChart();
        if (chart != undefined && chart.resize != undefined)
            chart.resize();
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
                <div class="header-right">
                    <div class="textbox large-text center-text px-4">
                        Din historie er i:
                        <p class="m-0 uppercase">{{ primaryTempus.name }}</p>
                    </div>
                </div>
            </div>
            <div class="body column">
                <div class="tempus-body">
                    <div class="secondary">
                        <circle-progress size="12rem" :percentage="secondaryTempus.value" />
                        <div class="text">
                            <p>{{ secondaryTempus.name }}</p>
                            Sekundær
                        </div>
                    </div>
                    <div class="primary">
                        <circle-progress size="12rem" :percentage="primaryTempus.value" />
                        <div class="text">
                            <p>{{ primaryTempus.name }}</p>
                            Primær
                        </div>
                    </div>
                    <div class="conclusion noPrint">
                        <checkmark v-if="RAGData.RAG === 'G'" class="icon" />
                        <circle-cross v-else-if="RAGData.RAG === 'R'" class="icon"/>
                        <circle-line v-else class="icon"/>
                        <div class="text">
                            <p>{{ RAGData.RAGLevel }}</p>
                            Konklusion
                        </div>
                    </div>
                </div>
                <div>
                    <div class="headline right">
                        Udvikling i Tempus
                    </div>
                    <div>
                        <ReportInteractiveChart chartType="line" :chartData="lineChartData" :chartOptions="lineChartOptions" :chartMetadata="partsMetadata" chartCssClass="h-20rem w-full" />
                    </div>
                </div>
            </div>
            <recommendations :report-id="reportId" :model-data="modelData" :manuscript-revision-data="manuscriptRevisionData" />
            <ReportInfoButtons :report-id="reportId" />
        </div>
        <tips :report-id="reportId" />
        <articles :report-id="reportId"/>
    </div>
</template>

<style scoped lang="scss">
.tempus-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 3rem;

    position: relative;
    
    > div {
        z-index: 1;
        max-width: 215px;
        width: 215px;
        
        > .text {
            color: #E4B200;
            text-align: center;
            font-size: 1.25rem;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            
            > p {
                color: #FFF;
                text-align: center;
                font-size: 1.875rem;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                
                margin: 0;
            }
        }
    }
    
    > .secondary {
        text-align: center;

        &:before {
            content: "";
            border: 1px solid #E4B200;
            position: absolute;
            top: 6rem;
            width: calc(50% - 17rem - 6px);
            left: calc(12rem - 2px);
            z-index: -1;
            @media print {
                content: initial;
            }
        }
    }
    > .primary {
        text-align: center;

        &:before {
            content: "";
            border: 1px solid #E4B200;
            position: absolute;
            top: 6rem;
            width: calc(50% - 16rem - 6px);
            right: calc(12rem - 2px);
            z-index: -1;
            @media print { 
                content: initial;
            }
        }
        
        
    }
    > .conclusion {
        text-align: center;
        margin-right: 2rem;

        &:before {
            content: "";
            border: 1px solid #E4B200;
            position: absolute;
            top: -1.5rem;
            width: 0;
            height: 1.5rem;
            right: calc(215px / 2 + 2rem);
            z-index: -1;
        }
        
        > .icon {
            width: 12rem;
            fill: none;
            
            > :deep(circle) {
                fill: #3F3F3F;
                stroke: #E4B200;
                stroke-width: 1px;
            }

            > :deep(path),> :deep(rect) {
                fill: #E4B200;
            }
        }
    }
}
</style>