<script setup lang="ts">
import Knob from "primevue/knob";
import Chart from "primevue/chart";
import { ref } from "vue";
import { ManuscriptRevision } from "../src/interfaces/Manuscript";
const manuscript = ref<ManuscriptRevision>(<ManuscriptRevision>{
    audience: "",
    created: new Date(),
    genre: "",
    id: "",
    progress: {},
    title: ""
});

const pieChartData = ref();
const pieChartOptions = ref({
    plugins: {
        legend: {
            labels: {
                usePointStyle: true
            }
        }
    }
});

const setPieChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [540, 325, 702],
                backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
            }
        ]
    };
};

const polarChartData = ref();
const polarChartOptions = ref();

const setPolarChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        datasets: [
            {
                data: [11, 16, 7, 3, 14],
                backgroundColor: [
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--yellow-500'),
                    documentStyle.getPropertyValue('--bluegray-500'),
                    documentStyle.getPropertyValue('--blue-500')
                ],
                label: 'My dataset'
            }
        ],
        labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue']
    };
};
const setPolarChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}

pieChartData.value = setPieChartData();
polarChartData.value = setPolarChartData();
polarChartOptions.value = setPolarChartOptions();
</script>

<template>
    <div class="col-12 border-1 surface-border surface-card border-round grid m-0">
        <div class="col">
            <div class="text-2xl font-bold text-900">
                {{ manuscript.title }}
            </div>
            <div>
                {{ manuscript.title }}
            </div>
        </div>
        <div class="col">
            <div class="flex align-items-center justify-content-end">
                <div class="flex align-items-center flex-column">
                    <span>Edison her analyseret din bog.</span>
                    <span>Din samlet score er:</span>
                    <Knob v-model="manuscript.progress.globalScore" readonly :strokeWidth="5" :max="100"/>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12 border-1 surface-border surface-card border-round flex justify-content-start">
        <Chart type="pie" :data="pieChartData" :options="pieChartOptions" class="w-full md:w-30rem"/>
        <div class="flex flex-column">
            <span class="text-2xl font-bold text-900">Header</span>
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut sodales urna. Ut cursus orci id libero efficitur molestie. Phasellus interdum ante quis turpis luctus consectetur. Nunc dolor dolor, rhoncus vitae rutrum vel, dapibus nec nibh. Ut et purus id ligula molestie condimentum at vitae purus. Mauris pharetra viverra turpis, eget volutpat massa congue vel. Nullam urna libero, euismod et lorem a, finibus semper metus. Fusce a ligula sagittis, viverra odio ultrices, pulvinar risus. Suspendisse mollis, nulla quis suscipit consequat, quam neque sodales sapien, quis malesuada ipsum massa vitae felis. Curabitur eu dictum nulla. Donec et auctor ligula. Etiam quis enim suscipit, consequat erat quis, ultrices erat. Pellentesque non ex in lectus ultricies vestibulum.</span>
        </div>
    </div>
    <div class="col-12 border-1 surface-border surface-card border-round flex justify-content-start">
        <Chart type="polarArea" :data="polarChartData" :options="polarChartOptions" class="w-full md:w-30rem"/>
        <div class="flex flex-column">
            <span class="text-2xl font-bold text-900">Header</span>
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut sodales urna. Ut cursus orci id libero efficitur molestie. Phasellus interdum ante quis turpis luctus consectetur. Nunc dolor dolor, rhoncus vitae rutrum vel, dapibus nec nibh. Ut et purus id ligula molestie condimentum at vitae purus. Mauris pharetra viverra turpis, eget volutpat massa congue vel. Nullam urna libero, euismod et lorem a, finibus semper metus. Fusce a ligula sagittis, viverra odio ultrices, pulvinar risus. Suspendisse mollis, nulla quis suscipit consequat, quam neque sodales sapien, quis malesuada ipsum massa vitae felis. Curabitur eu dictum nulla. Donec et auctor ligula. Etiam quis enim suscipit, consequat erat quis, ultrices erat. Pellentesque non ex in lectus ultricies vestibulum.</span>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
