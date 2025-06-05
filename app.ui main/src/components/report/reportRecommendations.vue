<script setup lang="ts">
import { ref, watch } from 'vue';
import checkmark from '@asset/icons/circleCheckmark.svg';
import { RecommendationService } from '@service/recommendation.service.ts';
import { getModelData, recommendationValue } from '@util/ReportHelper.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import { IArchetypeContentGlobal, IArchetypesGlobal, IAudienceClassificationGlobal, IGenreClassificationGlobal } from '@interface/Models.ts';
import { useMainStore } from '@store/main.ts';
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { AchetypeRAGLevel, IRecommendationResponse, RecommendationMetric } from '@interface/Recommendation.ts';
import EdisonGauge from '@component/edisonGauge.vue';


interface Recommendations extends IRecommendationResponse {
    id: number,
    name: string,
    numberBallValue?: string,
    gauge?: boolean,
}

export interface NumberBallRecommendation {
    metric: RecommendationMetric,
    value: string,
    gauge?: boolean,
}

const props = defineProps<{
    reportId: number,
    modelData: ModelResultData[],
    manuscriptRevisionData: ManuscriptRevision
    metrics?: RecommendationMetric[],
    numberBalls?: NumberBallRecommendation[],
    noHeader?: boolean,
}>();

const store = useMainStore();

const recommendations = ref<Recommendations[]>([]);
const genreModelData = getModelData<IGenreClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.GenreClassification);
const audienceModelData = getModelData<IAudienceClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.AudienceClassification);
const genreData = ref<IGenreClassificationGlobal[]>([]);
const audienceData = ref<IAudienceClassificationGlobal[]>([]);
const archetypeData = getModelData<IArchetypeContentGlobal>(props.modelData, ModelResultDataModelEnum.Archetypes);

const topGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});

