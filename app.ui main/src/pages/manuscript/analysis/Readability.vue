<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import {ModelResultData, ModelResultDataModelEnum, ModelResultDataSectionEnum} from '@interface/Model.ts';
import { computed, ref, watch } from 'vue';
import {
    IChunksParts,
    ILegibilityGlobal,
    ILegibilityParts
} from "@interface/Models.ts";
import info from '@asset/icons/circleInfo.svg';
import Dialog from "primevue/dialog";
import { percentFormatter } from "@util/numberHelper.ts";
import Tips from "@component/report/reportTips.vue";
import Articles from "@component/report/reportArticles.vue";
import Recommendations from "@component/report/reportRecommendations.vue";
import { ChartService } from "@service/chart.service.ts";
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from '@component/report/reportWhatIs.vue';
import {IRecommendationResponse} from "@interface/Recommendation.ts";
import {RecommendationService} from "@service/recommendation.service.ts";
import {useMainStore} from "@store/main.ts";
import { createNumberBalls, getModelData, recommendationValue } from "@util/ReportHelper.ts";
import { cloneDeep } from 'lodash';
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

const store = useMainStore();

const numberBalls = createNumberBalls(
    cloneDeep(store.getMetricForReport(props.reportId)).filter(x => x.id !== 1),
    props.modelData,
    props.manuscriptRevisionData
);

const nonNumberBallMetrics = store.getMetricForReport(props.reportId).filter(x => x.id === 1);

const chartDialog = ref(false);
const lixDialog = ref(false);

const globalLegibilityData = ref<ILegibilityGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Legibility && x.section === 'global')?.content);
const partsLegibilityData = ref<ILegibilityParts[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Legibility && x.section === 'parts')?.content);

const recommendation = ref<IRecommendationResponse>();

const getGenre = () => {
    switch (store.AnalyzedOrGivenData) {
        case 'Analyseret':
            return store.getGenreId(props.modelData.find(x => x.model === ModelResultDataModelEnum.GenreClassification)?.content.sort((a, b) => b.score - a.score)[0].class);
        case 'Angivet':
            return store.getGenreId(props.manuscriptRevisionData.genre);
        default:
            return store.getGenreId(props.manuscriptRevisionData.genre);
    }
}

const getAudience = () => {
    switch (store.AnalyzedOrGivenData) {
        case 'Analyseret':
            return store.getAudienceId(props.modelData.find(x => x.model === ModelResultDataModelEnum.AudienceClassification)?.content.sort((a, b) => b.score - a.score)[0].class);
        case 'Angivet':
            return store.getAudienceId(props.manuscriptRevisionData.audience);
        default:
            return store.getAudienceId(props.manuscriptRevisionData.audience);
    }
}

const applyData = () => {
    if (props.modelData) {
        const metric = store.getMetric(1);
        RecommendationService.getRecommendation(
            metric.id,
            getGenre(),
            getAudience(),
            recommendationValue(metric, props.modelData, props.manuscriptRevisionData)
        ).then(request => {
            const data = request.data.value;
            if (data !== undefined && data !== null) {
                recommendation.value = data;
            }
        });
    }
}

const chunkPartsData = getModelData<IChunksParts[]>(props.modelData, ModelResultDataModelEnum.Chunk, ModelResultDataSectionEnum.Parts);
const partsMetadata = ref<ChartMetadata>(
    {
        datasets: [
            {
                data: []
            },
            {
                data: []
            }
        ]
    });

