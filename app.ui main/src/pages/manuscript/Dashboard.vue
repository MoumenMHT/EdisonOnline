<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import info from '@asset/icons/circleInfo.svg';
import { computed, ref } from 'vue';
import { IArchetypeContentGlobal, IAudienceClassificationGlobal, IGenreClassificationGlobal, IGlobalAnalyzedContent } from '@interface/Models.ts';
import { getModelData } from '@util/ReportHelper.ts';
import { useMainStore } from '@store/main.ts';
import { translateGlobalScoreLabels } from '@util/translate.ts';
import GlobalScoreBall from '@component/numberBall.vue';
import MetricImage from '@component/metricImage.vue';
import ArchetypeGraph from '@component/archetypeGraph.vue';
import Dialog from "primevue/dialog";
import { RecommendationService } from "@service/recommendation.service.ts";

interface NameValuePair {
    name: string,
    value: number;
}

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean, // if true always use globalAnalysed
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>();
const store = useMainStore();

const genreProcent = ref(0);
const audienceProcent = ref(0);
const archetypeProcent = ref(0);
const globalDialogVisible = ref(false);
const dashboardData = store.dashboard;
const dialogData = computed(() => dashboardData?.find(x => x.element === 'GlobalScore'));

const genreModel = getModelData<IGenreClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.GenreClassification);
const genreData = ref<IGenreClassificationGlobal[]>([]);
const topGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});
if (genreModel?.content !== undefined) {
    genreData.value = genreModel.content.sort((a,b) => b.score - a.score);
    topGenre.value = genreData.value[0];
    genreProcent.value = Math.round(topGenre.value.score * 100);
}

const audienceModel = getModelData<IAudienceClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.AudienceClassification);
const audienceData = ref<IAudienceClassificationGlobal[]>([]);
const topAudience = ref<IAudienceClassificationGlobal>({
    class: '',
    score: 0
});
if (audienceModel?.content !== undefined) {
    audienceData.value = audienceModel.content.sort((a,b) => b.score - a.score);
    topAudience.value = audienceData.value[0];
    audienceProcent.value = Math.floor(topAudience.value.score * 100);
}

const archetypeModel = getModelData<IArchetypeContentGlobal>(props.modelData, ModelResultDataModelEnum.Archetypes);
const archetypeData = ref<IArchetypeContentGlobal>();
const topArchetype = ref<IAudienceClassificationGlobal>({
    class: '',
    score: 0
});

if (archetypeModel?.content.global !== undefined) {
    archetypeData.value = archetypeModel.content;
    topArchetype.value.class = archetypeModel.content.best_archetype_name;
    topArchetype.value.score = archetypeModel.content.best_archetype_score;

    archetypeProcent.value = Math.floor(topArchetype.value.score * 100);
}

const globalAnalyzedModel = getModelData<IGlobalAnalyzedContent>(props.modelData, ModelResultDataModelEnum.GlobalAnalyzed);
const topDiviation = ref<NameValuePair[]>([]);

if (globalAnalyzedModel?.content !== undefined) {
    const tempDataArray: NameValuePair[] = [];

    for (const key in globalAnalyzedModel.content) {
        if (key === 'score') {
            continue;
        }

        tempDataArray.push({
            name: translateGlobalScoreLabels(key),
            value: globalAnalyzedModel.content[key],
        });
    }
    tempDataArray.sort((a,b) => a.value - b.value);

    let n = 0;
    while (n < 3) {
        const item = tempDataArray[n];
        if (item.value != 0) {
            topDiviation.value.push(item);
        }
        n++;
    }
}

const globalScore = computed(() => globalAnalyzedModel?.content.score ?? 0);

</script>

