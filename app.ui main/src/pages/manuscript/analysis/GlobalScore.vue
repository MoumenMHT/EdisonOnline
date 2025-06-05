<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
// import Button from 'primevue/button';
// import info from '@asset/icons/circleInfo.svg';
import GlobalScoreBall from '@component/numberBall.vue';
import cirkleArrow from '@asset/icons/circleArrow.svg';
import { getModelData } from '@util/ReportHelper.ts';
import { IGlobalAnalyzedContent } from '@interface/Models.ts';
import { computed, ref } from 'vue';
import router from '@core/router.ts';
import Dialog from 'primevue/dialog';
import ReportIcon from '@component/report/reportIcon.vue';
// import circleCheckmark from '@asset/icons/circleCheckmark.svg';
import { globalScoreLabelToReportId } from '@util/reportIconHelper.ts';
import { useMainStore } from '@store/main.ts';
import Tips from '@component/report/reportTips.vue';
import Recommendations from '@component/report/reportRecommendations.vue';
import Articles from '@component/report/reportArticles.vue';
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";
import { IGlobalScoreTextResponse } from '@interface/Recommendation.ts';
import { RecommendationService } from '@service/recommendation.service.ts';

interface GSText extends IGlobalScoreTextResponse {
    name: string;
    value: number;
}

const hiddenValues = ['score'];

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean, // if true always use globalAnalysed
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
    reportId: number,
}>();
const store = useMainStore();
const globalUser = getModelData<IGlobalAnalyzedContent>(props.modelData, ModelResultDataModelEnum.GlobalUser);
const globalAnalyzed = getModelData<IGlobalAnalyzedContent>(props.modelData, ModelResultDataModelEnum.GlobalAnalyzed);

const data = computed<IGlobalAnalyzedContent>(() => {
    // Enforce analyseret when it is similar books.
    const dataSource = props.isSimilarBook ? 'Analyseret' : store.AnalyzedOrGivenData;

    if (globalUser?.content && dataSource === 'Angivet') {
        return globalUser.content;
    }
    if (globalAnalyzed?.content && dataSource === 'Analyseret') {
        return globalAnalyzed.content
    }

    return {
        archetype: 0, audience_classification: 0, cliches: 0, dialogue: 0, genre_classification: 0, legibility: 0,
        power_words: 0, score: 0, showing_telling: 0, tempo: 0
    }
});
const valid = ref(true);
const diviationList = computed<GSText[]>(() => {
    const d: GSText[] = [];
    for (const ref in data.value) {
        const val = data.value[ref];
        const GSText = store.getGlobalScoreTextByType(globalScoreLabelToReportId(ref))
        if (val !== 0 && !hiddenValues.includes(ref)) {
            d.push({
                name: ref,
                value: val,
                ...GSText,
            });
        }
    }
    d.sort((a,b) => a.value - b.value);

    return d;
});

const meaningDialog = ref(false);

const navigate = (place: string) => {
    let linkPrefix = 'manuscript';
    if (props.isAdmin) {
        linkPrefix = 'adminManuscript';
    }
    if (props.isSimilarBook) {
        linkPrefix = 'similarBook';
    }
    
    document.getElementsByClassName('manuscript-content-container')[0]?.scrollTo({ top: 0, behavior: 'auto' });
    router.push({ name: linkPrefix+'ReportView' , params: { reportId: globalScoreLabelToReportId(place) } }).then();
}

if (globalUser === undefined && globalAnalyzed === undefined) {
    valid.value = false;
}

interface gs_recommendation {
    archetype: boolean;
    audience_classification: boolean;
    cliches: boolean;
    dialogue: boolean;
    genre_classification: boolean;
    legibility: boolean;
    power_words: boolean;
    showing_telling: boolean;
    tempo: boolean;
}
const settings = ref<gs_recommendation>(<gs_recommendation>{
    archetype: false,
    audience_classification: false,
    cliches: false,
    dialogue: false,
    genre_classification: false,
    legibility: false,
    power_words: false,
    showing_telling: false,
    tempo: false,
});

const settingName = 'gs_'+props.manuscriptRevisionData.id;
const storeSettings = store.settings;
for (const storeSetting of storeSettings) {
    const sName = storeSetting.name.split('.')[0];
    if (sName ===  settingName) {
        const name = storeSetting.name.split('.')[1];
        settings.value[name] = storeSetting.value;
    }
}

// const toogleRecommendation = (report: string) => {
//     settings.value[report] = !settings.value[report];
//     store.updateSetting({
//         name: settingName+'.'+report,
//         value: JSON.stringify(settings.value[report]),
//     })
// }
</script>