const notForTable = ['chunk_id', 'chunk_in_paragraph_id', 'lexicon'];
const tableData = ref<any[]>([]);
const lineChart = ref();
const lineChartOptions = ChartService.getDefaultLineOptions();
const lineChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'avergage sentence length',
            data: [] as number[],
            fill: false,
            backgroundColor: ChartService.backgroundColors[0],
            borderColor: ChartService.hoverBackgroundColors[0],
            borderWidth: 2,
            pointRadius: 1, // So endusers can easily click on the data points
            pointHoverRadius: 8,
        },
        {
            label: 'LIX',
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

const lixData = computed(() => {
    return store.getLixText(globalLegibilityData.value.LIX);
});
const getListLign = (list: string): string[] => {
    return list.split(';');
}

const valid = ref(true);

try {
    for (const content of partsLegibilityData.value) {
        const chunk = content.chunks;
        lineChartData.value.labels.push(chunk.part.toString() + '%');
        lineChartData.value.datasets[0].data.push(chunk['average sentence length']);
        lineChartData.value.datasets[1].data.push(chunk.LIX);

        var chunkPartsTempo = chunkPartsData?.content?.find((x) => x.chunks.chunk_id == chunk.chunk_id);
        var chartMetadataElement = {
            text: chunkPartsTempo?.chunks.part_text ?? [],
        }
        partsMetadata.value.datasets[0].data.push(chartMetadataElement);
        partsMetadata.value.datasets[1].data.push(chartMetadataElement);
    }

    for (let gstd in globalLegibilityData.value) {
        if (notForTable.includes(gstd)) {
            continue;
        }
        tableData.value.push({
            name: gstd,
            value: globalLegibilityData.value[gstd],
        });
    }

    applyData();
    watch(
        () => store.AnalyzedOrGivenData,
        () => applyData(),
        { immediate: true }
    );
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}

try {
    // Resize chart before and after printing to make sure it fits printable area
    window.addEventListener('beforeprint', () => {
        const chart = lineChart.value?.getChart();
        if (chart != undefined && chart.resize != undefined)
            chart.resize(800, 300);
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
    <div class="readability report-wrapper">
        <div class="container" style="line-height: 1.5;">
            <div class="body column">
                <ReportWhatIs :report-id="reportId" />
            </div>
            <div class="body column">
                <h1 class="headline text-align-center">
                    <span>Her er et overblik over, hvor nem din bog er at læse:</span>
                </h1>
                <div class="readability-header-info">
                    <div class="data-wrapper">
                        <div class="data-table-wrapper">
                            <div class="data-table-body">
                                <div class="data-table-row">
                                    <div class="data-table-cell">Antal sætninger</div>
                                    <div class="data-table-cell">{{ globalLegibilityData["number of sentences"] }}</div>
                                </div>
                                <div class="data-table-row">
                                    <div class="data-table-cell">Antal ord</div>
                                    <div class="data-table-cell">{{ globalLegibilityData["number of words"] }}</div>
                                </div>
                                <div class="data-table-row">
                                    <div class="data-table-cell">Andel af komplekse ord</div>
                                    <div class="data-table-cell">{{ percentFormatter.format(globalLegibilityData["percentage of complex words"]) }}</div>
                                </div>
                                <div class="data-table-row">
                                    <div class="data-table-cell">Gennemsnitlig sætningslængde</div>
                                    <div class="data-table-cell">{{ globalLegibilityData["average sentence length"].toFixed(2) }} ord</div>
                                </div>
                                <div class="data-table-row">
                                    <div class="data-table-cell">Leksikonstørrelse</div>
                                    <div class="data-table-cell">{{ globalLegibilityData["lexicon size"] }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="lix-container flex align-items-center">
                        <div class="flex flex-column gap-2">
                            <span class="text-primary font-bold flex align-items-center ml-5" style="font-size: 1.48rem;">
                                Dit Lix-tal
                            </span>
                            <div class="flex align-items-center">
                                <div class="lix-circle">
                                    <div class="flex flex-column align-items-center justify-content-center h-full">
                                        <span class="font-bold" style="font-size: 3.27rem;">
                                            {{ Math.floor(globalLegibilityData.LIX) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="lix-wrapper">
                                    {{ recommendation?.RAGLevel }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <recommendations
                :report-id="reportId"
                :model-data="props.modelData"
                :manuscript-revision-data="manuscriptRevisionData"
                :number-balls="numberBalls"
            />
            <recommendations
                :report-id="reportId"
                :model-data="props.modelData"
                :manuscript-revision-data="manuscriptRevisionData"
                :metrics="nonNumberBallMetrics"
                :no-header="true"
            />
            <ReportInfoButtons :report-id="reportId" />
        </div>
        <div class="container">
            <div class="body column align-items-center">
                <h1 class="flex flex-column align-items-center my-0">
                    Lix skala
                </h1>
                <div class="lixtext">
                    Lix-skalaen hjælper dig med at tilpasse den sproglige kompleksitet i din bog, så den passer bedst
                    muligt til din målgruppe. Lix-tallet sammenlignes med andre bøger i samme genre og med samme målgruppe
                    som din.
                </div>
                <div class="lixbar mb-2">
                    <div class="point-wrapper" :style="'left: ' + globalLegibilityData.LIX + '%;'">
                    <span class="text-primary" style="font-size: 1.25rem; font-weight: 700;">
                        {{ Math.floor(globalLegibilityData.LIX) }}
                    </span>
                        <div style="height: 1.5rem; border-left: 1px solid #FFF; width: 1px;"/>
                        <div class="lixpoint"></div>
                    </div>
                </div>
                <div class="flex justify-content-between" style="width: 51rem;">
                <span class="lixmarker">
                    0
                </span>
                    <span class="lixmarker">
                    25
                </span>
                    <span class="lixmarker">
                    50
                </span>
                    <span class="lixmarker">
                    75
                </span>
                    <span class="lixmarker">
                    100
                </span>
                </div>
                <div class="flex gap-4 my-3 justify-content-center">
                    <div class="text-wrapper">
                        <div class="flex flex-column justify-content-between">
                            <div class="lix-headline flex justify-content-between w-full">
                            <span class="text-white">
                                Din lix score:
                            </span>
                                {{ lixData.min }}-{{ lixData.max }}
                            </div>
                            <div class="lix-body">
                                <span>{{ lixData.headline }}</span>
                                <br>
                                {{ lixData.text }}
                                <div class="flex justify-content-end noPrint">
                                    <div class="flex mt-3 gap-2 align-items-center cursor-pointer" @click="lixDialog = true">
                                        <span style="font-weight: 700; font-size: 1rem;">Hvad betyder Lix-tal?</span>
                                        <info class="iconfill" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-wrapper">
                        <div class="flex flex-column">
                            <div class="lix-headline w-full">
                            <span class="text-white" style="font-size: 1.25rem">
                                Udgivelser med lignende lix
                            </span>
                            </div>
                            <div class="lix-body">
                                <ul class="lix-list">
                                    <li v-for="similarLixText in getListLign(lixData.lign)">
                                        {{ similarLixText }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <tips :report-id="reportId"/>
        <div class="container">
            <div class="body column">
                <h1 class="flex flex-column align-items-center mt-0">
                    Udvikling af Lix og sætningslængde
                </h1>
                <ReportInteractiveChart chartType="line" :chartData="lineChartData" :chartOptions="lineChartOptions" :chartMetadata="partsMetadata" chartCssClass="h-20rem" />
                <div class="flex justify-content-end noPrint">
                    <div class="flex mt-3 gap-2 align-items-center cursor-pointer" @click="chartDialog = true">
                        <info class="iconfill" />
                        Hvad kan du bruge grafen til?
                    </div>
                </div>
            </div>
        </div>
        <articles :report-id="reportId"/>
    </div>

    <Dialog v-model:visible="chartDialog" modal header="Hvad kan du bruge grafen til?" :style="{ width: '50vw'}"
            :pt="{
                headerTitle: {
                    style: {
                        color: '#E4B200',
                    }
                }
            }">
        EVA INDSÆTTER TEKST HER
    </Dialog>

    <Dialog v-model:visible="lixDialog" modal header="Hvad betyder Lix-tal??" :style="{ width: '50vw'}"
            :pt="{
                headerTitle: {
                    style: {
                        color: '#E4B200',
                    }
                }
            }">
        • 55 > Meget svær, faglitteratur på akademisk niveau, lovtekster.
        <br>
        •45 - 54 Svær, saglige bøger, populærvidenskabelige værker, akademiske udgivelser.
        <br>
        •35 - 44 Middel, dagblade og tidsskrifter.
        <br>
        •25 - 34 Let for øvede læsere, ugebladslitteratur og let skønlitteratur for voksne
        <br>
        •24 &lt; Let tekst for alle læsere, børnelitteratur dels følgende statistiske resultater:
        <br>
        •Antal ord
        <br>
        •Antal sætninger
        <br>
        •Gennemsnitlig ordlængde
        <br>
        •Gennemsnitlig sætningslængde
        <br>
        •Antal og procent komplekse ord
        <br>
        •Ordforråd
    </Dialog>
</template>

<style scoped lang="scss">
.readability.report-wrapper {
    min-width: 1600px;
}

.readability-header-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 1.5rem;
    
    @media print {
        //flex-direction: column;
        gap: 0;
    }
    
    > .data-wrapper {
        flex: 0 50 auto;
        
        @media print {
            //flex: 1 1 auto;
        }

        > .data-table-wrapper, 
        > .data-table {
            width: initial;
            > .data-table-body {
                > .data-table-row {
                    > .data-table-cell {
                        &:first-child {
                            width: 20rem;
                        }
                        &:last-child {
                            text-align: right;
                            color: #E4B200;
                        }
                    }
                }
            }
        }
    }
    
    > .lix-container {
        position: relative;
        width: 27rem;
    }
}

.lix-circle {
    width: 11.8rem;
    height: 11.8rem;
    border-radius: 50%;
    background: #E4B200;
    z-index: 1;
}

.lix-wrapper {
    position: absolute;
    overflow: visible;
    flex-shrink: 1;
    width: 20rem;
    border-radius: 1rem;
    background: #3f3f3f;
    z-index: 0;
    padding: 1rem 1rem 1rem 6.9rem;
    margin-left: 5.9rem;
    border: 1px solid #E4B200;
    font-size: 1.25rem;
    line-height: 150%;
    
    @media print {
        background-color: #fff;
    }
}

.lixtext {
    color: #E4B200;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2.5rem; /* 200% */
    background: #3f3f3f;
    border-radius: 1rem;
    margin-top: 1rem;
    padding: 0 1rem;
    border: 1px solid #E4B200;
    width: 50rem;

    @media print {
        background-color: #fff;
        color: #000;
    }
}

.lixbar {
    width: 51rem;
    height: 1rem;
    background: #E4B200;
    border-radius: 6.3rem;
    position: relative;
    margin-top: 5.5rem;
}

.point-wrapper {
    margin-top: -66px;
    margin-left: -1.25rem;
    position: absolute;
    overflow: visible;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.lixpoint {
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid #FFF;
    background: #5B5B5B;
}

.lixmarker {
    color: #FFF;
    text-align: center;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    
    @media print {
        color: #000;
    }
}

.iconfill {
    fill: var(--primary-color);
    width: 2.5rem;

    > :deep(path) {
        fill: #000000;
    }
}

.text-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;
    
    @media print {
        span {
            color: #000 !important;
        }
    }

    > div {
        border-radius: 16px;
        border: 1px solid #E4B200;
        background: rgba(217, 217, 217, 0.13);
        max-width: 28rem;

        font-family: var(--font-family);
        font-size: 1.25rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.875rem;
    }

    > div {

        > .lix-headline {
            color: #E4B200;
            border-bottom: 1px solid #E4B200 !important;
            font-size: 1.75rem;
            line-height: normal;
            padding: 0.5rem 1rem;
            font-weight: 700;
        }
        > .lix-body {
            padding: 1rem;

            > span {
                color: #E4B200;
                font-size: 1.5rem;
                font-weight: 700;
                line-height: 1.875rem; /* 125% */
            }

            > .lix-list {
                color: #E4B200;
                font-size: 1.5rem;
                line-height: 2rem; /* 150% */
                margin: 0;
                max-width: 19rem;

                > li {
                    list-style-type: disc;
                }
            }
        }
    }
}
</style>