<script setup lang="ts">
import { ref } from "vue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Chart from "primevue/chart";
import { chartDataSet, ChartService } from "@service/chart.service.ts";
import { ManuscriptRevision } from "@interface/Manuscript.ts";
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";
import { ISemanticFieldsGlobal, ITopicData } from "@interface/Models.ts";

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()

const data = ref<ISemanticFieldsGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.SemanticFields)?.content as ISemanticFieldsGlobal);
const pieChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            data: [] as number[],
            backgroundColor: ChartService.backgroundColors,
            hoverBackgroundColor: ChartService.hoverBackgroundColors,
        }
    ] as chartDataSet[]
});
const doughnutChartOptions = ChartService.getDefaultDoughnutOptions();
const limitedData: ITopicData[] = [];
const valid = ref(true);

try {
    const sortedTopics = data.value.topics.sort((a, b) => b.score - a.score);
    let i = 0;
    while (i < 10) {
        const ref = sortedTopics[i];
        limitedData.push(ref);
        pieChartData.value.labels.push(ref['topic name']);
        pieChartData.value.datasets[0].data.push(ref.score);
        i++;
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
                Semantiske felter
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage/>
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-6 flex flex-column gap-2">
                <div class="p-2 w-full">
                    <Chart type="doughnut" :data="pieChartData" :options="doughnutChartOptions" class="h-30rem"/>
                </div>
            </div>
            <div class="col-6 flex flex-column gap-2 pl-2">
                <div class="p-2 mb-auto">
                    <DataTable :value="limitedData" class="p-datatable-sm">
                        <Column field="topic name" header="Tema" :sortable="true"></Column>
                        <Column field="number of words" header="Antal ord" :sortable="true"></Column>
                        <Column field="vocabulary size" header="Ordforråds Værdi" :sortable="true"></Column>
                        <Column field="score" header="Score" :sortable="true"></Column>
                    </DataTable>
                </div>
                <div class="p-2 mt-auto">
                    Edison har analyseret din tekst fundet de ti mest fremtrændende sematiske områder i din tekst
                </div>
                <div class="p-2 mt-auto">
                    Læs mere om hovedtemaer: -> &lt;link til skrive værksted&gt;
                </div>
            </div>
        </div>
        <div class="col-12 grid grid-nogutter surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvad er Semantiske felter?</span>
            Når man kommer midt ind i en samtale imellem to mennesker, skal
            man typisk lige orientere sig i, hvad der bliver talt om. Man forsøger at
            finde sammenhænge imellem de ord, der bliver brugt, så man kan
            finde ud af, hvad der bliver talt om.<br>
            I al god kommunikation opstår en sammenhængende betydning, fordi
            vi som afsender og modtager knytter ordene til hinanden.<br>
            Når vi hører ordene 'gris', 'ged', 'får', 'ko', 'høste', 'bondemand' opfatter
            vi straks, at de danner en betydningsmæssig sammenhæng; ordene
            kan alle kategoriseres under feltet eller scenariet 'landbrug' eller
            'bondeliv.<br>
            Langt de fleste substantiver og verber tilhører således semantiske
            felter, og det er netop derfor, at betydning og mening opstår. Hvis ord
            ikke kunne grupperes i semantiske felter, så får man en tekst, der er
            temmelig umulig at finde rundt i.<br>
            At kigge på semantiske felter er en grundlæggende del af litteraturen i
            almindelighed, for herigennem får vi en klar forståelse af hvad
            historien handler om. Edison har analyseret dit manuskript og
            afdækket de semantiske hovedområder. Brug analysen i dit
            redaktionelle arbejde til for eksempel at vurdere om det er det, du
            ønsker, der rent faktisk fylder i dit manuskript
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke i nu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
