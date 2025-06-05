<script setup lang="ts">
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { ref } from "vue";
import { chartDataSet, ChartService } from "@service/chart.service.ts";
import Chart from "primevue/chart";
import { ITenseGlobal, ITenseParts } from "@interface/Models.ts";
import {ManuscriptRevision} from "@interface/Manuscript.ts";
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";
import { translateTempusMetric } from "@util/translate.ts";


const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()

const globalTenseData = ref<ITenseGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Tense && x.section === 'global')?.content);
const partsTenseData = ref<ITenseParts[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Tense && x.section === 'parts')?.content);
const valid = ref(true);
const notForTable = ['tenses count'];
const tableData = ref<any[]>([]);
const lineChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'Past tense',
            data: [] as number[],
            fill: false,
            backgroundColor: ChartService.backgroundColors[0],
            borderColor: ChartService.hoverBackgroundColors[0],
            borderWidth: 2,
            pointRadius: 1,
        },
        {
            label: 'Present tense',
            data: [] as number[],
            fill: false,
            backgroundColor: ChartService.backgroundColors[1],
            borderColor: ChartService.hoverBackgroundColors[1],
            borderWidth: 2,
            pointRadius: 1,
        }
    ] as chartDataSet[]
});
const lineChartOptions = ChartService.getDefaultLineOptions();

try {
    for (let gstd in globalTenseData.value) {
        if (notForTable.includes(gstd)) {
            continue;
        }
        tableData.value.push({
            name: gstd,
            value: globalTenseData.value[gstd],
        });
    }
    for (const content of partsTenseData.value) {
        // We only use first chunk in this.
        const chunk = content.chunks;
    
        lineChartData.value.labels.push(chunk.part.toString()+'%');
        lineChartData.value.datasets[0].data.push(chunk.tenses[0].Past ?? 0);
        lineChartData.value.datasets[1].data.push(chunk.tenses[0].Pres ?? 0);
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">Tempus</div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage />
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-12">
                <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-20rem" />
            </div>
            <div class="col-6 flex flex-column gap-2">
                <div class="p-2 w-full">
                    <DataTable :value="tableData" class="p-datatable-sm">
                        <Column header="Metric">
                            <template #body="slotProps">
                                {{ translateTempusMetric(slotProps.data.name) }}
                            </template>
                        </Column>
                        <Column field="value" header="Value"></Column>
                    </DataTable>
                </div>
            </div>
            <div class="col-6 flex flex-column gap-2 pl-2">
                <div class="p-2 mt-auto">
                    Læs mere om tempus: -> &lt;link til skrive værksted&gt;
                </div>
            </div>
        </div>
        <div class="col-12 surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvad betyder tempus?</span><br>
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
