<script setup lang="ts">
import { ref, watch } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Chart from "primevue/chart";
import { chartDataSet, ChartService } from "@service/chart.service.ts";
import { IDialogueGlobal, ISimilarBooksGlobal } from "@interface/Models.ts";
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import { ManuscriptService } from "@service/manuscript.service.ts";
import {ManuscriptRevision} from "@interface/Manuscript.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";
import { translateDialogueMetric } from "@util/translate.ts";

interface IExtendedSimBooksData extends ISimilarBooksGlobal {
    loading?: boolean;
    data?: ModelResultData[]
}
const radarChart = ref<Chart | null>(null);
const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()

const globalDialogueData = ref<IDialogueGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Dialogue && x.section === 'global')?.content);
const globalSimilarBooksData = ref<IExtendedSimBooksData[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.SimilarBooks)?.content);

const notForTable = ['adverbs count', 'categories count', 'verbs count'];
const tableData = ref<any[]>([]);
const percentParagraphsWithDialogsDataset: number[] = [];
const percentSayOrAskDataset: number[] = [];
const radarChartLabels: string[] =['Din bog'];
const radarChartData = ref({
    labels: [] as string[],
    datasets: [] as chartDataSet[],
});
const radarChartOptions = ChartService.getDefaultRadarOptions();
const valid = ref(true);

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

    percentParagraphsWithDialogsDataset.push(((globalDialogueData.value['percentage of paragraphs with dialogues']??0) * 100));
    percentSayOrAskDataset.push((globalDialogueData.value["percentage of 'sige' or 'spørge'"] * 100));
    radarChartData.value.labels.push('Din bog');
    radarChartData.value.datasets.push({
            label: 'percentage of paragraphs with dialogues',
            borderColor: ChartService.backgroundColors[0],
            pointBackgroundColor: ChartService.backgroundColors[0],
            pointBorderColor: ChartService.backgroundColors[0],
            pointHoverBackgroundColor: ChartService.textColor,
            pointHoverBorderColor: ChartService.backgroundColors[0],
            data: [((globalDialogueData.value['percentage of paragraphs with dialogues']??0) * 100)]
        },
        {
            label: "percentage of 'sige' or 'spørge'",
            borderColor: ChartService.backgroundColors[1],
            pointBackgroundColor: ChartService.backgroundColors[1],
            pointBorderColor: ChartService.backgroundColors[1],
            pointHoverBackgroundColor: ChartService.textColor,
            pointHoverBorderColor: ChartService.backgroundColors[1],
            data: [(globalDialogueData.value["percentage of 'sige' or 'spørge'"] * 100)]
        })

    for (const simBook of globalSimilarBooksData.value) {
        const simBookReq = ManuscriptService.getSimilarBooksData(
            simBook.ISBN,
            [ModelResultDataModelEnum.Dialogue],
            ['global']
        );
        const currentSimBook = globalSimilarBooksData.value.find(sim => sim.ISBN === simBook.ISBN);
        if (currentSimBook !== undefined) {
            currentSimBook.loading = true;
        }
        watch(simBookReq.data, (value) => {
            try {
                const currentSimBook: IExtendedSimBooksData | undefined = globalSimilarBooksData.value.find(sim => sim.ISBN === simBook.ISBN);
                if (currentSimBook !== undefined && value !== null) {
                    currentSimBook.data = value;
                    currentSimBook.loading = false;

                    // We know there is only one since we only ask for one.
                    const simBookShowTell: IDialogueGlobal = currentSimBook.data[0].content;

                    percentParagraphsWithDialogsDataset.push((simBookShowTell['percentage of paragraphs with dialogues']??0) * 100);
                    percentSayOrAskDataset.push(simBookShowTell["percentage of 'sige' or 'spørge'"] * 100);
                    radarChartLabels.push(simBook.title);

                    if (!globalSimilarBooksData.value.some((simbook: IExtendedSimBooksData) => simbook.loading)
                        && radarChart.value !== null
                        // If we do not check for length we get a error. Still not sure why.
                        && radarChartLabels.length === globalSimilarBooksData.value.length + 1
                    ) {
                        radarChartData.value.labels = radarChartLabels;
                        radarChartData.value.datasets[0].data = percentParagraphsWithDialogsDataset;
                        radarChartData.value.datasets[1].data = percentSayOrAskDataset;
                    }
                }
            } catch (e) {
                valid.value = false;
                console.error('Unhandled error:', e);
            }
        });
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">Dialog</div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage />
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-6 flex flex-column gap-2" style="height: 30rem">
                <Chart type="radar" :data="radarChartData" :options="radarChartOptions" class="h-full w-full" ref="radarChart" />
            </div>
            <div class="col-6 flex flex-column gap-2 pl-2">
                <div class="p-2 mb-auto w-full">
                    <DataTable :value="tableData" class="p-datatable-sm">
                        <Column header="Metric">
                            <template #body="slotProps">
                                {{ translateDialogueMetric(slotProps.data.name) }}
                            </template>
                        </Column>
                        <Column field="value" header="Value"></Column>
                    </DataTable>
                </div>
                <div class="p-2 mt-auto">
                    Læs mere om dialog: -> &lt;link til skrive værksted&gt;
                </div>
            </div>
        </div>
        <div class="col-12 grid grid-nogutter surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Den gode dialog er afgørende!</span>
            Uanset hvilken genre du skriver i, er det en vigtig del af enhver forfatters uddannelse at
            lære at skrive en effektiv dialog. Dårlig dialog kan få dine læserne til at lægge bogen fra sig
            – mens en god dialog kan forvandle dine karakterer til levende, troværdige
            personer og dine læsere til tilfredse kunder.
            Selvfølgelig er den bedste dialog ikke bare troværdig. Den indeholder også
            ekspositioner, differentierer sprogbrug afhængigt af, hvem der taler, og - måske mest
            afgørende - bringer dialogen din historie videre. Uden dialog ville du bare have side op og side ned
            med beskrivelser uden nogen som helst karakterdynamik eller drama mellem dine
            personer. Hvor kedeligt ville det ikke være?
            Fordi dialog er en af de vigtigste komponenter i en stærk skrivning, vil Edison gerne hjælpe
            dig med at få den helt rigtig. Du kan derfor læse meget mere om dialog i denne
            artikelserie om god dialog.(link)
            Jeg har fundet en række dialog indikatorer i din tekst og sammenlignet den med
            bestsellere i samme genre. Du kan se resultatet nedenfor.
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke i nu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