const topAudience = ref<IAudienceClassificationGlobal>({
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

const topArchetype = ref<IArchetypesGlobal>({
    class: '',
    score: 0,
    pattern: [],
});

const allRecDone = ref(false);
let metrics;

if (props.metrics) {
    metrics = props.metrics;
} else if (props.numberBalls) {
    metrics = props.numberBalls.map((x) => x.metric);
} else {
    metrics = store.getMetricForReport(props.reportId);
}

const applyData = () => {
    if (genreModelData?.content !== undefined) {
        genreData.value = genreModelData.content.sort((a, b) => b.score - a.score);
        topGenre.value = genreData.value[0];
        switch (store.AnalyzedOrGivenData) {
            case 'Analyseret':
                selectedGenre.value = topGenre.value;
                break;
            case 'Angivet':
                selectedGenre.value = genreData.value.find(
                        genre => genre.class === props.manuscriptRevisionData.genre
                    )
                    || topGenre.value;
                break;
        }
    }
    if (audienceModelData?.content !== undefined) {
        audienceData.value = audienceModelData.content.sort((a, b) => b.score - a.score);
        topAudience.value = audienceData.value[0];
        switch (store.AnalyzedOrGivenData) {
            case 'Analyseret':
                selectedAudience.value = topAudience.value;
                break;
            case 'Angivet':
                selectedAudience.value = audienceData.value.find(
                        audience => audience.class === props.manuscriptRevisionData.audience
                    )
                    || topAudience.value;
                break;
        }
    }
    if (archetypeData?.content !== undefined) {
        topArchetype.value = {
            class: archetypeData.content.best_archetype_name,
            score: archetypeData.content.best_archetype_score,
            pattern: [],
        };
    }
}

const loadRecommendations = () => {
    applyData();
    let genre = selectedGenre.value.class;
    let audience = selectedAudience.value.class;
    for (const metric of metrics) {
        if (props.modelData) {
            RecommendationService.getRecommendation(
                metric.id,
                store.getGenreId(genre),
                store.getAudienceId(audience),
                recommendationValue(metric, props.modelData, props.manuscriptRevisionData)
            ).then(request => {
                const data = request.data.value;
                if (data !== undefined && data !== null) {
                    const ball = props.numberBalls?.find((x) => x.metric.id === metric.id)
                    const value = ball?.value || undefined;
                    const gauge = ball?.gauge || false;
                    const item: Recommendations = {
                        ...metric,
                        ...data,
                        numberBallValue: value,
                        gauge: gauge,
                    };
                    
                    const index = recommendations.value.findIndex((x) => x.id === item.id);

                    if (~index) {
                        recommendations.value[index] = item;
                    } else {
                        recommendations.value.push(item);
                    }
                }
            });
        }
    }
}
try {
    watch(recommendations, (value) => {
        if (value.length === metrics.length) {
            let allDone = true;
            value.forEach((recommendation) => {
                if (recommendation.RAG !== 'G') {
                    allDone = false;
                }
            });
            allRecDone.value = allDone;
        }
    });

    loadRecommendations();
    watch(
        () => store.AnalyzedOrGivenData,
        () => loadRecommendations(),
        { immediate: true }
    );
} catch (e) {
    console.error('Unhandled error:', e);
}

const getMessage = (recommendation: Recommendations): string => {
    if (recommendation.id == 6) {
        return store.getArchetypeTextByClass(topArchetype.value.class, recommendation.RAGLevel as AchetypeRAGLevel).text;
    }
    return recommendation.message;
}

const getFill = (RAG: string): string => {
    switch (RAG) {
        case 'R':
            return '#EF4444';
        case 'A':
            return '#E4B200';
        case 'G':
            return '#22C55E';
        default:
            return '#E4B200';
    }
}

const formatNumberBallValue = (value: string): string => {
    if (parseFloat(value)) {
        if (parseFloat(value) < 1) {
            // If the value is less than 1, we want to show it as a percentage
            return `${(parseFloat(value) * 100).toFixed(2)}%`;
        }
        // If the two last digits are 0, we want to remove them
        let returnValue = parseFloat(value).toFixed(2);
        while (returnValue.endsWith('0')) {
            returnValue = returnValue.slice(0, -1);
        }
        // If the last digit is a dot, we want to remove it
        if (returnValue.endsWith('.')) {
            returnValue = returnValue.slice(0, -1);
        }
        return returnValue;
    }
    return value;
}

const getNumberBallFontSize = (value: string): string => {
    if (recommendations.value.length < 3) {
        if (parseFloat(value)) {
            if (parseFloat(value) < 1) {
                return 'text-6xl';
            }
        }
        if (value.length < 5) {
            return 'text-5xl';
        }
        if (value.length < 10) {
            return 'text-4xl';
        }
    }
    if (recommendations.value.length < 4) {
        if (parseFloat(value)) {
            if (parseFloat(value) < 1) {
                return 'text-5xl';
            }
        }
        if (value.length < 5) {
            return 'text-4xl';
        }
        if (value.length < 10) {
            return 'text-3xl';
        }
    }
    if (recommendations.value.length < 5) {
        if (parseFloat(value)) {
            if (parseFloat(value) < 1) {
                return 'text-4xl';
            }
        }
        if (value.length < 5) {
            return 'text-3xl';
        }
        if (value.length < 10) {
            return 'text-2xl';
        }
    }
    if (recommendations.value.length < 6) {
        if (parseFloat(value)) {
            if (parseFloat(value) < 1) {
                return 'text-3xl';
            }
        }
        if (value.length < 5) {
            return 'text-2xl';
        }
        if (value.length < 10) {
            return 'text-xl';
        }
    }
    return 'text-lg';
}

const getNumberBallSize = () => {
    if (recommendations.value.length < 3) {
        return 'ball-size-lg';
    }
    if (recommendations.value.length < 4) {
        return 'ball-size-md';
    }
    if (recommendations.value.length < 5) {
        return 'ball-size-sm';
    }
    if (recommendations.value.length < 6) {
        return 'ball-size-xs';
    }
}

const getBallWrapperSize = () => {
    if (recommendations.value.length < 3) {
        return 'wrapper-size-lg';
    }
    if (recommendations.value.length < 4) {
        return 'wrapper-size-md';
    }
    if (recommendations.value.length < 5) {
        return 'wrapper-size-sm';
    }
    if (recommendations.value.length < 6) {
        return 'wrapper-size-xs';
    }
}

const getColumnClass = () => {
    if (recommendations.value.length === 1) {
        return 'col-12';
    }
    if (recommendations.value.length === 2) {
        return 'col-6';
    }
    if (recommendations.value.length === 3) {
        return 'col-4';
    }
    if (recommendations.value.length === 4) {
        return 'col-3';
    }
    return 'col-2';
}

</script>

<template>
    <div class="recommendations-wrapper" v-if="recommendations.length > 0">
        <h1 v-if="!props.noHeader" class="recommendations-headline">
            Anbefalinger
        </h1>
        <div :class="{
                'grid': props.numberBalls,
                'max-width': recommendations.length === 1,
                'recommendations-container': !props.numberBalls
            }">
            <div v-if="props.metrics && !props.numberBalls" v-for="(recommendation) in recommendations" class="text-wrapper h-full">
                <div v-bind:class="recommendation.RAG" class="recommendation flex flex-column justify-content-between">
                    <div>
                        <div class="recommendation-headline flex justify-content-between gap-3 w-full">
                            <span>
                                {{ recommendation.name }}
                            </span>
                            {{ recommendation.RAGLevel }}
                        </div>
                        {{
                            RecommendationService.convertVariablesToText(getMessage(recommendation), manuscriptRevisionData)
                        }}
                    </div>
                    <div v-if="recommendation.RAG === 'G'" class="flex justify-content-end noPrint">
                        <checkmark style="fill: #19B400; width: 3.3rem;"/>
                    </div>
                </div>
            </div>
            <div v-else-if="!props.metrics && !props.numberBalls" v-for="(recommendation) in recommendations" class="text-wrapper">
                <div v-bind:class="recommendation.RAG" class="recommendation flex flex-column justify-content-between">
                    <div>
                        <div class="recommendation-headline flex justify-content-between gap-3 w-full">
                            <span>
                                {{ recommendation.name }}
                            </span>
                            {{ recommendation.RAGLevel }}
                        </div>
                        {{
                            RecommendationService.convertVariablesToText(getMessage(recommendation), manuscriptRevisionData)
                        }}
                    </div>
                    <div v-if="recommendation.RAG === 'G'" class="flex justify-content-end noPrint">
                        <checkmark style="fill: #19B400; width: 3.3rem;"/>
                    </div>
                </div>
            </div>
            <div v-else-if="props.numberBalls" v-for="(recommendation) in recommendations" class="text-wrapper mx-auto px-0" :class="getColumnClass()">
                <div :class="recommendation.RAG" v-if="recommendation.gauge" class="recommendation flex flex-column justify-content-between">
                    <div>
                        <div class="recommendation-headline flex justify-content-between gap-3 w-full">
                            <span>
                                {{ recommendation.name }}
                            </span>
                            {{ recommendation.RAGLevel }}
                        </div>
                        <div class="flex flex-column align-items-center gap-3">
                            <EdisonGauge class="max-w-30rem" :value="parseFloat(recommendation.numberBallValue!)" :progress-fill="getFill(recommendation.RAG)" />
                            {{
                                RecommendationService.convertVariablesToText(getMessage(recommendation), manuscriptRevisionData)
                            }}
                        </div>
                    </div>
                    <div v-if="recommendation.RAG === 'G'" class="flex justify-content-end noPrint mt-3">
                        <checkmark style="fill: #19B400; width: 3.3rem;"/>
                    </div>
                </div>
                <div v-else :class="recommendation.RAG" class="recommendation flex flex-column justify-content-between">
                    <div>
                        <div class="recommendation-headline flex justify-content-between gap-3 w-full">
                            <span>
                                {{ recommendation.name }}
                            </span>
                        </div>
                        <div class="flex flex-column gap-3">
                            <div class="ball-container flex align-items-center">
                                <div class="flex flex-column gap-2">
                                    <div class="flex align-items-center">
                                        <div :class="getNumberBallSize()" class="ball-circle">
                                            <div class="flex flex-column align-items-center justify-content-center h-full">
                                                <span
                                                    :class="getNumberBallFontSize(
                                                        formatNumberBallValue(recommendation.numberBallValue!)
                                                        )"
                                                    class="font-bold"
                                                >
                                                    {{ formatNumberBallValue(recommendation.numberBallValue!) }}
                                                </span>
                                            </div>
                                        </div>
                                        <div :class="getBallWrapperSize()" class="ball-wrapper">
                                            {{ recommendation?.RAGLevel }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {{
                                RecommendationService.convertVariablesToText(getMessage(recommendation), manuscriptRevisionData)
                            }}
                        </div>
                    </div>
                    <div v-if="recommendation.RAG === 'G'" class="flex justify-content-end noPrint">
                        <checkmark style="fill: #19B400; width: 3.3rem;"/>
                    </div>
                </div>
            </div>
        </div>
        <h1 v-if="allRecDone" class="flex justify-content-center" style="color: #19B400;">
            Godt gået! Du har fuldført alle anbefalinger!
        </h1>
    </div>
</template>

<style scoped lang="scss">
.recommendations-wrapper {
    padding: 2rem 0;
    display: flex;
    flex-direction: column;

    > .recommendations-headline {
        display: flex;
        margin-top: 0;
        justify-content: center;
    }
    > .recommendations-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        justify-content: center;

        &.max-width {
            grid-template-columns: repeat(1, 1fr);

            @media print {
                grid-template-columns: inherit !important;
            }
        }
    }
}

