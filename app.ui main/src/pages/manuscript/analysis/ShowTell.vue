<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum, ModelResultDataSectionEnum } from '@interface/Model.ts';
import CircleProgress from '@component/circleProgress.vue';
import { ref, watch } from 'vue';
import Tips from "@component/report/reportTips.vue";
import Articles from "@component/report/reportArticles.vue";
import Recommendations from '@component/report/reportRecommendations.vue';
import Chart from 'primevue/chart';
import { chartDataSet, ChartService } from '@service/chart.service.ts';
import { IAudienceClassificationGlobal, IChunksParts, IGenreClassificationGlobal, IPartsShowingTelling, IPowerWordsGlobal, IShowingTellingGlobal, IStringKeyNumberValue } from '@interface/Models.ts';
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import MetricsInfoBoxes from '@component/metricsInfoBoxes.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";
import { IRecommendationResponse } from '@interface/Recommendation.ts';
import { RecommendationService } from '@service/recommendation.service.ts';
import { getModelData, recommendationValue } from '@util/ReportHelper.ts';
import { useMainStore } from '@store/main.ts';
import { cloneDeep } from 'lodash';
import info from '@asset/icons/circleInfo.svg';
import { ChartMetadata } from '@component/report/ReportInteractiveChart.vue';
import ReportInteractiveChart from '@component/report/ReportInteractiveChart.vue';


interface ISortedData {
    name: string;
    val: number;
}

interface CustomPowerWordItem {
    name: string;
    words: ISortedData[];
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

const partsShowingTellingData = ref<IPartsShowingTelling[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.ShowingTelling && x.section === 'parts')?.content);
const powerWordsGlobal = getModelData<IPowerWordsGlobal>(props.modelData, ModelResultDataModelEnum.PowerWords);
const genreGlobal = getModelData<IGenreClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.GenreClassification);
const audienceGlobal = getModelData<IAudienceClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.AudienceClassification);

const chunkPartsData = getModelData<IChunksParts[]>(props.modelData, ModelResultDataModelEnum.Chunk, ModelResultDataSectionEnum.Parts);
const partsMetadata = ref<ChartMetadata>({
    datasets: [
        {
            data: []
        }
    ]
});

const valid = ref(true);
const charts = ref<any[]>([]);

const descriptiveWordsChart = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'Antal af beskrivende ord',
            data: [] as number[],
            fill: true,
            borderColor: ChartService.borderColor[0],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 1, // So endusers can easily click on the data points
            pointHoverRadius: 8
        },
    ]
});
const fillingWordsChart = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'Antal af fyldord',
            data: [] as number[],
            fill: true,
            borderColor: ChartService.borderColor[0],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 1, // So endusers can easily click on the data points
            pointHoverRadius: 8
        },
    ]
});
const lineChartOptions = ChartService.getDefaultLineOptions();

const totalScore = ref<number>(0);

const recommendation = ref<IRecommendationResponse>();
const GivenRecommendation = ref<IRecommendationResponse>();
const Analizedrecommendation = ref<IRecommendationResponse>();

const powerwordsGlobalData = ref<IPowerWordsGlobal>({ "number of power words": 0, power_words_categories: {}, propensity: 0, propensity_per_genre: {} });
const genreGlobalData = ref<IGenreClassificationGlobal[]>([]);
const audienceGlobalData = ref<IAudienceClassificationGlobal[]>([]);

const topGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});

const topAudience = ref<IAudienceClassificationGlobal>({
    class: '',
    score: 0
});

