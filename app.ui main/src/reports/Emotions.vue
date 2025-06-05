<script setup lang="ts">
import { ref } from "vue";
import { ChartService } from "@service/chart.service.ts";
import Chart from "primevue/chart";
import {ManuscriptRevision} from "@interface/Manuscript.ts";
import {ModelResultData} from "@interface/Model.ts";

defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()
const doughnutChartData = ref({
    labels: ['temp 1', 'temp 2','temp 3', 'temp 4','temp 5', 'temp 6','temp 7', 'temp 8'],
    datasets: [
        {
            data: [9.0669, 4.4952, 7.4335, 13.7446, 24.6344, 13.7539, 12.5317, 14.3398],
            backgroundColor: ChartService.backgroundColors,
            hoverBackgroundColor: ChartService.hoverBackgroundColors
        }
    ]
});
const chartOptions = ChartService.getDefaultDoughnutOptions();
</script>

<template>
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 font-medium text-2xl pb-2">
            Følelser
        </div>
        <div class="col-6">
            Hvad betyder det: ...
        </div>
        <div class="col-6 flex flex-column gap-2 pl-2">
            <div class="p-2 w-full">
                <Chart type="doughnut" :data="doughnutChartData" :options="chartOptions" class="w-full" />
                <span class="font-italic">Data'en vist i graph er kun temp data.</span>
            </div>
            <div class="p-2 mt-auto">
                Læs mere om følelser: -> &lt;link til skrive værksted&gt;
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