.text-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;

    > div {
        min-width: 12rem;
        min-height: 10rem;
        border-radius: 16px;
        border: 1px solid #E4B200;
        background: rgba(217, 217, 217, 0.13);
        padding: 0.5rem;
        width: 100%;

        font-family: var(--font-family);
        font-size: 1rem;
    }

    .recommendation {
        border: 1px solid;

        &.R, &.A, &.G {
            > div {
                > .recommendation-headline {
                    > span {
                        color: #fff;

                        @media print {
                            color: #000;
                        }
                    }
                }
            }
        }

        &.G {
            > div {
                > .recommendation-headline {
                    color: #29c76f;
                    border-color: #29c76f;
                }
            }

            border-color: #29C76F;
        }

        &.R {
            > div {
                > .recommendation-headline {
                    color: #EA5455;
                    border-color: #EA5455;
                }
            }

            border-color: #EA5455 !important;
        }

        &.A {
            > div {
                > .recommendation-headline {
                    color: #E4B200;
                    border-color: #E4B200;
                }
            }

            border-color: #E4B200 !important;
        }

        > div {
            > .recommendation-headline {
                border-bottom: 1px solid;
                font-size: 1.25rem;
                margin-bottom: 0.5rem;

                > span {
                    font-weight: 700;
                }
            }
        }
    }
}