watch(
    () => store.AnalyzedOrGivenData,
    () => {
        if (store.AnalyzedOrGivenData === 'Angivet') {
            recommendation.value = cloneDeep(GivenRecommendation.value);
        }
        else {
            recommendation.value = cloneDeep(Analizedrecommendation.value);
        }
    },
);
if (props.modelData) {
    const topGenre = props.modelData.find(x => x.model === ModelResultDataModelEnum.GenreClassification)?.content.sort((a, b) => b.score - a.score)[0].class;
    const topAudience = props.modelData.find(x => x.model === ModelResultDataModelEnum.AudienceClassification)?.content.sort((a, b) => b.score - a.score)[0].class;
    const metric = store.getMetric(15);
    RecommendationService.getRecommendation(
        metric.id,
        store.getGenreId(topGenre),
        store.getAudienceId(topAudience),
        recommendationValue(metric, props.modelData, props.manuscriptRevisionData)
    ).then(request => {
        const data = request.data.value;
        if (data !== undefined && data !== null) {
            if (store.AnalyzedOrGivenData !== 'Angivet') {
                recommendation.value = data;
            }
            Analizedrecommendation.value = data;
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
                recommendation.value = data;
            }
            GivenRecommendation.value = data;
        }
    });
}

const activePowerWord = ref(0);

const defaultChartData = {
    labels: [] as string[],
    datasets: [{
        backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.5),
        borderColor: ChartService.borderColor[0],
        data: [] as number[],
        borderWidth: 2
    }] as chartDataSet[],
}
const defaultData = {
    name: '', 
    chartData: cloneDeep(defaultChartData),
};
const defaultChartArray = [
    cloneDeep(defaultData),
    cloneDeep(defaultData),
    cloneDeep(defaultData),
    cloneDeep(defaultData),
    cloneDeep(defaultData),
    cloneDeep(defaultData),
    cloneDeep(defaultData),
];
const powerwordChartData = ref(cloneDeep(defaultChartArray));
const powerwordChartOptions = ChartService.getDefaultBarOptions({
    indexAxis: 'y',
    plugins: {
        legend: {
            display: false,
        },
    },
});

const metricItem = ref({
    message: '',
    RAG: '',
    RAGText: '',
    RAGLevel: '',
    rangeHigh: 0,
    rangeLow: 0,
})

const sortAndLimit = (data: IStringKeyNumberValue): ISortedData[] => {
    return Object.entries(data).sort((a, b) => b[1] - a[1]).map(el => {
        return { name: el[0], val: el[1] }
    }).slice(0, 7);
}

try {
    for (const chunks of partsShowingTellingData.value) {
        let chunk = chunks.chunks;
        descriptiveWordsChart.value.labels.push(chunk.part.toString() + '%');
        descriptiveWordsChart.value.datasets[0].data.push(chunk['number of descriptive words']);

        fillingWordsChart.value.labels.push(chunk.part.toString() + '%');
        fillingWordsChart.value.datasets[0].data.push(chunk['number of filling words']);

        var chunkPartsTempus = chunkPartsData?.content?.find((x) => x.chunks.chunk_id == chunk.chunk_id);
        partsMetadata.value.datasets[0].data.push({
            text: chunkPartsTempus?.chunks.part_text ?? [],
        });
    }
    const globalShowTellData = ref<IShowingTellingGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.ShowingTelling && x.section === 'global')?.content);
    totalScore.value = Math.min(Math.round(globalShowTellData.value.show_tell_value*100),100);
    
    // Power words
    
    if (powerWordsGlobal?.content !== undefined) {
        powerwordsGlobalData.value = powerWordsGlobal.content;
    }
    if (genreGlobal?.content !== undefined) {
        genreGlobalData.value = genreGlobal.content.sort((a, b) => b.score - a.score);
        topGenre.value = genreGlobalData.value[0];
    }
    if (audienceGlobal?.content !== undefined) {
        audienceGlobalData.value = audienceGlobal.content.sort((a, b) => b.score - a.score);
        topAudience.value = audienceGlobalData.value[0];
    }
    
    const powerWordsCategories: CustomPowerWordItem[] = Object.entries(powerwordsGlobalData.value.power_words_categories)
        .sort((a, b) => b[1].propensity - a[1].propensity)
        .map<CustomPowerWordItem>(el => {
            return { 
                name: el[0],
                words: sortAndLimit(el[1].count)
            }
        }).slice(0, 7);
    for (const [i, value] of powerWordsCategories.entries()) {
        powerwordChartData.value[i].name = value.name;
        for (const powerWord of value.words) {
            if (powerWord.name !== 'lig') {
                powerwordChartData.value[i].chartData.labels.push(powerWord.name);
                powerwordChartData.value[i].chartData.datasets[0].data.push(powerWord.val);
            }
        }
    }

        const metric = store.getMetric(17);
        const recommendationVal = recommendationValue(metric, props.modelData, props.manuscriptRevisionData);

        RecommendationService.getRecommendation(
            metric.id,
            store.getGenreId(topGenre.value.class),
            store.getAudienceId(topAudience.value.class),
            recommendationVal
        ).then((request) => {
            const data = request.data.value;
            if (data !== undefined && data !== null) {
                data.message = RecommendationService.convertVariablesToText(data.message, props.manuscriptRevisionData, props.modelData);
                metricItem.value = data;
            }
        })

} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}

