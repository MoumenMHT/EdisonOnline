<script setup lang="ts">
import { ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chart from "primevue/chart";
import { ChartService } from "@service/chart.service.ts";
import { ManuscriptRevision } from "@interface/Manuscript.ts";
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";
import { translateTempoMetric } from "@util/translate.ts";

interface ITempoPartsChunk {
    chunk_id: number;
    chunk_is_fast: number;
    one_part: number;
    part: number;
    slut: number;
    start: number;
}

interface ITempoParts {
    chunks: ITempoPartsChunk
}

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()

const globalTempoData = ref(props.modelData.find(x => x.model === ModelResultDataModelEnum.Tempo && x.section === 'global')?.content);
const partsTempoData = ref<ITempoParts[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Tempo && x.section === 'parts')?.content);
const valid = ref(true);
const tableData = ref<any[]>([]);
const lineChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            data: [] as number[],
            fill: true,
            borderColor: ChartService.borderColor[0],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 0,
        },
    ]
});
const lineChartOptions = ChartService.getDefaultLineOptions({
    plugins: {
        legend: {
            display: false,
        },
    },
});

try {
    for (let gtd in globalTempoData.value) {
        if (gtd === 'action verbs count') {
            continue;
        }
        tableData.value.push({
            name: gtd,
            value: globalTempoData.value[gtd],
        });
    }

    for (const chunks of partsTempoData.value) {
        let chunk = chunks.chunks;
        lineChartData.value.labels.push(chunk.part.toString() + '%');
        lineChartData.value.datasets[0].data.push(chunk.chunk_is_fast);
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
                Tempo
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage />
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-12 flex flex-column gap-2">
                <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-20rem"/>
            </div>
            <div class="col-6 p-2">
                Grafen viser de plotmæssige højdepunkter…
            </div>
            <div class="col-6 flex flex-column pl-2">
                <div class="p-2 w-full mb-auto">
                    <DataTable :value="tableData" class="p-datatable-sm">
                        <Column header="Metric">
                            <template #body="slotProps">
                                {{ translateTempoMetric(slotProps.data.name) }}
                            </template>
                        </Column>
                        <Column field="value" header="Value"></Column>
                    </DataTable>
                </div>
                <div class="p-2 w-full mt-auto">
                    Læs mere om højdepunker: -> &lt;link til skrive værksted&gt;
                </div>
            </div>
        </div>
        <div class="col-12 grid grid-nogutter surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Er din bog en pageturner?</span>
            Tempoet henviser til en histories dynamik. Som forfatter er der tidspunkter, hvor vi ønsker, at læseren
            skal vende siderne hektisk, fordi der er så meget action med høj energi. Og der er tidspunkter, hvor vi
            ønsker at sætte tempoet ned, så læseren kan synke ned i siderne som i et varmt bad.
            Edison har analyseret din tekst, og grafen nedenfor viser de plotmæssige højdepunkter.
            En god historie har en blanding af hurtige og langsomme afsnit. Denne variation hjælper med at skabe
            spænding i historier, udvikle karaktererne, inkludere beskrivelser, drive historien fremad og frem for
            alt fastholde læsernes interesse.<br>
            Nu hvor Edison har hjulpet dig med at finde steder, der måske bevæger sig for langsomt i dit
            manuskript, eller måske hvor der sker alt for meget, kan du tænke over, hvordan du bedre kan
            afbalancere tempoet i din historie.<br>
            Du kan øge tempoet i historien ved at tilføre mere dialog, færres beskrivelser og mere action.
            Du kan sænke historiens tempo ved at øge antallet af beskrivelser og fjerne dialog og action.
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke i nu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
