<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum, ModelResultDataSectionEnum } from '@interface/Model.ts';
import checkmark from '@asset/icons/circleCheckmark.svg';
// import cross from '@asset/icons/circleCross.svg';
// import line from '@asset/icons/circleLine.svg';
import { ref, watch } from 'vue';
import {
    IArchetypeContentGlobal, IArchetypeContentParts,
    IArchetypesGlobal,
    IAudienceClassificationGlobal,
    IChunksParts,
    IGenreClassificationGlobal
} from '@interface/Models.ts';
import Tips from '@component/report/reportTips.vue';
import Articles from '@component/report/reportArticles.vue';
import { getModelData, recommendationValue } from '@util/ReportHelper.ts';
import { useMainStore } from '@store/main.ts';
import { RecommendationService } from '@service/recommendation.service.ts';
import ArchetypeGraph from '@component/archetypeGraph.vue';
import ReportRecommendations from '@component/report/reportRecommendations.vue';
import { ChartService } from '@service/chart.service.ts';
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from '@component/report/reportWhatIs.vue';
import { IRecommendationResponse } from '@interface/Recommendation.ts';
import ModelErrorMessage from '@component/modelErrorMessage.vue';
import { ChartMetadata } from '@component/report/ReportInteractiveChart.vue';
import ReportInteractiveChart from '@component/report/ReportInteractiveChart.vue';

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
    reportId: number,
}>();

const data = getModelData<IArchetypeContentGlobal>(props.modelData, ModelResultDataModelEnum.Archetypes);
const archetypePartsModel = getModelData<IArchetypeContentParts[]>(props.modelData, ModelResultDataModelEnum.Archetypes, ModelResultDataSectionEnum.Parts);
const genreModelData = getModelData<IGenreClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.GenreClassification);
const audienceModelData = getModelData<IAudienceClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.AudienceClassification);
const archetypeGlobal = ref<IArchetypeContentGlobal>();
const archetypeParts = ref<IArchetypeContentParts[]>();
const genreData = ref<IGenreClassificationGlobal[]>([]);
const audienceData = ref<IAudienceClassificationGlobal[]>([]);

const chunkPartsData = getModelData<IChunksParts[]>(props.modelData, ModelResultDataModelEnum.Chunk, ModelResultDataSectionEnum.Parts);
const partsMetadata = ref<ChartMetadata>({
    datasets: [
        {
            data: []
        }
    ]
});

const topArchetype = ref<IArchetypesGlobal>({
    class: '',
    score: 0,
    pattern: [],
});

const topGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});

const selectedGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});

const selectedAudience = ref<IAudienceClassificationGlobal>({
    class: '',
    score: 0
});

const topAudience = ref<IAudienceClassificationGlobal>({
    class: '',
    score: 0
});

const valid = ref(true);

const store = useMainStore();
const metrics = store.getMetricForReport(props.reportId);
const pillRecommendation = ref<IRecommendationResponse>({
    message: '',
    RAG: '',
    RAGText: '',
    RAGLevel: '',
    rangeHigh: 0,
    rangeLow: 0
});

const lineChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'Tendenslinje',
            data: [] as number[],
            fill: false,
            borderColor: ChartService.borderColor[0],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 1, // So endusers can easily click on the data points
            pointHoverRadius: 8
        },
    ]
});
const lineChartOptions = ChartService.getDefaultLineOptions({
    scales: {
        y: {
            suggestedMin: -0.2,
            suggestedMax: 0.2,
        }
    }
});

const archetypeText = ref('');

const getSummaryText= () => {
    // if (props.manuscriptRevisionData.genre === topGenre.value.class) {
    //     return 'Edisons analyse viser,' +
    //         ' at den genre du har valgt har det største match med din tekst.' +
    //         ' Genresikkerheden kan dog stadig være lav, ' +
    //         'hvis der ikke er brugt tilstrækkelige genrekonventioner eller indikatorer.';
    // }
    return RecommendationService.convertVariablesToText(pillRecommendation.value.RAGText, props.manuscriptRevisionData);
}

const summaryText = ref<string>(getSummaryText());

const applyData = () => {
    if (genreModelData?.content !== undefined && audienceModelData?.content !== undefined) {
        genreData.value = genreModelData.content.sort((a, b) => b.score - a.score);
        audienceData.value = audienceModelData.content.sort((a, b) => b.score - a.score);
        topGenre.value = genreData.value[0];
        topAudience.value = audienceData.value[0];
        switch (store.AnalyzedOrGivenData) {
            case 'Analyseret':
                selectedAudience.value = topAudience.value;
                selectedGenre.value = topGenre.value;
                break;
            case 'Angivet':
                selectedAudience.value = audienceData.value.find(
                        audience => audience.class === props.manuscriptRevisionData.audience
                    )
                    || topAudience.value;
                selectedGenre.value = genreData.value.find(
                        genre => genre.class === props.manuscriptRevisionData.genre
                    )
                    || genreData.value[0];
                break;
        }
    }

    RecommendationService.getRecommendation(
        metrics[0].id,
        store.getGenreId(selectedGenre.value.class),
        store.getAudienceId(selectedAudience.value.class),
        recommendationValue(metrics[0], props.modelData, props.manuscriptRevisionData)
    ).then(request => {
        const data = request.data.value;
        if (data !== undefined && data !== null) {
            pillRecommendation.value = data;
            summaryText.value = getSummaryText();
        }
    });
};