try {
    // Resize chart before and after printing to make sure it fits printable area
    window.addEventListener('beforeprint', () => {
        for (const chartElement of charts.value) {
            const chart = chartElement?.getChart();
            if (chart != undefined && chart.resize != undefined) {
                chart.resize(700, 240);
            }
        }
    });
    window.addEventListener('afterprint', () => {
        for (const chartElement of charts.value) {
            const chart = chartElement?.getChart();
            if (chart != undefined && chart.resize != undefined) {
                chart.resize();
            }
        }
    });
} catch (e) {
    console.error('Unhandled error:', e);
}

</script>

<template>
    <div class="showtell report-wrapper">
        <div class="showtell-container container">
            <div class="showtell-header">
                <div class="showtell-header-left">
                    <report-what-is :report-id="reportId" />
                </div>
                <div class="showtell-header-right">
                    <CircleProgress
                        size="15rem"
                        :percentage="totalScore"
                    />
                    <div class="showtell-progress-message">
                        {{ recommendation?.RAGLevel }}
                    </div>
                    <div class="subline center mt-3">
                        Samlet Score
                    </div>
                </div>
            </div>
            <MetricsInfoBoxes :model-data="modelData" :metrics="[11,12,13,14]" :manuscript-revision-data="manuscriptRevisionData" />
            <recommendations :report-id="reportId" :model-data="modelData" :manuscript-revision-data="manuscriptRevisionData" />
            <ReportInfoButtons :report-id="reportId" />
        </div>
        <tips :report-id="reportId" />
        <div class="container chart mt-4">
            <h1 class="flex mt-0 justify-content-center">
                Avanceret
            </h1>
            <div class="textbox">
                Her finder du en mere avanceret gennemgang af, hvor de beskrivende ord udspiller sig i din bog. Du kan bruge denne til at undersøge, hvor i din bog, du bruger mange beskrivende ord og hvor du bruger færre. Måske er brugen mere udbredt nogle steder end andre. Brug graferne til at rette de specifikke afsnit til.
            </div>
            <div class="header column">
                <div class="headline text-color text-align-center">Beskrivende ord</div>
            </div>
            <div class="body column chart">
                <ReportInteractiveChart chartType="line" :chartData="descriptiveWordsChart" :chartOptions="lineChartOptions" :chartMetadata="partsMetadata" chartCssClass="h-20rem" />
            </div>
            <div class="header column">
                <div class="headline text-color text-align-center">Fyldord</div>
            </div>
            <div class="body column chart">
                <ReportInteractiveChart chartType="line" :chartData="fillingWordsChart" :chartOptions="lineChartOptions" :chartMetadata="partsMetadata" chartCssClass="h-20rem" />
            </div>
        </div>
        <div class="container powerwords-body-container">
            <div class="body column noPrint text-align-center">
                <div class="headline text-color text-align-center">Stærke ord</div>
                <div class="headline text-color text-align-center small">Klik dig igennem kategorierne</div>
            </div>
            <div class="wrapper PowerWordsWrapper noPrint">
                <div class="chart-wrapper">
                    <div class="chart-header">
                        <div class="chart-header-item" v-for="(item, index) in powerwordChartData" v-bind:class="{
                            'active': index === activePowerWord,
                        }">
                            <div class="number">
                                {{ index+1 }}.
                            </div>
                            <div class="text" @click="activePowerWord = index">
                                {{ item.name || 'text' }}
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <Chart type="bar" :data="powerwordChartData[activePowerWord].chartData" :options="powerwordChartOptions" />
                    </div>
                </div>
                <div class="information-text-boxes" v-if="metricItem.message != ''">
                    <div><!-- Din anvendelse af stærke ord er  -->
                        <p><span :class="metricItem.RAG">{{ metricItem.RAGText }}</span></p>
                    </div>
                    <div>
                        <info class="fill-primary"/>
                        <span class="infoText">{{ metricItem.message }}</span>
                    </div>
                </div>
            </div>

            <div class="wrapper onlyPrint">
                <div class="header">
                    <div class="headline">Stærke ord</div>
                </div>
                <div class="chart-wrapper" v-for="(item, index) in powerwordChartData">
                    <div class="chart-header">
                        <div class="chart-header-item">
                            <div class="text">
                                {{ item.name || 'text' }}
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <Chart :ref="(el) => { charts.push(el); }" type="bar" :data="powerwordChartData[index].chartData" :options="powerwordChartData" class="notFullViewWidth" />
                    </div>
                </div>
                <div class="information-text-boxes" v-if="metricItem.message != ''">
                    <div><!-- Din anvendelse af stærke ord er -->
                        <p><span :class="metricItem.RAG">{{ metricItem.RAGText }}</span></p>
                    </div>
                    <div>
                        <info class="fill-primary"/>
                        <span class="infoText">{{ metricItem.message }}</span>
                    </div>
                </div>
            </div>
        </div>
        <articles :report-id="reportId"/>
    </div>
