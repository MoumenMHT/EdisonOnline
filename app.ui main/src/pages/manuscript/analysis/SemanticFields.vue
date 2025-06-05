<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import Tips from "@component/report/reportTips.vue";
import Articles from "@component/report/reportArticles.vue";
import Recommendations from '@component/report/reportRecommendations.vue';
import { ref } from 'vue';
import { ChartService } from '@service/chart.service.ts';
import { ISemanticFieldsGlobal, IStringKeyNumberValue } from '@interface/Models.ts';
import { getModelData } from '@util/ReportHelper.ts';
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";
import ReportColorChart from '@component/report/ColorChart.vue';
import ReportTopicWordList from '@component/report/TopicWordList.vue';

interface KeywordData {
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

const valid = ref(true);

const semanticFieldsGlobal = getModelData<ISemanticFieldsGlobal>(props.modelData, ModelResultDataModelEnum.SemanticFields);
const semanticFieldsGlobalData = ref<ISemanticFieldsGlobal>({
    lemma_dictionary: undefined, topics: []
});

const colorChartItems: ColorChartItem[] = [];
const topicWordListItems: TopicWordListItem[] = [];
const formatKeywords = (keywords: IStringKeyNumberValue): KeywordData[] => {
    const arrayData: KeywordData[] = [];
    for (const [key, value] of Object.entries(keywords)) {
        arrayData.push({
            name: key,
            value: value,
        });
    }
    return arrayData.sort((a, b) => b.value - a.value);
}

try {
    if (semanticFieldsGlobal?.content !== undefined) {
        semanticFieldsGlobalData.value = semanticFieldsGlobal.content;
    }

    const sortedTopics = semanticFieldsGlobalData.value.topics.sort((a, b) => b.propensity - a.propensity);
    
    let i = 0;
    while (i < 3) {
        const ref = sortedTopics[i];
        topicWordListItems.push({
            headline: ref['topic name'],
            color: ChartService.backgroundColors[i],
            data: formatKeywords(ref.keywords),
        })
        
        i++;
    }
    colorChartItems.push({
        headline: 'hovedtemaer',
        data: sortedTopics.slice(0, 5).map<ColorChartItemData>(x => {
            return {
                name: x['topic name'],
                value: x.propensity,
            };
        })
    });
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="report-wrapper">
        <div class="container">
            <div class="header column">
                <div class="body column">
                    <ReportWhatIs :report-id="reportId" />
                </div>
            </div>
            <ReportColorChart :items="colorChartItems"></ReportColorChart>
            <div class="body column sematic-fields-information-wrapper">
                <div class="headline text-align-center text-color">Analyse af vigtigste hovedtemaer:</div>
                <ReportTopicWordList :items="topicWordListItems"></ReportTopicWordList>
            </div>
            <recommendations :report-id="reportId" :model-data="modelData" :manuscript-revision-data="manuscriptRevisionData" />
            <ReportInfoButtons :report-id="reportId" />
        </div>
        <tips :report-id="reportId" />
        <articles :report-id="reportId"/>
    </div>
</template>

<style scoped lang="scss">
.sematic-fields-container {
    border-radius: 1.25rem;
    border: 1px solid #E4B200;
    background: rgba(217, 217, 217, 0.13);

    display: flex;
    flex-direction: row;

    @media print {
        background-color: #fff;
        flex-direction: column;
    }
    
    > .left {
        flex-grow: 1;
        padding: 3rem 1rem 1rem 1rem;
        max-width: 75%; // This is bad solution to fix this, but need way more time to find the better solution.
        
        @media print {
            max-width: initial;
            padding: 1rem;
        }

        > .p-chart {
            border-left: 1px solid var(--primary-color);

            @media print {
                border-left: none;
            }
        }
    }

    > .right {
        margin-left: auto;
        
        @media print {
            margin-left: initial;
        }

        &.data-table {
            border-left: 1px solid rgba(255, 255, 255, 0.29);
            display: table;
            table-layout: fixed;
            //margin: 21px;
            overflow: hidden;

            @media print {
                border-left: none;
                border-top: 1px solid #000;
            }

            > .data-table-body {
                display: table-row-group;

                > .data-table-row {
                    display: table-row;

                    &:not(:last-child) {
                        > .data-table-cell {
                            border-bottom: 1px solid rgba(255, 255, 255, 0.29);
                            
                            @media print {
                                border-color: #000;
                            }
                        }
                    }
                    &.primary {
                        color: var(--primary-color);
                    }

                    > .data-table-cell {
                        display: table-cell;
                        padding: 0.5rem 1rem;
                        vertical-align: middle;

                        &:not(:last-child) {
                            border-right: 1px solid rgba(255, 255, 255, 0.29);
                            @media print {
                                border-color: #000;
                            }
                        }

                        > .cell-flex {
                            display: flex;
                            align-content: center;
                            align-items: center;
                            flex-wrap: wrap;
                            justify-content: flex-start;

                            > div:last-child {
                                margin-left: 1rem;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>