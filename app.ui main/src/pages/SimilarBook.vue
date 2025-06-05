<script setup lang="ts">
import { useRoute } from 'vue-router';
import Loader from "@component/loader.vue";
import { computed, ref, watch } from 'vue';
import { ModelResultData } from '@interface/Model.ts';
import { ManuscriptProgress, ManuscriptRevision } from '@interface/Manuscript.ts';
import { ManuscriptService } from '@service/manuscript.service.ts';
import { ReportService } from '@service/report.service.ts';

const route = useRoute();
const ISBN = ref(parseInt(route.params.isbn as string));

const modelsData = ref<ModelResultData[]>();
const manuscriptRevisionData = ref<ManuscriptRevision>(<ManuscriptRevision>{
    modelVersion: 0,
    audience: "",
    created: new Date(),
    genre: "",
    id: "",
    progress: {},
    title: ""
});

const similarBookRequest = ManuscriptService.getSimilarBooksAdminData(ISBN);
const similarBookMetadataRequest = ManuscriptService.getSimilarBooksMetaData(ISBN);
const loading = computed<boolean>(() => similarBookRequest.isFetching.value || similarBookMetadataRequest.isFetching.value);

watch(similarBookMetadataRequest.data, (value) => {
    if (value) {
        manuscriptRevisionData.value = {
            modelVersion: 0,
            audience: value.audience,
            created: new Date(),
            genre: value.genre,
            id: value.isbn.toString(),
            progress: {} as ManuscriptProgress,
            title: value.title
        };
    }
});
watch(similarBookRequest.data, (value) => {
    if (value) {
        modelsData.value = value as ModelResultData[];
    }
});

watch(
    () => route.params.isbn,
    newISBN => {
        ISBN.value = parseInt(newISBN as string);
        modelsData.value = undefined;
    }
);

similarBookRequest.execute();
similarBookMetadataRequest.execute();
</script>

<template>
    <div class="sticky top-0 surface-header border-bottom-1 surface-border z-1 grid grid-nogutter">
        <div class="col-12 py-2 surface-border" v-if="modelsData !== undefined">
            <div v-for="report in ReportService.reports" class="inline-block px-2">
                <a :href="'#'+report.uuid" class="text-normal-headline text-primary">{{ report.name }}</a>
            </div>
        </div>
    </div>
    <div class="grid grid-nogutter flex-column p-3 gap-2" v-if="modelsData !== undefined">
        <div class="max-size col-12 border-1 surface-border surface-card border-round grid grid-nogutter"
             v-for="report in ReportService.reports" :id="report.uuid">
            <component
                :is="report.component"
                :manuscriptRevisionData="manuscriptRevisionData"
                :modelData="modelsData"
            />
        </div>
    </div>
    <div v-else-if="loading">
        <loader />
    </div>
    <div v-else>Fejlede i at hente similar book. Prøv igen senere.</div>
</template>

<style scoped lang="scss">
.max-size {
    max-width: 1200px;
    margin-left: auto !important;
    margin-right: auto;
    flex-direction: column;
}
</style>