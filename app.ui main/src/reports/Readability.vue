<script setup lang="ts">
import { ref, watch } from "vue";
import Chart from "primevue/chart";
import { ChartService } from "@service/chart.service.ts";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { IAudienceClassificationGlobal, IGenreClassificationGlobal, ILegibilityGlobal, ILegibilityParts } from "@interface/Models.ts";
import { RecommendationService } from "@service/recommendation.service.ts";
import { useMainStore } from '@store/main.ts';
import { ManuscriptRevision } from "@interface/Manuscript.ts";
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";
import { translateReadabilityMetric } from "@util/translate.ts";

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()
const store = useMainStore();
const globalLegibilityData = ref<ILegibilityGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Legibility && x.section === 'global')?.content);
const partsLegibilityData = ref<ILegibilityParts[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Legibility && x.section === 'parts')?.content);
const globalGenreData = ref<IGenreClassificationGlobal[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.GenreClassification && x.section === 'global')?.content.sort((a, b) => b.score - a.score));
const globalAudienceData = ref<IAudienceClassificationGlobal[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.AudienceClassification && x.section === 'global')?.content.sort((a, b) => b.score - a.score));

const RBEData = ref<string>('');
const valid = ref(true);

const notForTable = ['chunk_id', 'chunk_in_paragraph_id', 'lexicon'];
const tableData = ref<any[]>([]);
const lineChartOptions = ChartService.getDefaultLineOptions();
const lineChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'avergage sentence length',
            data: [] as number[],
            fill: false,
            backgroundColor: ChartService.backgroundColors[0],
            borderColor: ChartService.hoverBackgroundColors[0],
            borderWidth: 2,
            pointRadius: 1,
        },
        {
            label: 'LIX',
            data: [] as number[],
            fill: false,
            backgroundColor: ChartService.backgroundColors[1],
            borderColor: ChartService.hoverBackgroundColors[1],
            borderWidth: 2,
            pointRadius: 1,
        }
    ]
});

try {
    for (const content of partsLegibilityData.value) {
        // We only use first chunk in this.
        const chunk = content.chunks;
        lineChartData.value.labels.push(chunk.part.toString() + '%');
        lineChartData.value.datasets[0].data.push(chunk['average sentence length']);
        lineChartData.value.datasets[1].data.push(chunk.LIX);
    }

    for (let gstd in globalLegibilityData.value) {
        if (notForTable.includes(gstd)) {
            continue;
        }
        tableData.value.push({
            name: gstd,
            value: globalLegibilityData.value[gstd],
        });
    }
// RBE - beregnet genre & audience.
    const topGenre = globalGenreData.value[0];
    const topAudience = globalAudienceData.value[0];
    const genreId = store.getGenreId(topGenre.class);
    const audienceId = store.getAudienceId(topAudience.class);

    const RBEReq = RecommendationService.getRecommendation(1, genreId, audienceId, globalLegibilityData.value.LIX)

    watch(RBEReq.data, (value) => {
        if (value) {
            RBEData.value = value.message;
        }
    });
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="grid grid-nogutter w-full p-3 relative">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">
                Læsbarhed
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage/>
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-12">
                <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-20rem w-full"/>
            </div>
            <div class="col-6 flex flex-column gap-2">
                <div class="p-2 w-full">
                    <DataTable :value="tableData" class="p-datatable-sm">
                        <Column header="Metric">
                            <template #body="slotProps">
                                {{ translateReadabilityMetric(slotProps.data.name) }}
                            </template>
                        </Column>
                        <Column field="value" header="Value"></Column>
                    </DataTable>
                </div>
            </div>
            <div class="col-6 flex flex-column gap-2 pl-2">
                <div class="p-2">
                    <span class="font-semibold text-lg">Edison har analyseret dit manuskript.</span><br>
                    Her er en anbefaling baseret på LIX<br>
                    {{ RBEData }}
                </div>
                <div class="p-2 mt-auto">
                    Læs mere om læsbarhed: -> &lt;link til skrive værksted&gt;
                </div>
            </div>
        </div>
        <div class="col-12 grid grid-nogutter surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvad betyder læsbarhed?</span>
            Den første forudsætning for at få formidlet et skriftligt budskab er at teksten er målrettet til
            dem der skal læse den. Derfor har jeg analyseret din tekst og beregnet flere forskellige mål på
            din teksts læsbarhed i forhold til den genre og målgruppe, som du har angivet at du skriver i og
            til.<br>
            <br>
            <span class="font-semibold text-lg">Hvad betyder lixtallet?</span>
            Lix er et enkelt tal, der fortæller, hvor let eller svær din tekst er at
            læse. Det bygger på en simpel udregning. Længden af den samlede
            tekst, antallet af sætninger og mængden af lange ord (mere end 6
            bogstaver).<br>
            &lt; 24 = Let tekst for alle læsere Børnelitteratur<br>
            25 – 34 = Let for øvede læsere Ugeblade og skønlitteratur<br>
            35 – 44 = Middel læsevenlighed Dagblade og tidsskrifter<br>
            45 – 54 = Svær at læse Populærvidenskab, saglige bøger og akademiske udgivelser<br>
            &gt; 55 = Meget svær at læse Lovtekster og akademisk faglitteratur<br>
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke i nu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