<template>
    <div class="dashboard-wrapper">
        <div class="dgs-wrapper">
            <div class="data-wrapper">
                <div class="data-table">
                    <div class="data-table-body">
                        <div class="data-table-row">
                            <div class="data-table-cell">Titel</div>
                            <div class="data-table-cell">{{ manuscriptRevisionData.title }}</div>
                        </div>
                        <div class="data-table-row">
                            <div class="data-table-cell">   </div>
                            <div class="data-table-cell">{{ manuscriptRevisionData.audience }}</div>
                        </div>
                        <div class="data-table-row">
                            <div class="data-table-cell">Genre</div>
                            <div class="data-table-cell">{{ manuscriptRevisionData.genre }}</div>
                        </div>
                        <div class="data-table-row">
                            <div class="data-table-cell">Oprettet</div>
                            <div class="data-table-cell">{{
                                    new Date(manuscriptRevisionData.created).toLocaleDateString('da-DK', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })
                                }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="globalscore-wrapper">
                <div class="globalscore-headline cursor-pointer" @click="globalDialogVisible = true">
                    <span>Global Score</span>
                    <info/>
                </div>
                <div class="globalscore-content">
                    <div class="globalscore-diviations">
                        <div>Vigtigste afvigelser</div>
                        <div class="globalscore-diviation-item" v-for="diviation in topDiviation">
                            <div>{{ diviation.name }}</div>
                            <div>{{ diviation.value }}</div>
                        </div>
                    </div>
                    <div class="globalscore-scorecontent">
                        <GlobalScoreBall :value="globalScore" size="8.5rem" font-color="#000" />
                    </div>
                </div>
            </div>
        </div>
        <div class="genre-content">
            <div class="content-title">{{ dashboardData[0].element }}</div>
            <div class="content-wrapper">
                <MetricImage :metric="'genre'" :class="topGenre.class" :procent="genreProcent" />
                <div class="info-wrapper">
                    <div>
                        <span>{{ topGenre.class }}</span>
                    </div>
                    <div>
                        <span>{{ genreProcent }}%</span>
                    </div>
                </div>
                <div class="text-wrapper">
                    <div>
                        {{ RecommendationService.convertVariablesToText(dashboardData[0].text, props.manuscriptRevisionData, props.modelData) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="audience-content">
            <div class="content-title">{{ dashboardData[1].element }}</div>
            <div class="content-wrapper">
                <div class="text-wrapper">
                    <div>
                        {{ RecommendationService.convertVariablesToText(dashboardData[1].text, props.manuscriptRevisionData, props.modelData) }}
                    </div>
                </div>
                <div class="info-wrapper right-align">
                    <div>
                        <span>{{ topAudience.class }}</span>
                    </div>
                    <div>
                        <span>{{ audienceProcent }}%</span>
                    </div>
                </div>
                <MetricImage :metric="'audience'" :class="topAudience.class" :procent="audienceProcent" />
            </div>
        </div>
        <div class="archetype-content">
            <div class="content-title">{{ dashboardData[2].element }}</div>
            <div class="content-wrapper">
                <div>
                    <ArchetypeGraph :archetype="topArchetype.class" width="20rem" height="10rem" :show-right-line="true" />
                </div>
                <div class="info-wrapper">
                    <div>
                        <span>{{ topArchetype.class }}</span>
                    </div>
<!--                    <div>-->
<!--                        <span>{{ archetypeProcent }}%</span>-->
<!--                    </div>-->
                </div>
                <div class="text-wrapper">
                    <div>
                        {{ RecommendationService.convertVariablesToText(dashboardData[2].text, props.manuscriptRevisionData, props.modelData) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="globalDialogVisible" modal :header="dialogData?.element" :style="{ width: '50vw' }">
        <p>
            {{ dialogData?.text }}
        </p>
    </Dialog>
</template>

<style scoped lang="scss">
.dashboard-wrapper {
    display: flex;
    flex-direction: column;
    // 1200px is the min size before this layout breaks.
    min-width: calc(1200px);
    max-width: calc(2000px);
    margin: auto;

    > div {
        padding: 0 5rem;
        
        &:not(:last-child) {
            border-bottom: 1px solid #5B5B5B;
        }
    }

    .dgs-wrapper {
        display: flex;
        flex-direction: row;

        .data-wrapper {
            flex: 1 1 auto;
            max-width: 40%;

            > .data-table {
                display: table;
                table-layout: fixed;
                width: calc(100% - 21px - 21px); // 21px for left and right side
                margin: 21px;
                border-radius: 16px;
                border: 1px solid #E4B200;
                background: rgba(217, 217, 217, 0.13);
                overflow: hidden;

                > .data-table-body {
                    display: table-row-group;

                    > .data-table-row {
                        display: table-row;

                        &:not(:last-child) {
                            > .data-table-cell {
                                border-bottom: 1px solid rgba(255, 255, 255, 0.29);
                            }
                        }

                        > .data-table-cell {
                            display: table-cell;
                            padding: 0.5rem 1rem;

                            &:first-child {
                                border-right: 1px solid rgba(255, 255, 255, 0.29);
                                width: 7rem;
                            }
                        }
                    }
                }
            }
        }

        .globalscore-wrapper {
            display: flex;
            flex-direction: column;
            margin-left: auto;

            .globalscore-headline {
                display: flex;
                gap: 0.5rem;
                align-items: center;

                > span {
                    margin-left: auto;

                    text-align: center;
                    font-family: Inter, serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                > svg {
                    margin-right: 2rem;
                    height: 17px;
                    fill: #fff;

                    > :deep(path) {
                        fill: #000000;
                    }
                }
            }

            .globalscore-content {
                display: flex;
                flex-direction: row;

                .globalscore-diviations {
                    padding: 1rem 2rem;
                    color: #FFF;
                    font-family: var(--font-family);

                    @media (max-width: 1200px) {
                        min-width: 10rem;
                    }
                    @media (min-width: 1225px) {
                        min-width: 20rem;
                    }

                    > div {
                        padding: 0.25rem 0;
                        
                        &:first-child {
                            padding-bottom: 0.5rem;
                        }
                    }
                    
                    .globalscore-diviation-item {
                        display: flex;
                        flex-direction: row;
                        gap: 0.5rem;
                        border-bottom: 1px solid #E4B200;
                        margin-bottom: 0.5rem;

                        > div:first-of-type {
                            flex: 1 1 auto;
                            padding-right: 1rem;
                        }
                    }
                }

                .globalscore-scorecontent {
                    padding: 1rem 3.2rem;
                }
            }
        }
    }

    .genre-content,
    .audience-content,
    .archetype-content {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: stretch;

        .content-title {
            color: #FFF;
            font-family: Inter, serif;
            font-size: 1.5rem;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            padding: 1.5rem;
        }

        .content-wrapper {
            flex: 1 1 auto;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: stretch;
            padding: 2rem;

            .info-wrapper {
                flex: 1 1 auto;
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-items: stretch;

                &.right-align > div {
                    justify-content: flex-end;
                }

                > div {
                    flex: 1 1 auto;
                    padding: 0.5rem;
                    display: flex;
                    flex-wrap: wrap;
                    max-height: 50%;

                    &:first-child {
                        align-content: end;
                        border-bottom: 1px solid #E4B200;

                        color: #FFF;
                        font-family: Inter, serif;
                        font-size: 1.5rem;
                        font-style: normal;
                        font-weight: 700;
                        line-height: normal;
                    }

                    &:last-child {
                        color: #E4B200;
                        font-family: Inter, serif;
                        font-size: 2rem;
                        font-style: normal;
                        font-weight: 700;
                        line-height: normal;
                    }
                }
            }

            .text-wrapper {
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                justify-content: center;
                align-items: stretch;

                > div {
                    border-radius: 16px;
                    border: 1px solid #E4B200;
                    background: rgba(217, 217, 217, 0.13);
                    padding: 0.5rem;
                    max-width: 20rem;

                    color: #E4B200;
                    font-family: var(--font-family);
                }
            }
        }
    }
}
</style>
