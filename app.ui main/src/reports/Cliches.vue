<script setup lang="ts">
import { ref } from "vue";
import TreeTable from "primevue/treetable";
import Column from 'primevue/column';
import Chart from "primevue/chart";
import { chartDataSet, ChartService } from "@service/chart.service.ts";
import { IClichesGlobal, IClichesListItem } from "@interface/Models.ts";
import { ManuscriptRevision } from "@interface/Manuscript.ts";
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";

interface ITreeTableItemData {
    name: string;
    similarity?: number;
    amount?: number;
}

interface ITreeTableItem {
    key: string;
    data: ITreeTableItemData;
    children?: ITreeTableItem[];
}

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()
const globalCliechesData = ref<IClichesGlobal>(props.modelData.find(x => x.model === ModelResultDataModelEnum.Cliches && x.section === 'global')?.content);
const valid = ref(true);
const nodes = ref<ITreeTableItem[]>([]);
const barChartOptions = ChartService.getDefaultBarOptions({
    plugins: {
        legend: {
            display: false,
        }
    }
});

const barChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.5),
            borderColor: ChartService.borderColor[0],
            borderWidth: 2,
            data: []
        },
    ] as chartDataSet[]
});

try {
    const barChartDataset: number[] = [];
    const barChartlabels: string[] = [];
    const processCliechesListItems = (cliches: IClichesListItem[], parentIndex): ITreeTableItem[] => {
        let itemIndex = 0;
        const items: ITreeTableItem[] = [];
        for (const item of cliches) {
            let score = item["similarity score"];
            if (score === 0) {
                score = 100;
            }
            items.push({
                key: `${parentIndex.toString()}-${itemIndex.toString()}`,
                data: {
                    name: item.sentence,
                    similarity: score,
                }
            });
            barChartDataset.push(score);
            barChartlabels.push(item.sentence);
            itemIndex++;
        }

        return items;
    }
    let index = 0;

    for (let cliches in globalCliechesData.value["cliches list"]) {
        const list = globalCliechesData.value["cliches list"][cliches] as IClichesListItem[];
        const listAmount = list.length;
        if (listAmount === 0) {
            continue;
        }

        const children = processCliechesListItems(list, index);

        nodes.value.push({
            key: index.toString(),
            data: {
                name: cliches,
                amount: listAmount,
            },
            children: children,
        });
        index++;
    }

    barChartData.value.labels = barChartlabels;
    barChartData.value.datasets[0].data = barChartDataset;
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}

</script>

<template>
    <div class="grid grid-nogutter w-full p-3 relative">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">
                Klicheer
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage />
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div v-if="nodes.length !== 0" class="col-6 flex flex-column gap-2">
                <div class="p-2 w-full">
                    <Chart type="bar" :data="barChartData" :options="barChartOptions" class="h-15rem"/>
                    <span class="font-semibold text-lg text-red-500">Data'en i denne graph skal lige der lige undersøges om er den vi gerne vil vise her.</span>
                </div>
            </div>
            <div v-if="nodes.length !== 0" class="col-6 flex flex-column gap-2 pl-2">
                <div class="p-2 w-full">
                    <TreeTable :value="nodes" class="p-treetable-sm">
                        <Column field="name" header="Name" expander></Column>
                        <Column field="similarity" header="Similarity" headerStyle="width: 8rem"></Column>
                        <Column field="amount" header="Antal" headerStyle="width: 5rem"></Column>
                    </TreeTable>
                </div>
            </div>
            <div class="col-12 pb-3" v-if="nodes.length === 0">
                <span
                    class="font-semibold text-lg">Edison har analyseret dit manuskript og ikke fundet nogen klicheer.</span>
            </div>
        </div>
        <div class="col-12 surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvad betyder klicheer?</span><br>
            <span class="font-semibold text-lg text-red-500">Mangler teksten til hvad der skal stå her.</span><br>
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke endnu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
