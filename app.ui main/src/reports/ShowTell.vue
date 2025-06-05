<script setup lang="ts">
import { ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chart from 'primevue/chart';
import { chartDataSet, ChartService } from '@service/chart.service.ts';
import {
    IShowingTellingGlobal,
    IPartsShowingTelling,
    ISimilarBooksGlobal,
    IGenreClassificationGlobal, IAudienceClassificationGlobal
} from '@interface/Models.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import { ManuscriptService } from '@service/manuscript.service.ts';
import { RecommendationService } from '@service/recommendation.service.ts';
import { useMainStore } from '@store/main.ts';
import { ManuscriptRevision } from "@interface/Manuscript.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";
import { translateShowTellMetrics } from "@util/translate.ts";

interface IExtendedSimBooksData extends ISimilarBooksGlobal {
    loading?: boolean;
    data?: ModelResultData[]
}

const store = useMainStore();
const radarChart = ref<Chart | null>(null);

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()

const globalShowingTellingData = ref<IShowingTellingGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.ShowingTelling && x.section === 'global')?.content);
const partsShowingTellingData = ref<IPartsShowingTelling[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.ShowingTelling && x.section === 'parts')?.content);

const globalSimilarBooksData = ref<IExtendedSimBooksData[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.SimilarBooks)?.content);
const globalAudienceData = ref<IAudienceClassificationGlobal[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.AudienceClassification && x.section === 'global')?.content.sort((a, b) => b.score - a.score));
const globalGenreData = ref<IGenreClassificationGlobal[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.GenreClassification && x.section === 'global')?.content.sort((a, b) => b.score - a.score));

const valid = ref(true);
const RBEData = ref<string>('');
const notForTable = ['adjectives count', 'adverbs count', 'descriptive words count', 'filling words count'];
const tableData = ref<any[]>([]);
const percentageOfDescriptiveWords = ref(0);
const radarChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'Procent af beskrivene ord',
            borderColor: ChartService.backgroundColors[0],
            pointBackgroundColor: ChartService.backgroundColors[0],
            pointBorderColor: ChartService.backgroundColors[0],
            pointHoverBackgroundColor: ChartService.textColor,
            pointHoverBorderColor: ChartService.backgroundColors[0],
            data: [] as number[]
        },
        {
            label: 'Procent af fylde ord',
            borderColor: ChartService.backgroundColors[1],
            pointBackgroundColor: ChartService.backgroundColors[1],
            pointBorderColor: ChartService.backgroundColors[1],
            pointHoverBackgroundColor: ChartService.textColor,
            pointHoverBorderColor: ChartService.backgroundColors[1],
            data: [] as number[]
        }
    ] as chartDataSet[]
});
const radarChartOptions = ChartService.getDefaultRadarOptions({
    scales: {
        r: {
            suggestedMax: undefined,
        }
    }
});
const lineChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'Procent af beskrivene ord',
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
const lineChartOptions = ChartService.getDefaultLineOptions();

try {
    for (let gstd in globalShowingTellingData.value) {
        if (notForTable.includes(gstd)) {
            continue;
        }
        if (gstd === 'percentage of descriptive words') {
            percentageOfDescriptiveWords.value = globalShowingTellingData.value[gstd];
        }
        tableData.value.push({
            name: gstd,
            value: globalShowingTellingData.value[gstd],
        });
    }

    for (const chunks of partsShowingTellingData.value) {
        let chunk = chunks.chunks;
        lineChartData.value.labels.push(chunk.part.toString() + '%');
        lineChartData.value.datasets[0].data.push(chunk['percentage of descriptive words'] * 100);
    }

    const percentDesciptiveWordsDataset: number[] = [(globalShowingTellingData.value['percentage of descriptive words'] * 100)];
    const percentFillingWordsDataset: number[] = [(globalShowingTellingData.value['percentage of filling words'] * 100)];
    const radarChartLabels: string[] = ['Din bog'];
    radarChartData.value.labels.push(radarChartLabels[0]);
    radarChartData.value.datasets[0].data.push(percentDesciptiveWordsDataset[0]);
    radarChartData.value.datasets[1].data.push(percentFillingWordsDataset[0]);

    for (const simBook of globalSimilarBooksData.value) {
        const simBookReq = ManuscriptService.getSimilarBooksData(
            simBook.ISBN,
            [ModelResultDataModelEnum.ShowingTelling],
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
                    const simBookShowTell: IShowingTellingGlobal = currentSimBook.data[0].content;

                    percentDesciptiveWordsDataset.push(simBookShowTell['percentage of descriptive words'] * 100);
                    percentFillingWordsDataset.push(simBookShowTell['percentage of filling words'] * 100);
                    radarChartLabels.push(simBook.title);

                    if (!globalSimilarBooksData.value.some((simbook: IExtendedSimBooksData) => simbook.loading)
                        && radarChart.value !== null
                        // If we do not check for length we get a error. Still not sure why.
                        && radarChartLabels.length === globalSimilarBooksData.value.length + 1
                    ) {
                        radarChartData.value.labels = radarChartLabels;
                        radarChartData.value.datasets[0].data = percentDesciptiveWordsDataset;
                        radarChartData.value.datasets[1].data = percentFillingWordsDataset;
                        radarChart.value.refresh();
                    }
                }
            } catch (e) {
                valid.value = false;
                console.error('Unhandled error:', e);
            }
        });
    }

    // RBE - beregnet genre & audience.
    const topGenre = globalGenreData.value[0];
    const topAudience = globalAudienceData.value[0];
    const genreId = store.getGenreId(topGenre.class);
    const audienceId = store.getAudienceId(topAudience.class);

    const RBEReq = RecommendationService.getRecommendation(2, genreId, audienceId, globalShowingTellingData.value['percentage of descriptive words']);
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
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">
                Show/Tell
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage />
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-12">
                <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-20rem"/>
            </div>
            <div class="col-6" style="height: 30rem">
                <Chart type="radar" :data="radarChartData" :options="radarChartOptions" class="h-full w-full" ref="radarChart"/>
            </div>
            <div class="col-6 flex flex-column pt-4">
                <div class="p-2 w-full">
                    <DataTable :value="tableData" class="p-datatable-sm">
                        <Column header="Metric">
                            <template #body="slotProps">
                                {{ translateShowTellMetrics(slotProps.data.name) }}
                            </template>
                        </Column>
                        <Column field="value" header="Value"></Column>
                    </DataTable>
                </div>
                <div class="p-2 w-full">
                    {{ RBEData }}
                </div>
                <div class="p-2 mt-auto">
                    Læs mere om show/tell: -> &lt;link til skrive værksted&gt;
                </div>
            </div>
        </div>
        <div class="col-12 grid grid-nogutter surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Show it - dont tell it.</span>
            Et af de råd en forfatter oftest vil få, er at ”vise” fremfor
            at ”fortælle” (showing vs telling bruges ofte også på
            dansk). Hvis du synes det er svært at gøre – og ikke
            mindst at forstå forskellen, så kan du læse mere her.
            Der findes flere afslørende indikatorer i et manuskript
            på ,at du i højere grad kommer til at beskrive, hvad der
            sker og hvad dine personer foretager sig frem for at vise
            det. Hvis du bruger alt for mange tillægsord, i for høj
            grad bruger generelle beskrivelser eller har en svag
            dialog, er du godt på vej til at lulle din læser i søvn. Men
            vær blot rolig: Edison har analyseret dit manuskript og
            hjælper dig med at identificere de steder, hvor du er
            faldet i, så du kan skrive om og holde dine læsere
            engagerede og få dem til at leve sig ind i historien.
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke i nu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
