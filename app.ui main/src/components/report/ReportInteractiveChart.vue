<script setup lang="ts">
    import {ref} from 'vue';
    import Chart from 'primevue/chart';
    import Dialog from "primevue/dialog";
    import { ChartData, ChartOptions } from 'chart.js';

    export interface ChartMetadataElement {
        text: string[]
    }

    export interface ChartMetadataSet {
        data: ChartMetadataElement[]
    }

    export interface ChartMetadata {
        datasets: ChartMetadataSet[]
    }

    const props = defineProps<{
        chartType: string,
        chartData: ChartData,
        chartOptions: ChartOptions
        chartCssClass: string
        chartMetadata?: ChartMetadata
        findNearestDataPoint?: boolean
    }>();

    const myChart = ref();
    const textDialog = ref(false);
    const selectedText = ref<string[]>([]);

    function onChartClick(event: MouseEvent) {
        var chart = myChart.value?.getChart();
        if (!chart) return;

        var activeElements = chart.getActiveElements();
        var selectedElement = activeElements.length ? activeElements[0] : null;
        
        if (!selectedElement && props.findNearestDataPoint) {
            const nearestElements = chart.getElementsAtEventForMode(
                event,
                'nearest', // Find the nearest point
                { intersect: false }, // Allow points near the click, not just intersecting
                false
            );
            selectedElement = nearestElements.length ? nearestElements[0] : null;
        }

        if (selectedElement) {
            const dataIndex = selectedElement.index;
            const dataSetIndex = selectedElement.datasetIndex;

            if (props.chartMetadata) {
                var chartMetadataElement: ChartMetadataElement = props.chartMetadata.datasets[dataSetIndex].data[dataIndex];
                selectedText.value = chartMetadataElement ? chartMetadataElement.text : [];
                textDialog.value = true;
            }
        }
    };
</script>

<template>
    <div class="chart-wrapper">
        <Chart ref="myChart" :type="chartType" :data="chartData" :options="chartOptions" @click="onChartClick" :class="chartCssClass" />
        <Dialog v-model:visible="textDialog" modal dismissable-mask header="Info" :style="{ width: '50vw'}"
            :pt="{
                headerTitle: {
                    style: {
                        color: '#E4B200',
                    }
                }
            }">
            <p v-for="(text, index) in selectedText" :key="index">
                {{ text }}
            </p>
        </Dialog>
    </div>
</template>