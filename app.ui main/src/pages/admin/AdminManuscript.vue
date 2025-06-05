<script setup lang="ts">
import { useRoute } from 'vue-router';
import { Ref, ref, watch } from "vue";
import { AdminService } from "@service/admin.service.ts";
import { ManuscriptRevision, PageOfManuscriptRevision } from "@interface/Manuscript.ts";
import { ModelResultData } from "@interface/Model.ts";
import Loader from "@/components/loader.vue";
import { ReportService } from "@service/report.service.ts";

const route = useRoute();
const manuscriptId = route.params.manuscriptId as string;
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

const revisionId = ref<string>('');
const manuscriptRevisionDataRequest = AdminService.getManuscriptRevisionData(manuscriptId, revisionId);
const manuscriptsRevisionsRequest = AdminService.getManuscriptRevisions(manuscriptId);
watch(manuscriptsRevisionsRequest.data, (value) => {
    if (value) {
        // todo - find a better solution for this.
        const revisions = value as PageOfManuscriptRevision;
        manuscriptRevisionData.value = revisions.content[0];
        // Right now the revision title is overwritten here, since we only allow the use of one revision.
        manuscriptRevisionData.value.title = revisions.manuscriptTitle;
        revisionId.value = revisions.content[0].id;
    }
});
watch(manuscriptRevisionDataRequest.data, (value) => {
    if (value) {
        // todo - find a better solution for this.
        modelsData.value = value as ModelResultData[];
    }
});
const loading = ref<boolean>(true);
watch(manuscriptsRevisionsRequest.isFinished, (value) => {
    const booleanRef = manuscriptRevisionDataRequest.isFinished as Ref<boolean>;
    if (value && booleanRef.value) {
        loading.value = true;
    }
});
watch(manuscriptRevisionDataRequest.isFinished, (value) => {
    const booleanRef = manuscriptsRevisionsRequest.isFinished as Ref<boolean>;
    if (value && booleanRef.value) {
        loading.value = true;
    }
});

</script>

<template>
    <div class="sticky top-0 surface-header p-2 border-bottom-1 surface-border z-1">
        <div v-for="report in ReportService.reports" class="inline-block px-2">
            <a :href="'#'+report.uuid" class="text-normal-headline text-primary">{{ report.name }}</a>
        </div>
    </div>
    <div class="grid grid-nogutter flex-column p-3 gap-2" v-if="modelsData !== undefined">
        <div class="max-size col-12 border-1 surface-border surface-card border-round grid grid-nogutter"
             v-for="report in ReportService.reports" :id="report.uuid">
            <component
                :is="report.component"
                :manuscriptRevisionData="manuscriptRevisionData"
                :modelData="modelsData"
            ></component>
        </div>
    </div>
    <div v-else-if="loading">
        <loader/>
    </div>
    <div v-else>Fejlede i at hente manuscriptet. Prøv igen senere.</div>
</template>

<style scoped lang="scss">
.max-size {
    max-width: 1200px;
    margin-left: auto !important;
    margin-right: auto;
    flex-direction: column;
}
</style>