<template>
    <div class="globalscore-wrapper report-wrapper">
        <div class="globalscore-container container">
            <div class="globalscore-header header printRow">
                <div class="globalscore-header-left header-left">
                    <report-what-is :report-id="reportId" />
                </div>
                <div class="globalscore-header-right header-right">
                    <div class="headline">Din Global Score</div>
                    <GlobalScoreBall size="20rem" :value="data.score" font-color="#000" />
                </div>
            </div>
            <recommendations :report-id="reportId" :model-data="modelData" :manuscript-revision-data="manuscriptRevisionData"/>
            <ReportInfoButtons :report-id="reportId" />
        </div>
        <div class="diviation-container">
            <div class="headline">Elementer, der påvirker din Global Score</div>
            <div class="diviation-item" v-for="item in diviationList">
                <div class="headline" v-bind:class="{
                    'completed': settings[item.name],
                }">
                    <div class="left">
                        <ReportIcon :report-id="item.type" circle-fill="none" icon-fill="#E4B200" size="2.5rem" />{{ item.typeName }}
                    </div> <!-- v-bind:icon-fill="settings[item.name] ? '#19B400' : '#E4B200'" -->
                    <div class="right"> <!-- v-if="!settings[item.name]" -->
                        {{ item.value }}
                    </div>
                </div>
                <div class="information">
                    <p>{{ RecommendationService.convertVariablesToText(item.text, manuscriptRevisionData, modelData) }}</p>
                </div>
                <div class="footer noPrint">
                    <div class="left float-right" v-on:click="navigate(item.name)"> <!-- v-if="!settings[item.name]" -->
                        <cirkleArrow class="arrow E" />Gå til <span>{{ item.typeName }} rapporten</span>
                    </div>
<!--                    <div class="right" v-if="!isAdmin" v-bind:class="settings[item.name] ? 'completed' : ''">-->
<!--                        <div class="recommendation-container">-->
<!--                            <Button @click="toogleRecommendation(item.name)"-->
<!--                                    v-bind:class="settings[item.name] ? 'completed' : ''"-->
<!--                            >-->
<!--                                <div v-if="settings[item.name]">-->
<!--                                    Fuldført <circleCheckmark fill="#2C2C2C" v-bind:class="{-->
<!--                                        'completed': settings[item.name],-->
<!--                                    }"-->
<!--                                />-->
<!--                                </div>-->
<!--                                <div v-else>-->
<!--                                    Fuldfør anbefaling <cirkleArrow class="arrow E" fill="#2C2C2C"/>-->
<!--                                </div>-->
<!--                            </Button>-->
<!--                        </div>-->
<!--                        <div v-if="!settings[item.name]" class="help-container cursor-pointer" @click="meningDialog = true">-->
<!--                            <info class="fill-white" />-->
<!--                            <p>Hvad betyder det?</p>-->
<!--                        </div>-->
<!--                    </div>-->
                </div>
            </div>
        </div>
        <tips :report-id="reportId"/>
        <articles :report-id="reportId"/>
    </div>
    <Dialog v-model:visible="meaningDialog" modal header="Hvad betyder det?" :style="{ width: '50vw' }">
        <p>
            Klik her, hvis du har tjekket din rapport igennem og du ikke ønsker at lave flere ændringer. Når du fuldfører anbefalingen, vil klichéer ikke længere påvirke din Global Score
        </p>
    </Dialog>
</template>

<style scoped lang="scss">
.globalscore-wrapper {
    .diviation-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        > .headline {
            font-size: 2.5rem;
            margin: 1rem 0;
            font-weight: 700;
        }

        > .diviation-item {
            margin: 0 5rem;
            width: calc(100% - 10rem);
            padding-bottom: 2rem;
            
            &:not(:last-of-type) {
                border-bottom: 1px solid var(--primary-color);
                margin-bottom: 2rem;
            }

            > .headline {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                border-bottom: 1px dashed var(--primary-color);
                border-image: linear-gradient(to left, transparent, #e4b200, transparent) 5;
                font-size: 3.5rem;
                font-weight: 700;
                line-height: 4rem;
                height: 4.5rem;
                 
                &.completed {
                    border-color: #19B400;
                }

                > .left {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    > svg {
                        margin-right: 0.5rem;
                    }
                }
                
                > .right {
                    font-size: 4rem;
                } 
            }
            
            > .information {
                padding-top: 0.5rem;
            }
            
            > .footer {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-top: 1rem;
                
                > .left {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    
                    &.float-right {
                        margin-left: auto;
                    }
                    
                    > svg {
                        margin-right: 0.5rem;
                        width: 2.5rem;
                    }
                    
                    > span {
                        margin-left: 0.25rem;
                        color: var(--primary-color);
                    }
                }
                
                > .right {
                    &.completed {
                        margin-left: auto;
                    }
                    
                    > .recommendation-container {
                        > button {
                            border-radius: 1rem;
                            color: #2C2C2C;
                            font-family: var(--font-family);
                            font-weight: 700;
                            
                            &.completed {
                                background: #19B400;
                                border: 1px solid #19B400;
                                
                                &:enabled:hover {
                                    background: #19B400;
                                    border: 1px solid #19B400;
                                }
                                &:enabled:focus {
                                    box-shadow: 0 0 0 2px var(--primary-color-text), 0 0 0 4px var(--btn-success-box-shadow), 0 1px 2px 0 black;
                                }
                            }

                            > div {
                                display: flex;
                                flex-direction: row;
                                justify-content: center;
                                align-items: center;
                                
                                > svg {
                                    margin-right: 0.25rem;
                                    margin-left: 0.5rem;
                                    width: 2.5rem;
                                    
                                    &.completed {
                                        :deep(path) {
                                            fill: #19B400;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    > .help-container {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;

                        > svg {
                            margin-right: 0.5rem;
                            width: 1.5rem;

                            > :deep(path) {
                                fill: #2C2C2C;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
