<script setup lang="ts">
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { ref } from "vue";
import { chartDataSet, ChartService } from "@service/chart.service.ts";
import Chart from "primevue/chart";
import { IPerspectiveGlobal } from "@interface/Models.ts";
import { ManuscriptRevision } from "@interface/Manuscript.ts";
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";
import { translatePerspectiveMetric } from "@util/translate.ts";

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()
const globalDialogueData = ref<IPerspectiveGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Perspective && x.section === 'global')?.content as IPerspectiveGlobal);

const valid = ref(true);
const notForTable = ['pronouns count'];
const tableData = ref<any[]>([]);
const doughnutChartOptions = ChartService.getDefaultDoughnutOptions();
const pieChartData = ref({
    labels: ['1rst person indicators', '2nd person indicators', '3rd person indicators'],
    datasets: [] as chartDataSet[]
});

try {
    for (let gstd in globalDialogueData.value) {
        if (notForTable.includes(gstd)) {
            continue;
        }
        tableData.value.push({
            name: gstd,
            value: globalDialogueData.value[gstd],
        });
    }
    pieChartData.value.datasets.push({
        data: [
            globalDialogueData.value["percentage of 1rst person indicators"],
            globalDialogueData.value["percentage of 2nd person indicators"],
            globalDialogueData.value["percentage of 3rd person indicators"],
        ],
        backgroundColor: ChartService.backgroundColors,
        hoverBackgroundColor: ChartService.hoverBackgroundColors,
    });
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>

<template>

    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">
                Perspectiv
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage/>
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-6 flex flex-column gap-2" style="height: 30rem">
                <Chart type="doughnut" :data="pieChartData" :options="doughnutChartOptions" class="h-full w-full"/>
            </div>
            <div class="col-6 flex flex-column gap-2 pl-2">
                <div class="p-2 w-full">
                    <DataTable :value="tableData" class="p-datatable-sm">
                        <Column header="Metric">
                            <template #body="slotProps">
                                {{ translatePerspectiveMetric(slotProps.data.name) }}
                            </template>
                        </Column>
                        <Column field="value" header="Value"></Column>
                    </DataTable>
                </div>
                <div class="p-2 mt-auto">
                    Læs mere om perspektiv: -> &lt;link til skrive værksted&gt;
                </div>
            </div>
        </div>
        <div class="col-12 surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvad betyder perspectiv?</span><br>
            <span class="font-semibold text-lg text-red-500">Mangler teksten til hvad der skal stå her.</span><br>
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke endnu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
