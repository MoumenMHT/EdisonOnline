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
import Tips from '@component/report/reportTips.vue';
import Articles from '@component/report/reportArticles.vue';
import Recommendations from '@component/report/reportRecommendations.vue';
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

const data = getModelData<IAudienceClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.AudienceClassification);
const audienceData = ref<IAudienceClassificationGlobal[]>([]);
const genreModelData = getModelData<IGenreClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.GenreClassification);
const genreData = ref<IGenreClassificationGlobal[]>([]);

const topGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});

const selectedGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});

const topAudience = ref<IAudienceClassificationGlobal>({
    class: '',
    score: 0
});

const secondAudience = ref<IAudienceClassificationGlobal | undefined>(undefined);

const selectedAudience = ref<IAudienceClassificationGlobal>({
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

const getSummaryText = () => {
    // if (props.manuscriptRevisionData.audience === topAudience.value.class) {
    //     return 'Edisons analyse viser,' +
    //         ' at den målgruppe du har valgt har det ' +
    //         'største match af de tilgængelige målgrupper. ' +
    //         'Dit målgruppe match kan dog stadig være lavt for genren.';
    // }
    // else {
    //     return RecommendationService.convertVariablesToText(pillRecommendation.value.RAGText, props.manuscriptRevisionData);
    // }
    return RecommendationService.convertVariablesToText(pillRecommendation.value.RAGText, props.manuscriptRevisionData);
}

const summaryText = ref<string>(getSummaryText());

const applyData = () => {
    if (data?.content !== undefined && genreModelData?.content !== undefined) {
        audienceData.value = data.content.sort((a, b) => b.score - a.score);
        topAudience.value = audienceData.value[0];
        genreData.value = genreModelData.content.sort((a, b) => b.score - a.score);
        topGenre.value = genreData.value[0];
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

        const secondHighest = audienceData.value[1];
        if (topAudience.value.score / secondHighest.score <= 1.2 || topAudience.value.score * 100 <= 50) {
            secondAudience.value = secondHighest;
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
<!--                             class="pill-recommendation flex align-items-center justify-content-between gap-2 px-2 mt-4">-->
<!--&lt;!&ndash;                        <span class="ml-3 font-bold" style="font-size: 2.23375rem;">&ndash;&gt;-->
<!--&lt;!&ndash;                            Målgruppeoverensstemmelse:&ndash;&gt;-->
<!--&lt;!&ndash;                        </span>&ndash;&gt;-->
<!--                            <div class="flex align-items-center">-->
<!--                            <span class="mx-6 font-bold" style="font-size: 2.23375rem;">-->
<!--                                {{ pillRecommendation.RAGLevel }}-->
<!--                            </span>-->
<!--                                <circle-checkmark v-if="pillRecommendation.RAG === 'G'"-->
<!--                                                  style="fill: #19B400; width: 5.2rem;"/>-->
<!--&lt;!&ndash;                            <circle-cross v-else-if="pillRecommendation.RAG === 'R'"&ndash;&gt;-->
<!--&lt;!&ndash;                                          style="fill: #FF0F00; width: 5.2rem;"/>&ndash;&gt;-->
<!--&lt;!&ndash;                            <circle-line v-else style="fill: #E4B200; width: 5.2rem;"/>&ndash;&gt;-->
<!--                            </div>-->
<!--                        </div>-->
                        <div
                             class="pill-recommendation A flex align-items-center justify-content-between gap-2 px-2 mt-4">
                            <!--                        <span class="ml-3 font-bold" style="font-size: 2.23375rem;">-->
                            <!--                            Målgruppeoverensstemmelse:-->
                            <!--                        </span>-->
                            <div class="flex align-items-center">
                            <span class="mx-6 font-bold" style="font-size: 1.5rem;">
                                {{ summaryText }}
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="header-right">
                    <div>
                        <h1 class="flex flex-column align-items-center">
                            Din analyserede målgruppe er:
                        </h1>
                        <div class="audience-wrapper flex flex-row px-1 justify-content-between gap-5 surface-border border-1">
                        <span class="text-primary h-full ml-4 font-bold flex align-items-center">
                            {{ topAudience.class }}
                        </span>
                            <div class="flex align-items-center">
                                <MetricImage :metric="'audience'" border-color="transparent" :class="topAudience.class"
                                             size="9.25rem" :procent="topAudience.score*100"/>
                            </div>
                        </div>
                        <h3 class="flex flex-column align-items-center">
                            Du har angivet {{ props.manuscriptRevisionData.audience }} som din målgruppe.
                        </h3>
                    </div>
                    <div v-if="secondAudience" class="flex flex-column align-items-center w-full">
                        <h2 class="flex flex-column align-items-center">
                            Næsthøjeste målgruppe:
                        </h2>
                        <div class="flex flex-row gap-3 justify-content-evenly w-full">
                            <div
                                class="audience-wrapper second flex flex-row px-1 justify-content-between gap-5 surface-border border-1">
                                <span class="text-primary h-full ml-4 font-bold flex align-items-center">
                                    {{ secondAudience.class }}
                                </span>
                                <div class="flex align-items-center">
                                    <MetricImage :metric="'audience'" border-color="transparent"
                                                 :class="secondAudience.class" size="6.75rem"
                                                 :procent="secondAudience.score*100"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <recommendations :report-id="reportId" :model-data="props.modelData"
                             :manuscript-revision-data="manuscriptRevisionData"/>
            <ReportInfoButtons :report-id="reportId"/>
        </div>
        <tips :report-id="reportId"/>
        <ReportCharacteristics :report-id="reportId" :audience="topAudience.class"/>
        <articles :report-id="reportId"/>
    </div>
</template>

<style scoped lang="scss">

.audience-wrapper {
    height: 10rem;
    flex-shrink: 0;
    border-radius: 6.3rem;
    background: #5B5B5B;
    font-size: 2.5rem;
    
    @media print {
        background-color: #fff;
    }

    &.second {
        height: 7.5rem;
        font-size: 2rem;
    }
}

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

</style>
