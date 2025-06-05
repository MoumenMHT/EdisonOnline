<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import Tips from '@component/report/reportTips.vue';
import Articles from '@component/report/reportArticles.vue';
import Recommendations from '@component/report/reportRecommendations.vue';
import { ref } from 'vue';
import { getModelData } from '@util/ReportHelper.ts';
import { IShowingTellingGlobal, IStringKeyNumberValue } from '@interface/Models.ts';
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";
import ReportColorChart from '@component/report/ColorChart.vue';
import TopicWordList from '@component/report/TopicWordList.vue';
import { ChartService } from '@service/chart.service.ts';

interface ISortedData {
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

const showtellGlobal = getModelData<IShowingTellingGlobal>(props.modelData, ModelResultDataModelEnum.ShowingTelling);

const showtellGlobalData = ref<IShowingTellingGlobal>({
    "adjectives count": {}, "adverbs count": {}, "descriptive words count": {},
    "filling words count": {}, "number of adjectives": 0, "number of adverbs": 0,
    "number of descriptive words": 0, "number of filling words": 0, "percentage of adjectives": 0,
    "percentage of adverbs": 0, "percentage of descriptive words": 0, "percentage of filling words": 0,
    show_tell_value: 0
});

const colorChartItems: ColorChartItem[] = [];
const topicWordListItems: TopicWordListItem[] = [];

const formatWordList = (data: IStringKeyNumberValue): ISortedData[] => {
    return Object.entries(data).sort((a, b) => b[1] - a[1]).map(el => {
        return { name: el[0], value: el[1] }
    });
}

try {
    if (showtellGlobal?.content !== undefined) {
        showtellGlobalData.value = showtellGlobal.content;
    }

    colorChartItems.push({
        headline: 'Tillægsord',
        data: formatWordList(showtellGlobalData.value['adjectives count']).slice(0, 5)
    },{
        headline: 'Fyldord',
        data: formatWordList(showtellGlobalData.value['filling words count']).slice(0, 5)
    },{
        headline: 'Biord',
        data: formatWordList(showtellGlobalData.value['adverbs count']).slice(0, 5)
    },{
        headline: 'beskrivende ord',
        data: formatWordList(showtellGlobalData.value['descriptive words count']).slice(0, 5)
    });
    
    topicWordListItems.push({
        headline: 'Tillægsord',
        color: ChartService.backgroundColors[0],
        data: formatWordList(showtellGlobalData.value['adjectives count'])
    },{
        headline: 'Fyldord',
        color: ChartService.backgroundColors[1],
        data: formatWordList(showtellGlobalData.value['filling words count'])
    },{
        headline: 'Biord',
        color: ChartService.backgroundColors[2],
        data: formatWordList(showtellGlobalData.value['adverbs count'])
    },{
        headline: 'beskrivende ord',
        color: ChartService.backgroundColors[3],
        data: formatWordList(showtellGlobalData.value['descriptive words count'])
    });
    
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="report-wrapper">
        <div class="container powerwords-body-container">
            <div class="header">
                <div class="header-left">
                    <report-what-is :report-id="reportId" />
                </div>
            </div>
            <ReportColorChart :items="colorChartItems" table-head-text="ord"></ReportColorChart>
            <div class="body column sematic-fields-information-wrapper">
                <div class="headline text-align-center text-color">Analyse af vigtigste ord:</div>
                <TopicWordList :items="topicWordListItems" :first-limit="5" :step-counter="5"></TopicWordList>
            </div>
            <recommendations :report-id="reportId" :model-data="modelData" :manuscript-revision-data="manuscriptRevisionData"/>
            <ReportInfoButtons :report-id="reportId" />
        </div>
        <tips :report-id="reportId"/>
        <articles :report-id="reportId"/>
    </div>
</template>

<style scoped lang="scss">
.powerwords-header-right {
    > div {
        border-radius: 1.23256rem;
        border: 1.233px solid #E4B200;
        background: #E4B200;
        width: 12.5rem;
        height: 3.0625rem;
        color: #2C2C2C;
        text-align: center;
        font-size: 1.1555rem;
        font-weight: 700;
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: column;
        user-select: none;
        cursor: pointer;

        &:not(:last-child) {
            margin-bottom: 1rem;
        }
    }
}
</style>