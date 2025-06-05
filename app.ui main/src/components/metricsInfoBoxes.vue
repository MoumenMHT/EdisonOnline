<script setup lang="ts">
import circleCheckmark from '@asset/icons/circleCheckmark.svg';
// import circleCross from '@asset/icons/circleCross.svg';
// import circleLine from '@asset/icons/circleLine.svg';
import EdisonGauge from '@component/edisonGauge.vue';
import { ref, watch } from 'vue';
import { getModelData, recommendationValue } from '@util/ReportHelper.ts';
import { RecommendationService } from '@service/recommendation.service.ts';
import { useMainStore } from '@store/main.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import { IAudienceClassificationGlobal, IGenreClassificationGlobal } from '@interface/Models.ts';
import { ManuscriptRevision } from '@interface/Manuscript.ts';

interface InformationBoxes {
    metricId: number,
    headline: string,
    description: string,
    value: number,
    RAG: string,
    RAGText: string,
    low: number,
    high: number,
}

const props = defineProps<{
    metrics: number[];
    modelData: ModelResultData[];
    manuscriptRevisionData: ManuscriptRevision;
}>();

const store = useMainStore();
const valid = ref(true);
const genreModelData = getModelData<IGenreClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.GenreClassification);
const audienceModelData = getModelData<IAudienceClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.AudienceClassification);
const informationBoxes = ref<InformationBoxes[]>([]);
const topGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});
const topAudience = ref<IAudienceClassificationGlobal>({
    class: '',
    score: 0
});
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

const loadRecommendations = () => {
    let genre = topGenre.value.class;
    let audience = topAudience.value.class;
    if (store.AnalyzedOrGivenData === 'Angivet') {
        genre = props.manuscriptRevisionData.genre;
        audience = props.manuscriptRevisionData.audience;
    }
    
    for (const metricId of props.metrics) {
        const metric = store.getMetric(metricId);
        const recommendationVal = recommendationValue(metric, props.modelData, props.manuscriptRevisionData);

        RecommendationService.getRecommendation(
            metric.id,
            store.getGenreId(genre),
            store.getAudienceId(audience),
            recommendationVal
        ).then((request) => {
            const data = request.data.value;
            if (data !== undefined && data !== null) {
                const index = informationBoxes.value.findIndex((x) => x.metricId === metric.id);

                if (~index) {
                    informationBoxes.value[index] = {
                        metricId: metric.id,
                        description: data.message,
                        value: recommendationVal!,
                        headline: metric.name,
                        high: data.rangeHigh,
                        low: data.rangeLow,
                        RAG: data.RAG,
                        RAGText: data.RAGText,
                    };
                } else {
                    informationBoxes.value.push({
                        metricId: metric.id,
                        description: data.message,
                        value: recommendationVal!,
                        headline: metric.name,
                        high: data.rangeHigh,
                        low: data.rangeLow,
                        RAG: data.RAG,
                        RAGText: data.RAGText,
                    });
                }
            }
        })
    }
};

try {
    if (genreModelData?.content !== undefined) {
        topGenre.value = genreModelData.content.sort((a, b) => b.score - a.score)[0];
    }
    if (audienceModelData?.content !== undefined) {
        topAudience.value = audienceModelData.content.sort((a, b) => b.score - a.score)[0];
    }

    loadRecommendations();

    watch(
        () => store.AnalyzedOrGivenData,
        () => loadRecommendations(),
    );
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="infobox-wrapper">
        <div class="infoboxes" v-for="item of informationBoxes" v-if="valid">
            <div class="top">
                <div class="headline">{{ item.headline }}</div>
                <EdisonGauge :value="item.value" :progress-fill="getFill(item.RAG)" />
            </div>
            <div :class="`bottom RAG text border ${item.RAG}`">
                <div class="description">
                    {{ RecommendationService.convertVariablesToText(item.description, manuscriptRevisionData) }}
                </div>
                <div class="details">
<!--                    <div class="niveau">-->
<!--                        Passende niveau: {{ item.low }}-{{ item.high }}%-->
<!--                    </div>-->
                    <div class="rag">
                        <div class="text">
                            {{ item.RAGText }}
                        </div>
                        <circleCheckmark v-if="item.RAG === 'G'" class="icon noPrint" fill="#22C55E" />
<!--                        <circleCross v-if="item.RAG === 'R'" class="icon" />-->
<!--                        <circleLine v-if="item.RAG === 'A'" class="icon" />-->
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            Fejlede i at hente eller lave infomations kasser.
        </div>
    </div>
</template>

<style scoped lang="scss">
@media print {
    .infobox-wrapper {
        

        > .infoboxes {
            width: 45% !important;
            //margin-top: 1rem !important;
            margin-bottom: 2rem !important;

            > .top {
                margin: auto;

                > .headline {
                    color: #000 !important;
                }
            }

            > .bottom {
                > .description {
                    color: #000 !important;
                }
            }

            svg {
                width: 13rem;
            }
        }
    }
}

.infobox-wrapper {
    display: flex;
    flex-direction: row;
    align-content: stretch;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    margin: 1.5rem 0;
    
    > .infoboxes {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 13.1875rem;
        margin: 0 1rem;

        > .top {
            &:not(.no-border) {
                border-bottom: 1px solid var(--primary-color);
            }

            > .headline {
                text-align: center;
                color: #FFF;
                font-family: var(--font-family);
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }

            > .button-style {
                border-radius: 1rem;
                background: var(--primary-color);
                text-align: center;
                padding: 0.5rem;
                color: #2C2C2C;
                font-size: 1.25rem;
                font-weight: 700;
            }
        }

        > .bottom {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin-top: 1rem;

            &:not(.no-box) {
                //border: 1px solid var(--primary-color);
                border-style: solid;
                border-width: 1px;
                border-radius: 1rem;
                background-color: #D9D9D921;
                padding: 1rem;
                @media print {
                    background-color: #fff;
                }
            }

            > .description {
                flex: 1 1 auto;
                margin-bottom: 1rem;
                color: #FFF;
                font-family: var(--font-family);
                font-size: 1rem;
            }

            > .details {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                gap: 1rem;

                > .niveau {
                    text-align: center;
                    font-family: var(--font-family);
                    font-size: 1rem;
                }

                > .rag {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background-color: #5B5B5B;
                    padding: 0.5rem;
                    border-radius: 2rem;
                    
                    @media print {
                        background-color: #fff;
                    }

                    > .text {
                        flex: 1 1 auto;
                        font-family: var(--font-family);
                        font-size: 1.25rem;
                    }

                    > .icon {
                        width: 2rem;
                    }
                }
            }

            > .list-item {
                font-size: 1.25rem;
                font-weight: 700;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                border-bottom: 1px solid var(--primary-color);
                line-height: 2rem;
            }
        }

        svg {
            width: 13rem;
        }
    }
}
</style>