</template>

<style scoped lang="scss">
.showtell.report-wrapper {
    display: flex;
    flex-direction: column;
    
    > div:not(:last-of-type) {
        border-bottom: 1px solid var(--primary-500);
    }

    .showtell-container {
        display: flex;
        flex-direction: column;
        padding: 0.5rem 5rem;

        .showtell-header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .showtell-header-left {
                margin-right: 2rem;

                > .headline {
                    color: #E4B200;
                    font-family: var(--font-family);
                    font-size: 2rem;
                    font-weight: 700;
                }
                > .textbox {
                    padding: 0.5rem;
                    border-radius: 0.6rem;
                    border: 1px solid #E4B200;
                    background: rgba(217, 217, 217, 0.13);
                    max-width: 50rem;

                    > p {
                        color: #E4B200;
                        font-family: var(--font-family);
                        font-size: 1rem;
                        font-weight: 700;
                    }
                }
            }

            .showtell-header-right {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                margin-right: 10rem;
                
                > svg {
                    z-index: 1;
                }

                > .showtell-progress-message {
                    position: absolute;
                    overflow: visible;
                    flex-shrink: 1;
                    width: 12rem;
                    border-radius: 1rem;
                    background: #3f3f3f;
                    z-index: 0;
                    padding: 1rem 1rem 1rem 2.5rem;
                    right: -10rem;
                    border: 1px solid #E4B200;
                    font-size: 1.25rem;
                    line-height: 150%;
                    
                    @media print {
                        background-color: #fff;
                    }
                }
                
                > .subline {
                    color: #E4B200;
                    font-family: var(--font-family);
                    font-size: 1.25rem;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                }
            }
        }
        .showtell-body {
            display: flex;
            flex-direction: row;
            align-content: stretch;
            flex-wrap: wrap;
            justify-content: center;
            align-items: stretch;
            padding: 0 5rem;
            margin: 1rem 0;
        }
        .showtell-information {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            > div {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin-left: 1rem;

                &:first-of-type {
                    margin-left: 0;
                }

                > svg {
                    margin-right: 0.5rem;
                    width: 2.5rem;

                    > :deep(path) {
                        fill: #2C2C2C;
                    }
                }
            }
        }
    }

    .advancedData {
        padding: 2rem 5rem;
        
        
    }

    .powerwords-body-container {
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

        > .wrapper {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 1rem 0;

            > .header {
                display: flex;
                flex-direction: column;
                align-items: center;

                > .headline {
                    color: #2C2C2C;
                    text-align: center;
                    font-size: 1.1555rem;
                    font-weight: 700;
                    border-radius: 1.23256rem;
                    border: 1.233px solid #E4B200;
                    background: #E4B200;
                    padding: 0.25rem 2rem;
                    margin-bottom: 1rem;

                    @media print {
                        border-radius: 4.5rem;
                        border: 1px solid #E4B200;
                        font-size: 1.75rem;
                        font-weight: 700;
                        padding: 0.5rem 2rem;
                    }
                }

                > .subline {
                    color: #FFF;
                    text-align: center;
                    font-size: 1.3785rem;
                    font-weight: 700;
                }
            }

            > .chart-wrapper {
                display: flex;
                flex-direction: column;
                align-content: stretch;

                > .chart-header {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-evenly;

                    > .chart-header-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        text-align: center;

                        > .number {
                            font-size: 2rem;
                        }

                        > .text {
                            border-radius: 4.5rem;
                            border: 1px solid #E4B200;
                            background: #5B5B5B;
                            font-size: 1.25rem;
                            padding: 0.5rem 2rem;
                            cursor: pointer;
                            user-select: none;

                            @media print {
                                background-color: #fff;
                            }
                        }

                        &.active {
                            position: relative;

                            > .text {
                                background: #E4B200;
                                color: #000;
                            }

                            &:before {
                                content: "";
                                border-left: 1px solid #E4B200;
                                position: absolute;
                                bottom: -1rem;
                                width: 0;
                                height: 1rem;
                                right: calc(50% - 1px);
                                z-index: 1;
                            }
                        }
                    }
                }

                > .chart-container {
                    border-radius: 2.6875rem;
                    border: 1px solid #E4B200;
                    padding: 0.5rem 2rem;
                    margin: 1rem 0;

                    > .p-chart {
                        height: 15rem;
                        width: 100%;
                    }
                }
            }

            > .information-text-boxes {
                display: flex;
                flex-direction: row-reverse;
                gap: 1rem;
                align-items: stretch;
                color: #FFF;
                font-size: 1.25rem;
                font-weight: 700;
                line-height: 1.875rem;

                @media print {
                    flex-direction: column-reverse;
                }

                > div {
                    border-radius: 3.76338rem;
                    border: 0.599px solid #E4B200;
                    background: #5B5B5B;
                    padding: 0.5rem 1.5rem;
                    margin: 0.5rem 0;
                    align-items: center;
                    justify-items: center;
                    align-content: center;
                    text-align: center;

                    @media print {
                        background-color: #fff;
                        color: #000;
                    }

                    &:first-child {
                        flex-basis: 75%;
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        justify-content: center;
                    }
                    &:last-child {
                        display: grid;
                        grid-auto-flow: column;
                        grid-template-columns: 4rem auto;
                        padding-left: 0.5rem;
                    }
                    > p {
                        margin: 0;

                        > span {
                            &.R {
                                color: #EF4444;
                            }

                            &.A {
                                color: #E4B200;
                            }

                            &.G {
                                color: #22C55E;
                            }
                        }
                    }

                    > .infoText {
                        margin-left: 0.5rem;
                    }

                    > svg {
                        justify-self: left;
                        width: 4rem;
                        flex-shrink: 0;
                        margin-right: 0.5rem;

                        > :deep(path) {
                            fill: #2C2C2C;
                        }
                    }
                }
            }

            > .information {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                > div {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    margin-left: 1rem;

                    &:first-of-type {
                        margin-left: 0;
                    }

                    > svg {
                        margin-right: 0.5rem;
                        width: 2.5rem;

                        > :deep(path) {
                            fill: #2C2C2C;
                        }
                    }
                }
            }
        }
    }
}
</style>