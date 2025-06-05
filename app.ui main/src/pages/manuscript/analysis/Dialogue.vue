<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import Tips from '@component/report/reportTips.vue';
import Articles from '@component/report/reportArticles.vue';
import Recommendations from '@component/report/reportRecommendations.vue';
import { ref } from 'vue';
// import CircleProgress from '@component/circleProgress.vue';
import { IDialogueGlobal, IStringKeyNumberValue } from '@interface/Models.ts';
import { getModelData, createNumberBalls } from '@util/ReportHelper.ts';
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";
import { chartDataSet, ChartService } from "@service/chart.service.ts";
import { cloneDeep } from "lodash";
import Chart from "primevue/chart";
import { useMainStore } from '@store/main.ts';

interface ISortedData {
    name: string;
    val: number;
}

interface CustomDialogueItem {
    name: string;
    words: ISortedData[];
}

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
    reportId: number,
}>();

const store = useMainStore();

const numberBalls = createNumberBalls(
    store.getMetricForReport(props.reportId),
    props.modelData,
    props.manuscriptRevisionData,
    true
);

const valid = ref(true);
const defaultChartData = {
    labels: [] as string[],
    datasets: [{
        backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.5),
        borderColor: ChartService.borderColor[0],
        data: [] as number[],
        borderWidth: 2
    }] as chartDataSet[],
}
const defaultData = {
    name: '',
    chartData: cloneDeep(defaultChartData),
};
const defaultChartArray = [
    cloneDeep(defaultData),
    cloneDeep(defaultData),
    cloneDeep(defaultData),
    cloneDeep(defaultData),
    cloneDeep(defaultData),
    cloneDeep(defaultData),
    cloneDeep(defaultData),
    cloneDeep(defaultData),
];
const chartOptions = ChartService.getDefaultBarOptions({
    indexAxis: 'y',
    plugins: {
        legend: {
            display: false,
        },
    },
});

const categoriesChartData = ref(cloneDeep(defaultChartArray));
const verbsChartData = ref(cloneDeep(defaultChartData));
const adverbsChartData = ref(cloneDeep(defaultChartData));

const globalDialogue = getModelData<IDialogueGlobal>(props.modelData, ModelResultDataModelEnum.Dialogue);
const globalDialogueData = ref<IDialogueGlobal>({
    'adverbs in dialog count': {}, 
    'categories count': {     
        'Hovmodige ord': {},
        'Irriterede ord': {},
        'Ord der giver et svar': {},
        'Ord der gør grin': {},
        'Ord der stiller et spørgsmål': {},
        'Ord til at udtrykke usikkerhed': {},
        'Skræmte / skræmmede ord': {},
        'Vrede ord': {},
    }, 
    "number of 'sige' or 'spørge'": 0, 
    "number of adverbs in dialogue": 0, 
    "number of paragraphs with dialogues": 0,
    "number of utterances": 0, 
    "number of verbs in dialogue": 0, 
    "percentage of paragraphs with dialogues": 0,
    "percentage of verbs in 'sige' or 'spørge'": 0, 
    "verbs in dialog count": {},

});

const charts = ref<any[]>([]);

const activeCategory = ref(0);

const sortAndLimit = (data: IStringKeyNumberValue): ISortedData[] => {
    return Object.entries(data).sort((a, b) => b[1] - a[1]).map(el => {
        return { name: el[0], val: el[1] }
    }).slice(0, 10);
}

// const getProcentOfDialog = (primary: boolean): number => {
//     let val: number;
//     if (primary) {
//         if (props.manuscriptRevisionData.modelVersion < 3) {
//             val = globalDialogueData.value['percentage of verbs in \'sige\' or \'spørge\''] ?? 0;
//         } else {
//             val = globalDialogueData.value["percentage of 'sige' or 'spørge' in dialogue-verbs"] ?? 0;
//         }
//         return Math.round(val * 100);
//     }
//     else {
//         if (props.manuscriptRevisionData.modelVersion < 3) {
//             val = globalDialogueData.value['percentage of verbs in \'sige\' or \'spørge\''] ?? 0;
//         } else {
//             val = globalDialogueData.value["percentage of 'sige' or 'spørge' in dialogue-verbs"] ?? 0;
//         }
//         return 100 - Math.round(val * 100);
//     }
// }

