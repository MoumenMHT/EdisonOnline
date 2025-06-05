<script setup lang="ts">
import { ref } from "vue";
import Chart from "primevue/chart";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { chartDataSet, ChartService } from "@service/chart.service.ts";
import { IPowerWordsGlobal } from "@interface/Models.ts";
import { ManuscriptRevision } from "@interface/Manuscript.ts";
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()
const globalPowerWordsData = ref<IPowerWordsGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.PowerWords && x.section === 'global')?.content);
const valid = ref(true);
const chartOptions = ChartService.getDefaultBarOptions({
    indexAxis: 'y',
    plugins: {
        legend: {
            display: false,
        }
    }
});
const tableData = ref<any[]>([]);
const powerWordsChartData = ref({
    labels: [] as string[],
    datasets: [{
        backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.5),
        borderColor: ChartService.borderColor[0],
        data: [] as number[],
        borderWidth: 2
    }] as chartDataSet[],
});

try {
    for (let gstd in globalPowerWordsData.value["power words total"]) {
        const value = globalPowerWordsData.value["power words total"][gstd];
        tableData.value.push({
            name: gstd,
            value: value,
        });
        powerWordsChartData.value.labels.push(gstd);
        powerWordsChartData.value.datasets[0].data.push(value);
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="grid grid-nogutter w-full p-3 relative">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">
                Stærke ord
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage />
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-6 flex flex-column gap-2 pl-2">
                <div class="p-2 w-full">
                    <Chart type="bar" :data="powerWordsChartData" :options="chartOptions" class="h-20rem"/>
                </div>
            </div>
            <div class="col-6 flex flex-column gap-2">
                <div class="p-2 w-full">
                    <DataTable :value="tableData" class="p-datatable-sm">
                        <Column field="name" header="Metric"></Column>
                        <Column field="value" header="Value"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
        <div class="col-12 surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvad betyder stærke ord?</span><br>
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
