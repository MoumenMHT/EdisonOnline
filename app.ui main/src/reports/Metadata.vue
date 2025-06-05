<script setup lang="ts">
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { ref } from 'vue';
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData } from '@interface/Model.ts';

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>();

const tableData = ref<any[]>([
    {
        name: 'Title',
        value: props.manuscriptRevisionData.title
    },
    {
        name: 'Audience',
        value: props.manuscriptRevisionData.audience
    },
    {
        name: 'Genre',
        value: props.manuscriptRevisionData.genre
    },
    {
        name: 'Oprettet',
        value: new Date(props.manuscriptRevisionData.created).toLocaleDateString('da-DK', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    },
]);
</script>

<template>
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">
                Din bog
            </div>
        </div>
        <div class="col-12">
            <DataTable :value="tableData" class="p-datatable-sm" stripedRows disabledSelection>
                <Column field="name" header="Data" style="width: 25%"></Column>
                <Column field="value" header="Value"></Column>
            </DataTable>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>