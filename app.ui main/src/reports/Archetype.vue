<script setup lang="ts">
import { ref, watch } from 'vue';
import Chart from 'primevue/chart';
import { chartDataSet, ChartService } from '@service/chart.service.ts';
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import {
    IArchetypesContent,
    IAudienceClassificationGlobal,
    IGenreClassificationGlobal,
    ISimilarBooksGlobal
} from '@interface/Models.ts';
import { ManuscriptService } from '@service/manuscript.service.ts';
import ModelErrorMessage from '@component/modelErrorMessage.vue';
import { RecommendationService } from "@service/recommendation.service.ts";
import { IRecommendationResponse } from '@interface/Recommendation.ts';

interface IExtendedSimBooksData extends ISimilarBooksGlobal {
    loading?: boolean;
    data?: ModelResultData[]
}
 
const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>();
const archetypeData = ref<IArchetypesContent>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Archetypes)?.content);
const genreData = ref<IGenreClassificationGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.GenreClassification && x.section === 'global')?.content.sort((a,b) => b.score - a.score));
const audienceData = ref<IAudienceClassificationGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.AudienceClassification && x.section === 'global')?.content.sort((a, b) => b.score - a.score));
const globalSimilarBooksData = ref<IExtendedSimBooksData[]>(props.modelData.find(x => x.model === ModelResultDataModelEnum.SimilarBooks)?.content);

const topAudience: IAudienceClassificationGlobal = audienceData.value[0];
const topGenre: IGenreClassificationGlobal = genreData.value[0];

const RBEData = ref<string>();

const lineChart = ref<Chart | null>(null);
const lineChartData = ref({
    datasets: [] as chartDataSet[]
});
const lineChartOptions = ChartService.getDefaultLineOptions();

const color = ChartService.borderColor[0];
const radarChart = ref<Chart | null>(null);
const radarChartData = ref({
    labels: [] as string[],
    datasets: [{
        label: 'Bedste arketype',
        borderColor: color,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointHoverBackgroundColor: ChartService.textColor,
        pointHoverBorderColor: color,
        data: []
    }] as chartDataSet[]
});
const radarChartOptions = ChartService.getDefaultRadarOptions();

// Validete data is correct.
const valid = ref(true);
try {
    const bestArchetypeName = archetypeData.value.global.best_archetype_name;
    const radarChartDatasetData: number[] = [];

    const lineDataSet: chartDataSet = {
        label: 'Din bog',
        data: [],
        borderColor: color,
    }
    for (const part of archetypeData.value.parts) {
        const chunk = part.chunks;
        lineDataSet.data.push({
            x: chunk.part.toString() + '%',
            y: (chunk[bestArchetypeName] * 100),
        });
    }

    lineChartData.value.datasets.push(lineDataSet);
    radarChartData.value.labels.push('Din bog');
    radarChartDatasetData.push(archetypeData.value.global.best_archetype_score*100);

    for (const simBook of globalSimilarBooksData.value) {
        const simBookReq = ManuscriptService.getSimilarBooksData(
            simBook.ISBN,
            [ModelResultDataModelEnum.Archetypes]
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

                    const simBookArcheType = currentSimBook.data[0].content;
                    const index = globalSimilarBooksData.value.findIndex(sim => sim.ISBN === simBook.ISBN);
                    const color = ChartService.borderColor[index + 1];
                    const dataSet: chartDataSet = {
                        label: simBook.title,
                        data: [],
                        borderColor: color,
                        hidden: true,
                    }

                    for (const part of simBookArcheType.parts) {
                        const chunk = part.chunks;
                        dataSet.data.push({
                            x: chunk.part.toString() + '%',
                            y: (chunk[bestArchetypeName] * 100),
                        });
                    }

                    lineChartData.value.datasets.push(dataSet);
                    radarChartData.value.labels.push(simBook.title);
                    radarChartDatasetData.push(simBookArcheType.global.best_archetype_score * 100);

                    if (!globalSimilarBooksData.value.some((simbook: IExtendedSimBooksData) => simbook.loading)
                        && radarChart.value !== null
                        // If we do not check for length we get a error. Still not sure why.
                        && radarChartData.value.labels.length === globalSimilarBooksData.value.length + 1
                    ) {
                        radarChartData.value.datasets[0].data = radarChartDatasetData;
                        radarChart.value.refresh();
                    }
                }
            } 
            catch (e) {
                valid.value = false;
                console.error('Unhandled error:', e);
            }
        });
    }
    const RBERequest = RecommendationService.getRecommendation(6, topGenre.class, topAudience.class, archetypeData.value.global.best_archetype_score);

    watch(RBERequest.data, (value) => {
        if (value) {
            // todo - find a better solution for this.
            const stuff = value as IRecommendationResponse;
            RBEData.value = stuff.message;
        }
    });
}
catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
</script>
<template>
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">
                Arketype
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage />
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-12">
                <Chart type="line" :options="lineChartOptions" :data="lineChartData" class="h-20rem" ref="lineChart"/>
            </div>
            <div class="col-5" style="height: 30rem">
                <Chart type="radar" :data="radarChartData" :options="radarChartOptions" class="h-full" ref="radarChart" />
            </div>
            <div class="col-7 flex flex-column gap-2 pl-2">
                <div class="pb-4">
                    <span class="font-semibold text-lg">Edison har analyseret dit manuskript.</span><br>
                    {{ RBEData }}
                </div>
                <div class="w-full">
                    Grafen viser stemningsprofilen i hele dit manus og ligne bøger,
                    og de større plotmæssige ændringer forkommer,
                    når kurven bevæger sig over eller under den stiplede neutrale linje
                </div>
                <div class="p-2 w-full mt-auto">
                    Læs mere om arketyper: -> &lt;link til skrive værksted&gt;
                </div>
            </div>
        </div>
        <div class="col-12 grid grid-nogutter surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Historier, som læserne elsker.</span>
            Analyser har vist at alle at, de historier, som læsere elsker højest og som derfor oftest bliver
            bestsellere kan inddeles i seks forskellige arketyper. Jo tættere din historie ligger
            på en af de seks originale arketyper, jo større er
            sandsynligheden for at den falder i mange læseres smag. At din historie
            tilhører en bestemt arketype er ikke det samme som at den ikke er original. På
            samme måde som at alle sko er bygget over samme læst, selv om der findes
            millioner af forskellige sko, kan man sige, at succesfulde historier er bygget på
            nogle få forskellige emotionelle arketyper. Så vidt forskellige historier som
            Den grimme ælling og Citizen Kane er bygget på samme arketype (Rags to
            riches), men der er næppe nogen, der vil påstå, at de ikke hver især er originale.
            Så en stærk arketype er med til at formidle dit budskab, involvere dine læsere
            og vil sandsynligvis betyde, at din bog får bedre anmeldelser og større succes.
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke i nu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
