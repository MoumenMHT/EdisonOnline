<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
// import circleCheckmark from '@asset/icons/circleCheckmark.svg';
// import circleCross from '@asset/icons/circleCross.svg';
// import circleLine from '@asset/icons/circleLine.svg';
import { ref, watch } from 'vue';
import { IAudienceClassificationGlobal, IGenreClassificationGlobal } from '@interface/Models.ts';
import { getModelData, recommendationValue } from '@util/ReportHelper.ts';
import MetricImage from '@component/metricImage.vue';
import Recommendations from '@component/report/reportRecommendations.vue';
import Tips from '@component/report/reportTips.vue';
import Articles from '@component/report/reportArticles.vue';
import ReportCharacteristics from '@component/report/reportCharacteristics.vue';
import { useMainStore } from '@store/main.ts';
import { RecommendationService } from '@service/recommendation.service.ts';
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from '@component/report/reportWhatIs.vue';
import { IRecommendationResponse } from '@interface/Recommendation.ts';

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
    reportId: number,
}>();

// const conformityRequest = RecommendationService.getRecommendation()
// const conformity = ref<{ color: string, text: string }>({
//     color: '',
//     text: ''
// })

const data = getModelData<IGenreClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.GenreClassification);
const genreData = ref<IGenreClassificationGlobal[]>([]);
const audienceModelData = getModelData<IAudienceClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.AudienceClassification);
const audienceData = ref<IAudienceClassificationGlobal[]>([]);

const topGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});

const secondGenre = ref<IGenreClassificationGlobal | undefined>(undefined);

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
    if (data?.content !== undefined && audienceModelData?.content !== undefined) {
        genreData.value = data.content.sort((a, b) => b.score - a.score);
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

        const secondHighest = genreData.value[1];
        if (secondHighest.score >= 0.25 || topGenre.value.score * 100 <= 50) {
            secondGenre.value = secondHighest;
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
}

try {
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
    <div class="report-wrapper">
        <div class="container" style="line-height: 1.5;">
            <div class="header">
                <div class="header-left">
                    <ReportWhatIs :report-id="reportId"/>
                    <div class="flex justify-content-center mt-4">
<!--                        <div v-bind:class="pillRecommendation.RAG"-->
<!--                             class="pill-recommendation flex align-items-center justify-content-between gap-2 px-2">-->
<!--&lt;!&ndash;                            <span class="ml-3 font-bold" style="font-size: 2.23375rem;">&ndash;&gt;-->
<!--&lt;!&ndash;                                Genreoverensstemmelse:&ndash;&gt;-->
<!--&lt;!&ndash;                            </span>&ndash;&gt;-->
<!--                            <div class="flex align-items-center">-->
<!--                                <span class="mx-6 font-bold" style="font-size: 2.23375rem;">-->
<!--                                    {{ pillRecommendation.RAGLevel }}-->
<!--                                </span>-->
<!--                                <circle-checkmark v-if="pillRecommendation.RAG === 'G'"-->
<!--                                                  style="fill: #19B400; width: 5.2rem;"/>-->
<!--&lt;!&ndash;                                <circle-cross v-else-if="pillRecommendation.RAG === 'R'"&ndash;&gt;-->
<!--&lt;!&ndash;                                              style="fill: #FF0F00; width: 5.2rem;"/>&ndash;&gt;-->
<!--&lt;!&ndash;                                <circle-line v-else style="fill: #E4B200; width: 5.2rem;"/>&ndash;&gt;-->
<!--                            </div>-->
<!--                        </div>-->
                        <div
                            class="pill-recommendation A flex align-items-center justify-content-between gap-2 px-2 mt-4">
                            <!--                        <span class="ml-3 font-bold" style="font-size: 2.23375rem;">-->
                            <!--                            Målgruppeoverensstemmelse:-->
                            <!--                        </span>-->
                            <div class="flex align-items-center">
                            <span class="mx-6 font-bold" style="font-size: 1.5rem;">
                                {{ getSummaryText() }}
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="header-right">
                    <div v-bind:class="!secondGenre ? 'mb-6' : 'mb-2'"
                         class="primary-genre flex flex-column align-items-center w-full">
                        <h1 class="flex flex-column align-items-center">
                            Din genre er mest konsistent med:
                        </h1>
                        <div class="flex flex-row gap-3 justify-content-evenly w-full">
                            <!--                            <edison-gauge :value="topGenre.score" style="width:20rem"/>-->
                            <div
                                class="genre-wrapper flex flex-row px-1 justify-content-between gap-5 surface-border border-1">
                            <span class="text-primary h-full ml-4 font-bold flex align-items-center">
                                {{ topGenre.class }}
                            </span>
                                <div class="flex align-items-center">
                                    <MetricImage :metric="'genre'" border-color="transparent" :class="topGenre.class"
                                                 size="9.25rem" :procent="topGenre.score*100"/>
                                </div>
                            </div>
                        </div>
                        <h3 class="flex flex-column align-items-center">
                            Du har angivet {{ props.manuscriptRevisionData.genre }} som din genre.
                        </h3>
                    </div>
                    <div v-if="secondGenre" class="secondary-genre">
                        <h1 class="flex flex-column align-items-center">
                            Din genre har også en vis konsistens til:
                        </h1>
                        <div class="flex flex-row gap-3 justify-content-evenly w-full">
                            <div
                                class="genre-wrapper flex flex-row px-1 justify-content-between gap-5 surface-border border-1">
                        <span class="text-primary h-full ml-4 font-bold flex align-items-center">
                            {{ secondGenre.class }}
                        </span>
                                <div class="flex align-items-center">
                                    <MetricImage :metric="'genre'" border-color="transparent" :class="secondGenre.class"
                                                 size="6.75rem" :procent="secondGenre.score*100" />
                                </div>
                            </div>
                            <!--                            <edison-gauge :value="secondGenre.score" style="width:15rem"/>-->
                        </div>
                    </div>
                </div>
            </div>
            <recommendations :report-id="reportId" :model-data="props.modelData" :manuscript-revision-data="manuscriptRevisionData"/>
            <ReportInfoButtons :report-id="reportId"/>
        </div>
        <tips :report-id="reportId"/>
        <ReportCharacteristics :report-id="reportId" :genre="topGenre.class"/>
        <articles :report-id="reportId"/>
    </div>
</template>

<style scoped lang="scss">

.primary-genre {
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .genre-wrapper {
        height: 10rem;
        flex-shrink: 0;
        border-radius: 6.3rem;
        background: #5B5B5B;
        font-size: 2.5rem;
        
        @media print {
            background-color: #fff;
        }
    }
}

.secondary-genre {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .genre-wrapper {
        height: 7.5rem;
        flex-shrink: 0;
        border-radius: 6.3rem;
        background: #5B5B5B;
        font-size: 2rem;
        
        @media print {
            background: #fff;
        }
    }
}

</style>