try {
    if (globalDialogue?.content !== undefined) {
        globalDialogueData.value = globalDialogue.content;
        const dialogueCategories: CustomDialogueItem[] = Object.entries(globalDialogueData.value["categories count"])
            .sort((a, b) => b[1].propensity - a[1].propensity)
            .map<CustomDialogueItem>(el => {
                return {
                    name: el[0],
                    words: sortAndLimit(el[1])
                }
            }).slice(0, 8);

        for (const [i, value] of dialogueCategories.entries()) {
            categoriesChartData.value[i].name = value.name;
            for (const word of value.words) {
                categoriesChartData.value[i].chartData.labels.push(word.name);
                categoriesChartData.value[i].chartData.datasets[0].data.push(word.val);
            }
        }
        let verbs: IStringKeyNumberValue = {};
        switch (props.manuscriptRevisionData.modelVersion) {
            case 1:
                verbs = globalDialogueData.value['verbs in dialog count'] ?? {} as IStringKeyNumberValue;
                break;
            case 2:
                verbs = globalDialogueData.value['verbs in dialog count'] ?? {} as IStringKeyNumberValue;
                break;
            case 3:
                verbs = globalDialogueData.value['dialogue-verbs count'] ?? {} as IStringKeyNumberValue;
                break;
            case 4:
                verbs = globalDialogueData.value['dialogue verbs count'] ?? {} as IStringKeyNumberValue;
                break;
            default:
                verbs = globalDialogueData.value['dialogue-verbs count'] ?? {} as IStringKeyNumberValue;
                break;

        }
        const sortedVerbs = sortAndLimit(verbs);

        let adverbs: IStringKeyNumberValue = {};
        switch (props.manuscriptRevisionData.modelVersion) {
            case 1:
                adverbs = globalDialogueData.value['adverbs in dialog count'] ?? {} as IStringKeyNumberValue;
                break;
            case 2:
                adverbs = globalDialogueData.value['adverbs in dialog count'] ?? {} as IStringKeyNumberValue;
                break;
            case 3:
                adverbs = globalDialogueData.value['dialogue-adverbs count'] ?? {} as IStringKeyNumberValue;
                break;
            case 4:
                adverbs = globalDialogueData.value['dialogue adverbs count'] ?? {} as IStringKeyNumberValue;
                break;
            default:
                adverbs = globalDialogueData.value['dialogue-adverbs count'] ?? {} as IStringKeyNumberValue;
                break;
        }
        const sortedAdverbs = sortAndLimit(adverbs);


        for (const verb of sortedVerbs) {
            verbsChartData.value.labels.push(verb.name);
            verbsChartData.value.datasets[0].data.push(verb.val);
        }
        for (const adverb of sortedAdverbs) {
            adverbsChartData.value.labels.push(adverb.name);
            adverbsChartData.value.datasets[0].data.push(adverb.val);
        }
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}

try {
    // Resize chart before and after printing to make sure it fits printable area
    window.addEventListener('beforeprint', () => {
        for (const chartElement of charts.value) {
            const chart = chartElement?.getChart();
            if (chart != undefined && chart.resize != undefined) {
                chart.resize(700, 240);
            }
        }
    });
    window.addEventListener('afterprint', () => {
        for (const chartElement of charts.value) {
            const chart = chartElement?.getChart();
            if (chart != undefined && chart.resize != undefined) {
                chart.resize();
            }
        }
    });
} catch (e) {
    console.error('Unhandled error:', e);
}

</script>

<template>
    <div class="report-wrapper">
        <div class="container dialogue-body-container">
            <div class="header printRow">
                <div class="header-left">
                    <report-what-is :report-id="reportId" />
                </div>
            </div>
            <ReportInfoButtons :report-id="reportId" />
            <recommendations class="flex flex-column gap-8 h-full"
                             :report-id="reportId"
                             :model-data="modelData"
                             :manuscript-revision-data="manuscriptRevisionData"
                             :number-balls="numberBalls"
            />
<!--            <div class="grid-nogutter body">-->
<!--                <div class="col-3">-->
<!--                    <div class="flex flex-column gap-8 h-full">-->
<!--                        <div class="rbe-text-container">-->
<!--                            <div class="rbe-text">-->
<!--                                <p>-->
<!--                                    RBE TEKST OM DE PRIMÆRE DIALOGVERBER SIGE/SPØRGE-->
<!--                                </p>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                        <div class="rbe-text-container">-->
<!--                            <div class="rbe-text">-->
<!--                                <p>-->
<!--                                    RBE TEKST OM DE ØVRIGE DIALOGVERBER-->
<!--                                </p>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="col-1"/>-->
<!--                <div class="col-4">-->
<!--                    <recommendations-->
<!--                        class="flex flex-column gap-8 h-full"-->
<!--                        :report-id="reportId"-->
<!--                        :model-data="modelData"-->
<!--                        :manuscript-revision-data="manuscriptRevisionData"-->
<!--                        :indexes="[0,1]"-->
<!--                    />-->
<!--                </div>-->
<!--                <div class="col-4 flex flex-column gap-8 h-full align-items-end">-->
<!--                    <div class="flex flex-column align-items-center justify-content-center">-->
<!--                        <CircleProgress-->
<!--                            size="15rem"-->
<!--                            :percentage="getProcentOfDialog(true)"-->
<!--                        />-->
<!--                        <div class="subline center mt-3">-->
<!--                            Procent af dialog<br>-->
<!--                            <span>(sige/spørge)</span>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="flex flex-column align-items-center justify-content-center">-->
<!--                        <CircleProgress-->
<!--                            size="15rem"-->
<!--                            :percentage="getProcentOfDialog(false)"-->
<!--                        />-->
<!--                        <div class="subline center mt-3">-->
<!--                            Procent af dialog<br>-->
<!--                            <span>(øvrige)</span>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
            <div class="body noPrint"><h3>Top ti dialogverber</h3></div>
            <div class="wrapper noPrint">
                <div class="chart-wrapper">
                    <div class="chart-container">
                        <Chart type="bar" :data="verbsChartData" :options="chartOptions" />
                    </div>
                </div>
            </div>

            <div class="body noPrint"><h3>Alle dialogverber</h3></div>
            <div class="wrapper noPrint">
                <div class="chart-wrapper">
                    <div class="chart-header">
                        <div class="chart-header-item" v-for="(item, index) in categoriesChartData" v-bind:class="{
                            'active': index === activeCategory,
                        }">
                            <div class="text" @click="activeCategory = index">
                                {{ item.name || 'text' }}
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <Chart type="bar" :data="categoriesChartData[activeCategory].chartData" :options="chartOptions" />
                    </div>
                </div>
            </div>

            <div class="body noPrint"><h3>Adverbier i forbindelse med dialog</h3></div>
            <div class="wrapper noPrint">
                <div class="chart-wrapper">
                    <div class="chart-container">
                        <Chart type="bar" :data="adverbsChartData" :options="chartOptions" />
                    </div>
                </div>
            </div>

            <div class="wrapper onlyPrint">
                <div class="chart-wrapper">
                    <div class="chart-header">
                        <div class="chart-header-item">
                            <div class="text">
                                Verber i forbindelse med dialog
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <Chart :ref="(el) => { charts[0] = el; }" type="bar" :data="verbsChartData" :options="chartOptions" class="notFullViewWidth" />
                    </div>
                </div>
                <div class="chart-wrapper">
                    <div class="chart-header">
                        <div class="chart-header-item">
                            <div class="text">
                                Adverbier i forbindelse med dialog
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <Chart :ref="(el) => { charts[1] = el; }" type="bar" :data="adverbsChartData" :options="chartOptions" class="notFullViewWidth" />
                    </div>
                </div>
            </div>
            <div class="wrapper onlyPrint">
                <div class="header">
                    <div class="headline">Grupperede verber</div>
                </div>
                <div class="chart-wrapper" v-for="(item, index) in categoriesChartData">
                    <div class="chart-header">
                        <div class="chart-header-item">
                            <div class="text">
                                {{ item.name || 'text' }}
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <Chart :ref="(el) => { charts[index+2] = el; }" type="bar" :data="categoriesChartData[index].chartData" :options="chartOptions" class="notFullViewWidth" />
                    </div>
                </div>
            </div>
        </div>
        <tips :report-id="reportId"/>
        <articles :report-id="reportId"/>
    </div>
