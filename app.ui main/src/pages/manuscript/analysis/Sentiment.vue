<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum, ModelResultDataSectionEnum } from '@interface/Model.ts';
import Tips from "@component/report/reportTips.vue";
import Articles from "@component/report/reportArticles.vue";
import Recommendations from '@component/report/reportRecommendations.vue';
import { ref } from 'vue';
import { IArchetypeContentGlobal, IArchetypeContentParts, IChunksParts } from '@interface/Models.ts';
import {ChartService} from "@service/chart.service.ts";
import ArchetypeGraph from "@component/archetypeGraph.vue";
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";
import { getModelData } from '@/utilities/ReportHelper';
import { ChartMetadata } from '@component/report/ReportInteractiveChart.vue';
import ReportInteractiveChart from '@component/report/ReportInteractiveChart.vue';


const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
    reportId: number,
}>();
const data = ref<IArchetypeContentGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Archetypes && x.section === ModelResultDataSectionEnum.Global)?.content);
const parts = ref<IArchetypeContentParts[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Archetypes && x.section === ModelResultDataSectionEnum.Parts)?.content);

const chunkPartsData = getModelData<IChunksParts[]>(props.modelData, ModelResultDataModelEnum.Chunk, ModelResultDataSectionEnum.Parts);
const partsMetadata = ref<ChartMetadata>({
    datasets: [
        {
            data: []
        }
    ]
});

const myChart = ref();
const lineChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'Stemning',
            data: [] as number[],
            fill: false,
            borderColor: ChartService.borderColor[1],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[1], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 1, // So endusers can easily click on the data points
            pointHoverRadius: 8
        },
        {
            label: 'Tendenslinje',
            data: [] as number[],
            fill: false,
            borderColor: ChartService.borderColor[0],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 0, // Click on the "Tendenslinje" line will not trigger the text dialog
        },
    ]
});
const lineChartOptions = ChartService.getDefaultLineOptions();

const valid = ref(true);

try {
    if (parts?.value !== undefined) {
        for (const chunks of parts?.value) {
            let chunk = chunks.chunks;
            lineChartData.value.labels.push(chunk.part.toString() + '%');
            lineChartData.value.datasets[0].data.push(chunk["sentiment"]);
            lineChartData.value.datasets[1].data.push(chunk["trendline"]);

            var chunkPartsTempus = chunkPartsData?.content?.find((x) => x.chunks.chunk_id == chunk.chunk_id);
            partsMetadata.value.datasets[0].data.push({
                text: chunkPartsTempus?.chunks.part_text ?? [],
            });
        }
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}

try {
    // Resize chart before and after printing to make sure it fits printable area
    window.addEventListener('beforeprint', () => {
        const chart = myChart.value?.getChart();
        if (chart != undefined && chart.resize != undefined)
            chart.resize(700, 300);
    });
    window.addEventListener('afterprint', () => {
        const chart = myChart.value?.getChart();
        if (chart != undefined && chart.resize != undefined)
            chart.resize();
    });
} catch (e) {
    console.error('Unhandled error:', e);
}

</script>

<template>
    <div class="report-wrapper">
        <div class="container chart">
            <div class="header">
                <div class="header-left">
                    <report-what-is :report-id="reportId" />
                </div>
                <div class="header-right">
                    <span class="text-primary" style="font-size: 1.5rem; font-weight: 700;">
                        Din arketype:
                    </span>
                    <ArchetypeGraph :archetype="data.best_archetype_name" style="width: 25rem; height: 14rem;" />
                    <span style="font-size: 1.5rem; font-weight: 700;">
                        {{ data.best_archetype_name }}
                    </span>
                </div>
            </div>
            <div class="header column">
                <div class="headline text-color text-align-center">Din stemningskurve</div>
            </div>
            <div class="column chart">
                <ReportInteractiveChart chartType="line" :chartData="lineChartData" :chartOptions="lineChartOptions" :chartMetadata="partsMetadata" chartCssClass="h-20rem" />
            </div>
            <recommendations :report-id="reportId" :model-data="modelData" :manuscript-revision-data="manuscriptRevisionData" />
            <ReportInfoButtons :report-id="reportId" />
        </div>
        <tips :report-id="reportId" />
        <articles :report-id="reportId"/>
    </div>
</template>

<style scoped lang="scss">

</style>