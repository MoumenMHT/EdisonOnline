<script setup lang="ts">
import { ref } from "vue";
import Chart from "primevue/chart";
import { chartDataSet, ChartService } from "@service/chart.service.ts";
import { IDialogueGlobal, IStringKeyNumberValue } from "@interface/Models.ts";
import {ManuscriptRevision} from "@interface/Manuscript.ts";
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";

interface ISortedData {
    name: string;
    val: number;
}

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()

const globalDialogueData = ref<IDialogueGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Dialogue && x.section === 'global')?.content as IDialogueGlobal);
const valid = ref(true);
const sortAndLimit = (data: IStringKeyNumberValue): ISortedData[] => {
    return Object.entries(data).sort((a,b) => b[1]-a[1]).map(el=>{ return { name: el[0], val: el[1]}}).slice(0,10);
}
const verbChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.5),
            borderColor: ChartService.borderColor[0],
            borderWidth: 2,
            data: [] as number[]
        }
    ] as chartDataSet[],
});
const chartOptions = ChartService.getDefaultBarOptions({
    plugins: {
        legend: {
            display: false,
        }
    }
});

try {
    const sortedVerbs = sortAndLimit(globalDialogueData.value["verbs count"]);
    for (let verb of sortedVerbs) {
        verbChartData.value.labels.push(verb.name);
        verbChartData.value.datasets[0].data.push(verb.val);
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">Udsagnsord</div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage />
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-12 flex flex-column gap-2">
                <div class="p-2 w-full">
                    <Chart type="bar" :data="verbChartData" :options="chartOptions" class="h-20rem" />
                </div>
            </div>
        </div>
        <div class="col-12 surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvad er udsagnsord?</span><br>
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
