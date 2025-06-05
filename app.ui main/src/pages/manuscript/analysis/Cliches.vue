<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import Tips from "@component/report/reportTips.vue";
import Articles from "@component/report/reportArticles.vue";
import Recommendations from '@component/report/reportRecommendations.vue';
import { Ref, ref } from 'vue';
import NumberBall from '@component/numberBall.vue';
import { getModelData } from '@util/ReportHelper.ts';
import { IAudienceClassificationGlobal, IClichesGlobal, IClichesListItem, IGenreClassificationGlobal, ILegibilityGlobal } from '@interface/Models.ts';
import CircleProgress from '@component/circleProgress.vue';
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";

export interface ClicheListItemChild {
    name: string;
    similarity: number;
}

export interface ClicheListItem {
    name: string;
    amount: number;
    children: ClicheListItemChild[];
    childrenVisible: Ref;
}

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
    reportId: number,
}>();

const clichesGlobal = getModelData<IClichesGlobal>(props.modelData, ModelResultDataModelEnum.Cliches);
const lixGlobal = getModelData<ILegibilityGlobal>(props.modelData, ModelResultDataModelEnum.Legibility);
const genreModelData = getModelData<IGenreClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.GenreClassification);
const audienceModelData = getModelData<IAudienceClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.AudienceClassification);

const clichesGlobalData = ref<IClichesGlobal>({ "cliches list": {}, "number of cliches": 0 });
const lixGlobalData = ref<ILegibilityGlobal>({ "average sentence length": 0, "average word length": 0, "lexicon size": 0, "number of complex words": 0, "number of sentences": 0, "number of words": 0, "percentage of complex words": 0, LIX: 0 });
const genreData = ref<IGenreClassificationGlobal[]>([]);
const audienceData = ref<IAudienceClassificationGlobal[]>([]);

const clichesList = ref<ClicheListItem[]>([]);
const topGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});

const topAudience = ref<IAudienceClassificationGlobal>({
    class: '',
    score: 0
});

const valid = ref(true);


try {
    if (clichesGlobal?.content !== undefined) {
        clichesGlobalData.value = clichesGlobal.content;
    }
    if (lixGlobal?.content !== undefined) {
        lixGlobalData.value = lixGlobal.content;
    }
    if (genreModelData?.content !== undefined) {
        genreData.value = genreModelData.content.sort((a, b) => b.score - a.score);
        topGenre.value = genreData.value[0];
    }
    if (audienceModelData?.content !== undefined) {
        audienceData.value = audienceModelData.content.sort((a, b) => b.score - a.score);
        topAudience.value = audienceData.value[0];
    }

    for (let cliche in clichesGlobalData.value["cliches list"]) {
        const clicheItems = clichesGlobalData.value["cliches list"][cliche] as IClichesListItem[];
        const listAmount = clicheItems.length;
        if (listAmount === 0) {
            continue;
        }
        clichesList.value.push({
            name: cliche,
            amount: listAmount,
            children: clicheItems.map<ClicheListItemChild>(x => {
                return {
                    name: x.sentence,
                    similarity: Math.round(x['similarity score']),
                }
            }).sort((a, b) => b.similarity - a.similarity),
            childrenVisible: false,
        });
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}

</script>

<template>
    <div class="report-wrapper">
        <div class="container">
            <div class="header printRow">
                <div class="header-left">
                    <report-what-is :report-id="reportId" />
                </div>
                <div class="header-right">
                    <NumberBall :value="clichesGlobalData['number of cliches']" size="13.5rem" font-color="#000" />
                    <div class="subline">Anvendelse af klichéer</div>
                </div>
            </div>
            <div class="body left column">
                <div class="headline right">
                    Oversigt over klichéer
                </div>
                <div v-if="clichesList.length === 0" class="no-cliches">
                    Ingen fundne klichéer
                </div>
                <div class="cliches-list">
                    <div class="cliches-list-item" v-for="(item, index) in clichesList">
                        <div class="header-wrapper">
                            <div class="left">
                                <number-ball :value="index+1" size="2.75rem" font-color="#2C2C2C" />
                                <div class="header">{{ item.name }}</div></div>
                            <div class="right">
                                <div class="amount">{{ item.amount }}X</div>
                                <div class="children-button noPrint" @click="item.childrenVisible=!item.childrenVisible">
                                    <i class="pi pi-angle-down"></i>
                                </div>
                            </div>
                        </div>
                        <div 
                            class="child-container" 
                             v-bind:class="{
                                'hidden': !item.childrenVisible,
                            }"
                        >
                            <div class="similarity-item" v-for="child in item.children">
                                <div class="left">
                                    <div class="left-left">
                                        {{ child.name }}
                                    </div>
                                </div>
                                <div class="right">
                                    <CircleProgress :percentage="child.similarity" size="6rem" backgroundFill="#2c2c2c" />
                                </div>
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
.cliches-list {
    display: flex;
    flex-direction: column;
    
    > .cliches-list-item {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        user-select: none;
        //border-bottom: 1px solid var(--primary-500);
        
        > .header-wrapper {
            flex: 1 1 auto;
            padding-bottom: 0.5rem;
            margin-top: 1rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom: 1px solid var(--primary-500);
            justify-content: space-between;
            
            > div {
                color: #FFF;
                font-family: var(--font-family);
                font-size: 2rem;
                font-weight: 600;
                display: flex;
                flex-direction: row;
                margin-right: 1rem;
                
                @media print {
                    color: #000;
                }
                
                > .header {
                    margin-left: 1rem;
                }
                
                > .amount {
                    margin-right: 1rem;
                    color: var(--primary-color);
                }
                
                > .children-button {
                    cursor: pointer;
                    border: 1px solid var(--primary-color);
                    color: var(--primary-color);
                    border-radius: 50%;
                    width: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
        
        > .child-container {
            padding: 1rem 5rem;
            border-bottom: 1px solid var(--primary-500);
            
            @media print {
                display: block !important;
                
                &:last-of-type {
                    border-bottom: none;
                }
            }
            
            > .similarity-item {
                flex: 1 1 auto;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                &:not(:last-child) {
                    margin-bottom: 2rem;
                }

                > .left {
                    
                    display: flex;
                    flex-direction: row;
                    flex: 1 1 auto;
                    justify-content: space-between;
                    align-items: flex-start;
                    font-family: var(--font-family);
                    // This is to make sure the items is center aligned
                    // This sould be the same as font-size!
                    $font-size: 1.5rem;
                    margin-top: -$font-size;
                    font-size: $font-size;

                    > div {
                        flex: 1 1 auto;
                        border-bottom: 1px solid var(--primary-color);
                    }

                    > .left-left {
                        text-align: left;
                    }
                    > .left-right {
                        text-align: right;
                        padding-right: 1rem;
                        color: var(--primary-color);
                    }
                }
            }
        }
    }
}

.similarity-wrapper {
    > .similarity-item {
        flex: 1 1 auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
        &:not(:last-child) {
            margin-bottom: 2rem;
        }
        
        > .left {
            display: flex;
            flex-direction: row;
            flex: 1 1 auto;
            justify-content: space-between;
            align-items: flex-start;
            
            > div {
                flex: 1 1 auto;
                border-bottom: 1px solid var(--primary-color);
                color: #FFF;
                text-align: center;
                font-family: var(--font-family);
                font-size: 2rem;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                
                @media print {
                    color: #000;
                }
            }
            
            > .left-left {
                text-align: left;
            }
            > .left-right {
                text-align: right;
                padding-right: 1rem;
                color: var(--primary-color);
            }
        }
        //> .right {
        //
        //}
    }
}
</style>