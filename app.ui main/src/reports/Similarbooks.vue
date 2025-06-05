<script setup lang="ts">
import { ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chart from 'primevue/chart';
import { chartDataSet, ChartService } from '@service/chart.service.ts';
import { ManuscriptService } from '@service/manuscript.service.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import { IArchetypesContent, IDialogueGlobal, IGenreClassificationGlobal, IGlobalAnalyzedContent, ILegibilityGlobal, ISimilarBooksGlobal } from '@interface/Models.ts';
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import ModelErrorMessage from '@component/modelErrorMessage.vue';

interface IExtendedSimBooksData extends ISimilarBooksGlobal {
    loading?: boolean;
    data?: ModelResultData[]
}

const radarChart = ref<Chart | null>(null);
const color = ChartService.hoverBackgroundColors[0];

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>();

const globalUserData = ref<IGlobalAnalyzedContent>(props.modelData.find(x => x.model === ModelResultDataModelEnum.GlobalUser)?.content);
const globalSimilarBooksData = ref<IExtendedSimBooksData[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.SimilarBooks)?.content);
const globalGenreData = ref<IGenreClassificationGlobal[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.GenreClassification && x.section === 'global')?.content);
const globalDialogueData = ref<IDialogueGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Dialogue && x.section === 'global')?.content);
const globalLegibilityData = ref<ILegibilityGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Legibility && x.section === 'global')?.content);
const highestArchetype = ref(props.modelData.filter(x => x.model === ModelResultDataModelEnum.Archetypes && x.section === 'global')[0]?.content);

const chartOptions = ChartService.getDefaultRadarOptions();
const chartData = ref({
    labels: ['Genre', 'Global score', 'LIX', 'Arketype', 'Dialog'],
    datasets: [] as chartDataSet[],
});

const valid = ref(true);


try {
    
    const bestFittingGenre: string = globalGenreData.value.sort((a, b) => b.score - a.score)[0].class;

    const getGenreData = (genre: string, data: IGenreClassificationGlobal[]): number => {
        if (data === undefined) {
            return 0;
        }
        return (data.find(x => x.class === genre)?.score ?? 0) * 100;
    }

    const curBookData: number[] = [];
// Genre
    curBookData.push(getGenreData(bestFittingGenre, globalGenreData.value));
// Global score
    curBookData.push(globalUserData.value.score);
// Læsbarhed - LIX
    curBookData.push(globalLegibilityData.value.LIX);
// Archetype
    if (highestArchetype.value.global?.best_archetype_score) {
        curBookData.push(highestArchetype.value.global.best_archetype_score * 100);
    }
    else {
        curBookData.push(0);
    }
// Dialog - percentage of paragraphs with dialogues
    curBookData.push((globalDialogueData.value['percentage of paragraphs with dialogues']??0) * 100);

    chartData.value.datasets.push({
        ISBN: 0,
        label: 'Din bog',
        borderColor: color,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointHoverBackgroundColor: ChartService.textColor,
        pointHoverBorderColor: color,
        data: curBookData
    });

    for (const simBook of globalSimilarBooksData.value) {
        const simBookReq = ManuscriptService.getSimilarBooksData(
            simBook.ISBN,
            [
                ModelResultDataModelEnum.GenreClassification, 
                ModelResultDataModelEnum.GlobalUser, 
                ModelResultDataModelEnum.Dialogue, 
                ModelResultDataModelEnum.Archetypes, 
                ModelResultDataModelEnum.Legibility
            ],
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

                    const simchartData = chartData.value.datasets.find(x => x.ISBN === simBook.ISBN);
                    if (radarChart.value !== null && simchartData !== undefined) {
                        const curSimBookData: number[] = [];

                        const simbookUserData = ref<IGlobalAnalyzedContent>(currentSimBook.data.find(x => x.model === 'GlobalUser')?.content);
                        const simbookGenreData = ref<IGenreClassificationGlobal[]>(currentSimBook.data.find(x => x.model === 'GenreClassification')?.content);
                        const simbookDialogueData = ref<IDialogueGlobal>(currentSimBook.data.find(x => x.model === 'Dialogue')?.content);
                        const simbookArchetypesData = ref<IArchetypesContent>(currentSimBook.data.find(x => x.model === 'Archetypes')?.content);
                        const simbookLegibilityData = ref<ILegibilityGlobal>(currentSimBook.data.find(x => x.model === 'Legibility')?.content);

                        // Genre
                        curSimBookData.push(getGenreData(bestFittingGenre, simbookGenreData.value));
                        // Global score
                        curSimBookData.push(simbookUserData.value.score);
                        // Læsbarhed - LIX
                        curSimBookData.push(simbookLegibilityData.value.LIX);
                        // Archetype
                        const simbookArchetype = simbookArchetypesData.value.global[highestArchetype.value.global.best_archetype_name];
                        if (simbookArchetype !== undefined) {
                            curSimBookData.push(simbookArchetype * 100);
                        }
                        else {
                            curSimBookData.push(0);
                        }
                        // Dialog - percentage of paragraphs with dialogues
                        curSimBookData.push((simbookDialogueData.value['percentage of paragraphs with dialogues']??0) * 100);

                        simchartData.data = curSimBookData;

                        if (!globalSimilarBooksData.value.some((simbook: IExtendedSimBooksData) => simbook.loading)) {
                            radarChart.value.refresh();
                        }
                    }
                }
            }
            catch (e) {
                valid.value = false;
                console.error('Unhandled error:', e);
            }
        });
    }

    for (let i = 0; i < globalSimilarBooksData.value.length; i++) {
        const simbook = globalSimilarBooksData.value[i];
        const color = ChartService.hoverBackgroundColors[i + 1];

        chartData.value.datasets.push({
            ISBN: simbook.ISBN,
            label: simbook.title,
            borderColor: color,
            pointBackgroundColor: color,
            pointBorderColor: color,
            pointHoverBackgroundColor: ChartService.textColor,
            pointHoverBorderColor: color,
            data: []
        });
    }
    
    // chartData.value.datasets.push(chartDataSet);
    
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="grid grid-nogutter w-full p-3 col-12">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">
                Lignende bøger
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage/>
        </div>
        <div v-if="valid" class="grid grid-nogutter col-12">
            <div class="col-6" style="height: 30rem">
                <Chart type="radar" :data="chartData" :options="chartOptions" class="w-full h-full flex flex-column flex-grow-1 align-items-center" ref="radarChart" />
            </div>
            <div class="col-6 flex flex-column gap-2 pl-2">
                <DataTable :value="globalSimilarBooksData" class="p-datatable-sm">
                    <Column field="ISBN" header="ISBN">
                        <template #body="slotProps">
                            <router-link :to="{ name: 'similarbook', params: { isbn: slotProps.data.ISBN }}">{{ slotProps.data.ISBN }}</router-link>
                        </template>
                    </Column>
                    <Column field="author" header="Forfatter"></Column>
                    <Column field="title" header="Titel"></Column>
                </DataTable>
            </div>
        </div>
        <div class="col-12 surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvordan sammenlignes med andre bøger?</span><br>
            Edison har i sit bibliotek fundet bøger, der på forskellige områder har ligheder med din.
            Edison sammenligner bøger baseret på Global score, genre, dialog, arketype og læsbarhed.
            Det er interessant, at vide, hvilke bøger, der minder om din af flere årsager.
            Det kan blandt andet hjælpe dig med, at finde frem til de forlag, der har interesse i bøger som din
            og det kan hjælpe dig med at tilrette din markedsføring mod de rigtige læsere.
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke i nu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
