<script setup lang="ts">
import { ref } from 'vue';
import Chart from 'primevue/chart';
import { chartDataSet, ChartService } from '@service/chart.service.ts';
import { IDialogueGlobal, IShowingTellingGlobal, IStringKeyNumberValue } from '@interface/Models.ts';
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import ModelErrorMessage from '@component/modelErrorMessage.vue';

interface ISortedData {
    name: string;
    val: number;
}

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()

const globalDialogueData = ref<IDialogueGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Dialogue && x.section === 'global')?.content);
const globalShowingTellingData = ref<IShowingTellingGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.ShowingTelling && x.section === 'global')?.content);

const chartOptions = ChartService.getDefaultBarOptions({
    indexAxis: 'y',
});

const adverbChartData = ref({
    labels: [] as string[],
    datasets: [{
        label: 'Biord',
        backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.5),
        borderColor: ChartService.borderColor[0],
        data: [],
        borderWidth: 2,
    }] as chartDataSet[],
});
const fillerWordsChartData = ref({
    labels: [] as string[],
    datasets: [{
        label: 'Fyldeord',
        backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.5),
        borderColor: ChartService.borderColor[0],
        data: [],
        borderWidth: 2,
    }] as chartDataSet[],
});
const adjectiveChartData = ref({
    labels: [] as string[],
    datasets: [{
        label: 'Tillægsord',
        backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.5),
        borderColor: ChartService.borderColor[0],
        data: [],
        borderWidth: 2,
    }] as chartDataSet[],
});

const valid = ref(true);

const sortAndLimit = (data: IStringKeyNumberValue): ISortedData[] => {
    return Object.entries(data).sort((a, b) => b[1] - a[1]).map(el => {
        return { name: el[0], val: el[1] }
    }).slice(0, 5);
}

try {
    const sortedAdverbs = sortAndLimit(globalDialogueData.value['adverbs count']);
    const sortedFillingWords = sortAndLimit(globalShowingTellingData.value['filling words count']);
    const sortedAdjectives = sortAndLimit(globalShowingTellingData.value['adjectives count']);

    for (let adverb of sortedAdverbs) {
        adverbChartData.value.labels.push(adverb.name);
        adverbChartData.value.datasets[0].data.push(adverb.val);
    }
    for (let adverb of sortedFillingWords) {
        fillerWordsChartData.value.labels.push(adverb.name);
        fillerWordsChartData.value.datasets[0].data.push(adverb.val);
    }
    for (let adverb of sortedAdjectives) {
        adjectiveChartData.value.labels.push(adverb.name);
        adjectiveChartData.value.datasets[0].data.push(adverb.val);
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">
                Tillægsord
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage />
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-6">
                <Chart type="bar" :data="adverbChartData" :options="chartOptions" class="h-15rem"/>
            </div>
            <div class="col-6">
                <Chart type="bar" :data="fillerWordsChartData" :options="chartOptions" class="h-15rem"/>
            </div>
            <div class="col-6">
                <Chart type="bar" :data="adjectiveChartData" :options="chartOptions" class="h-15rem"/>
            </div>
            <div class="col-6 flex flex-column">
                <div class="p-2 mt-auto">
                    Læs mere om læsbarhed: -> &lt;link til skrive værksted&gt;
                </div>
            </div>
        </div>
        <div class="col-12 surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvad er tillægsord?</span><br>
            <span class="font-semibold text-lg text-red-500">Mangler teksten til hvad der skal stå her.</span><br>
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke i nu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