.ball-container {
    position: relative;
}

.ball-circle {
    border-radius: 50%;
    background: #E4B200;
    z-index: 1;

    &.ball-size-lg {
        width: 11.8rem;
        height: 11.8rem;
    }

    &.ball-size-md {
        width: 9.8rem;
        height: 9.8rem;
    }

    &.ball-size-sm {
        width: 7.8rem;
        height: 7.8rem;
    }

    &.ball-size-xs {
        width: 6rem;
        height: 6rem;
    }
}

.ball-wrapper {
    position: absolute;
    overflow: visible;
    flex-shrink: 1;
    border-radius: 1rem;
    background: #3f3f3f;
    z-index: 0;
    border: 1px solid #E4B200;
    line-height: 150%;

    @media print {
        background-color: #fff;
    }

    &.wrapper-size-lg {
        width: 20rem;
        margin-left: 5.9rem;
        padding: 1rem 1rem 1rem 6.9rem;
        font-size: 1.25rem;
    }

    &.wrapper-size-md {
        width: 15rem;
        margin-left: 5.4rem;
        padding: 1rem 1rem 1rem 5.9rem;
        font-size: 1rem;
    }

    &.wrapper-size-sm {
        width: 13.5rem;
        margin-left: 4.4rem;
        padding: 1rem 1rem 1rem 4.9rem;
        font-size: 0.85rem;
    }

    &.wrapper-size-xs {
        width: 11rem;
        margin-left: 2.65rem;
        padding: 1rem 1rem 1rem 3.85rem;
        font-size: 0.85rem;
    }
}
</style>