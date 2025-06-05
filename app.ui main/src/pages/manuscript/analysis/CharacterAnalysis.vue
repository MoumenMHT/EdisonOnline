<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import {ModelResultData, ModelResultDataModelEnum, ModelResultDataSectionEnum} from '@interface/Model.ts';
import Tips from "@component/report/reportTips.vue";
import Articles from "@component/report/reportArticles.vue";
import Recommendations from '@component/report/reportRecommendations.vue';
import { ref } from 'vue';
import NumberBall from "@component/numberBall.vue";
import {getModelData} from "@util/ReportHelper.ts";
import {IScenesCharacters} from "@interface/Models.ts";
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportColorChart from '@component/report/ColorChart.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
    reportId: number,
}>();

const data = getModelData<IScenesCharacters[]>(props.modelData, ModelResultDataModelEnum.Scenes, ModelResultDataSectionEnum.Characters)
const charactersData = ref<IScenesCharacters[]>([]);

const valid = ref(true);

try {
    if (data?.content !== undefined) {
        charactersData.value = data.content.sort((a, b) => b.score - a.score);
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}

const colorChartItems = ref([
    {
        headline: 'karakterer',
        data: charactersData.value.slice(0, 5).map(character => ({
            name: character.name,
            value: character.score,
        }))
    }
]);

</script>

<template>
    <div class="report-wrapper">
        <div class="container flex flex-column gap-4">
            <div class="header">
                <div class="header-left">
                    <report-what-is :report-id="reportId" />
                </div>
                <div class="header-right">
                    <h1 class="text-primary mt-0 mb-3">Antal karakterer</h1>
                    <number-ball :value="charactersData.length" size="13.5rem" font="Kadwa" fontSize="M" font-color="#000" />
                </div>
            </div>
            <ReportColorChart :items="colorChartItems"/>
            <div class="flex m-auto flex-column" style="max-width: 75%">
                <h1 class="text-primary my-0">Karakterliste</h1>
                <div class="data-wrapper my-2">
                    <div class="data-table">
                        <div class="data-table-body">
                            <div v-for="character in charactersData" class="data-table-row">
                                <div class="data-table-cell">
                                    <div class="character">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                                            <circle cx="14.1228" cy="14.842" r="14.1228" fill="#E4B200"/>
                                        </svg>
                                        <span>{{ character.name }}</span>
                                    </div>
                                </div>
                                <div class="data-table-cell">Optræder {{ character.score }} gange</div>
                            </div>
                        </div>
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

.data-wrapper {
    flex: 0 1 auto;
    min-width: 38rem;
    max-height: 16rem;
    overflow-y: scroll;
    border-radius: 0.6rem;
    border: 1px solid #E4B200;
    background: rgba(217, 217, 217, 0.13);


    > .data-table {
        display: table;
        table-layout: fixed;
        padding: 1rem;
        width: 100%;

        > .data-table-body {
            display: table-row-group;

            > .data-table-row {
                display: table-row;

                > .data-table-cell {
                    display: table-cell;
                    padding: 0.5rem 1rem;
                    font-size: 1.5rem;
                    line-height: 1.5rem;

                    &:first-child {
                        border-right: 1px solid rgba(255, 255, 255, 0.29);

                        > .character {
                            display: flex;
                            align-items: center;
                            gap: 1rem;
                        }
                    }
                    &:last-child {
                        text-align: right;
                    }
                }
            }
        }
    }
}

::-webkit-scrollbar {
    width: 0.625rem;
}

::-webkit-scrollbar-track {
    border-radius: 0.625rem !important;
    background: rgba(228, 178, 0, 0.50);
}

::-webkit-scrollbar-thumb {
    border-radius: 0.625rem !important;
    background: #E4B200;
}

</style>