</template>

<style scoped lang="scss">

.subline {
    color: #E4B200;
    font-family: var(--font-family);
    font-size: 1.25rem;
    font-weight: 700;
    margin-top: 0.5rem;

    &.center {
        text-align: center;
    }

    > p,span {
        color: #ffffff;

        @media print {
            color: #000;
        }
    }
}

.rbe-text-container {
    min-width: 16rem;
    min-height: 10rem;
    border-radius: 16px;
    border: 1px solid #E4B200;
    background: rgba(217, 217, 217, 0.13);
    padding: 0.5rem;
    width: 100%;
    font-family: var(--font-family);
    font-size: 1rem;
    align-items: center;
    height: 100%;

    > .rbe-text {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }

    > p {
        margin: 0;

        > span {
            &.R {
                color: #EF4444;
            }

            &.A {
                color: #E4B200;
            }

            &.G {
                color: #22C55E;
            }
        }
    }

    > svg {
        justify-self: left;
        width: 4rem;
        flex-shrink: 0;
        margin-right: 0.5rem;

        > :deep(path) {
            fill: #2C2C2C;
        }
    }
}

.dialogue-body-container {
    > .header-buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;

        > .button {
            border-radius: 4.5rem;
            border: 1px solid #E4B200;
            background: #5B5B5B;
            font-size: 1.75rem;
            font-weight: 700;
            padding: 0.5rem 2rem;
            cursor: pointer;
            user-select: none;

            &.active {
                background: #E4B200;
                color: #000;
            }
        }
    }

    > .wrapper {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 1rem 0;

        > .header {
            display: flex;
            flex-direction: column;
            align-items: center;

            > .headline {
                color: #2C2C2C;
                text-align: center;
                font-size: 1.1555rem;
                font-weight: 700;
                border-radius: 1.23256rem;
                border: 1.233px solid #E4B200;
                background: #E4B200;
                padding: 0.25rem 2rem;
                margin-bottom: 1rem;
                
                @media print {
                    border-radius: 4.5rem;
                    border: 1px solid #E4B200;
                    font-size: 1.75rem;
                    font-weight: 700;
                    padding: 0.5rem 2rem;
                }
            }

            > .subline {
                color: #FFF;
                text-align: center;
                font-size: 1.3785rem;
                font-weight: 700;
            }
        }

        > .chart-wrapper {
            display: flex;
            flex-direction: column;
            align-content: stretch;

            > .chart-header {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                flex-wrap: wrap;

                > .chart-header-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    text-align: center;

                    > .text {
                        border-radius: 4.5rem;
                        border: 1px solid #E4B200;
                        background: #5B5B5B;
                        font-size: 1.25rem;
                        padding: 0.5rem 2rem;
                        cursor: pointer;
                        user-select: none;

                        @media print {
                            background: #FFF;
                            color: #000;
                        }
                    }

                    &.active {
                        position: relative;

                        > .text {
                            background: #E4B200;
                            color: #000;
                        }
                    }
                }
            }

            > .chart-container {
                border-radius: 2.6875rem;
                border: 1px solid #E4B200;
                padding: 0.5rem 2rem;
                margin: 1rem 0;

                > .p-chart {
                    height: 20rem;
                    width: 100%;
                }
            }
        }

        > .information-text-boxes {
            display: flex;
            flex-direction: row-reverse;
            gap: 1rem;
            align-items: stretch;
            color: #FFF;
            font-size: 1.25rem;
            font-weight: 700;
            line-height: 1.875rem;

            > div {
                &:first-child {
                    flex-basis: 75%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    justify-content: center;
                }

                border-radius: 3.76338rem;
                border: 0.599px solid #E4B200;
                background: #5B5B5B;
                padding: 0.5rem 1.5rem;
                margin: 0.5rem 0;
                align-items: center;
                justify-items: center;
                align-content: center;
                text-align: center;
                
                &:last-child {
                    display: grid;
                    grid-auto-flow: column;
                    grid-template-columns: 4rem auto;
                    padding-left: 0.5rem;
                }
                > p {
                    margin: 0;

                    > span {
                        &.R {
                            color: #EF4444;
                        }

                        &.A {
                            color: #E4B200;
                        }

                        &.G {
                            color: #22C55E;
                        }
                    }
                }

                > .infoText {
                    margin-left: 0.5rem;
                }

                > svg {
                    justify-self: left;
                    width: 4rem;
                    flex-shrink: 0;
                    margin-right: 0.5rem;

                    > :deep(path) {
                        fill: #2C2C2C;
                    }
                }
            }
        }

        > .information {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            > div {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin-left: 1rem;

                &:first-of-type {
                    margin-left: 0;
                }

                > svg {
                    margin-right: 0.5rem;
                    width: 2.5rem;

                    > :deep(path) {
                        fill: #2C2C2C;
                    }
                }
            }
        }
    }
}
</style>