try {
    if (data?.content !== undefined) {
        archetypeGlobal.value = data.content;
    }
    if (archetypePartsModel?.content !== undefined) {
        archetypeParts.value = archetypePartsModel.content;
    }
    if (archetypeGlobal.value !== undefined) {
        topArchetype.value = {
            class: archetypeGlobal.value.best_archetype_name,
            score: archetypeGlobal.value.best_archetype_score,
            pattern: [],
        };
    }

    if (archetypeParts.value !== undefined) {
        for (const chunks of archetypeParts.value) {
            let chunk = chunks.chunks;
            lineChartData.value.labels.push(chunk.part.toString() + '%');
            lineChartData.value.datasets[0].data.push(chunk['trendline']);

            var chunkPartsTempo = chunkPartsData?.content?.find((x) => x.chunks.chunk_id == chunk.chunk_id);
            partsMetadata.value.datasets[0].data.push({
                text: chunkPartsTempo?.chunks.part_text ?? [],
            });
        }
    }
    const atText = store.getArchetypeTextByClass(topArchetype.value.class);
    archetypeText.value = atText.text;
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

</script>

<template>
    <div class="report-wrapper" v-if="valid">
        <div class="container" style="line-height: 1.5;">
            <div v-if="topArchetype" class="header">
                <div class="header-left">
                    <report-what-is :report-id="reportId"/>
                    <div class="flex justify-content-center mt-4 m-auto">
                        <div v-bind:class="pillRecommendation.RAG"
                             class="pill-recommendation flex align-items-center justify-content-between gap-2 px-2 mt-4">
<!--                            <span class="ml-3 font-bold" style="font-size: 2.25rem;">-->
<!--                                Arketypeoverensstemmelse:-->
<!--                            </span>-->
                            <div class="flex align-items-center">
                                <span class="mx-6 font-bold" style="font-size: 2.25rem;">
                                    {{ summaryText }}
                                </span>
                                <checkmark v-if="pillRecommendation.RAG === 'G'" style="fill: #19B400; width: 5.2rem;"/>
<!--                                <cross v-else-if="pillRecommendation.RAG === 'R'"-->
<!--                                       style="fill: #FF0F00; width: 5.2rem;"/>-->
<!--                                <line v-else style="fill: #E4B200; width: 5.2rem;"/>-->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="header-right">
                    <div class="flex flex-column align-items-center">
                        <h1 class="flex flex-column align-items-center">
                            Din arketype er:
                        </h1>
                        <ArchetypeGraph :archetype="topArchetype.class" style="width: 25rem; height: 14rem;"/>
                    </div>
                    <div class="flex flex-column align-items-center">
                        <span class="text-primary" style="font-size: 3.25rem; font-weight: 700;">
                            {{ topArchetype.class }}
                        </span>
                        <div class="textbox">
                            {{ archetypeText }}
                        </div>
                    </div>
                </div>
            </div>
            <ReportRecommendations :report-id="reportId" :model-data="props.modelData" :manuscript-revision-data="manuscriptRevisionData"/>
            <ReportInfoButtons :report-id="reportId"/>
        </div>
        <div class="container chart">
            <div class="header column">
                <div class="headline text-color text-align-center">
                    Her er tendenslinjen for din arketype: <span class="text-primary">{{ topArchetype.class }}</span>
                </div>
            </div>
            <div class="column chart small">
                <ReportInteractiveChart chartType="line" :chartData="lineChartData" :chartOptions="lineChartOptions" :chartMetadata="partsMetadata" chartCssClass="h-20rem" />
            </div>
        </div>
        <tips :report-id="reportId"/>
        <articles :report-id="reportId"/>
    </div>
    <div class="report-wrapper" v-else>
        <ModelErrorMessage />
    </div>
</template>

<style scoped lang="scss">

.text-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;

    > div {
        border-radius: 16px;
        border: 1px solid #E4B200;
        background: rgba(217, 217, 217, 0.13);
        padding: 0.5rem;
        max-width: 28rem;

        font-family: var(--font-family);
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    .success-recommendation {
        border: 1px solid #20E400 !important;

        > div {
            > .recommendation-headline {
                color: #20E400;
                border-bottom: 1px solid #20E400 !important;
                font-size: 1rem;
                font-style: normal;
                line-height: normal;
                margin-bottom: 0.5rem;

                > span {
                    font-weight: 700;
                }
            }
        }
    }

    .failed-recommendation {
        border: 1px solid #FF0F00 !important;

        > div {
            > .recommendation-headline {
                color: #FF0F00;
                border-bottom: 1px solid #FF0F00 !important;
                font-size: 1rem;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                margin-bottom: 0.5rem;

                > span {
                    font-weight: 700;
                }
            }
        }
    }
}

.progress-container {
    position: relative;
}

.strong-level {
    height: 1.5rem;
    width: 75%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    border-right: 1px solid #E4B200;
    margin: 0.5rem 0 0 0.5rem;
}

.strong-level-label {
    font-size: 1rem;
    font-weight: 700;
    margin-right: 12.5%;
}

.special-bar {
    position: relative;
    z-index: 1;
    margin: 0.5rem 0.5rem 0 0.5rem;
}

.textbox {
    padding: 0.5rem;
    border-radius: 0.6rem;
    border: 1px solid #E4B200;
    background: rgba(217, 217, 217, 0.13);
    max-width: 50rem;
}

</style>
