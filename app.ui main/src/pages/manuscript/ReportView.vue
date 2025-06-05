<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData } from '@interface/Model.ts';
import { useRoute } from 'vue-router';
import { ReportService } from '@service/report.service.ts';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { ref, watch } from 'vue';
import { useMainStore } from '@store/main.ts';

const route = useRoute();
const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
}>();

const store = useMainStore();

const getReportComponent = () => {
    return ReportService.getReportComponent(parseInt(route.params.reportId as string))
};

const paramIdToNumber = (paramId: string | string[]): number => {
    if (typeof paramId === 'object') {
        return 0;
    }
    return parseInt(paramId);
}

const isBeAware = () => {
    if (props.isTrial) {
        return false;
    }
    if (!store.analyzedOrGivenWarning) {
        return false;
    }
    switch (paramIdToNumber(route.params.reportId)) {
        case 3:
            return true;
        case 4:
            return true;
        case 5:
            return true;
        case 7:
            return true;
        case 8:
            return true;
        default:
            return false;
    }
}

const beAwareVisible = ref(false);

const dismissAnalyzedGivenWarning = () => {
    store.dismissAnalyzedGivenWarning();
    beAwareVisible.value = false;
}

watch(() => paramIdToNumber(route.params.reportId), () => {
    beAwareVisible.value = isBeAware();
}, { immediate: true });
</script>

<template>
    <component
        v-if="getReportComponent() !== ''"
        :is="getReportComponent()"
        :isAdmin="isAdmin"
        :isSimilarBook="isSimilarBook"
        :isTrial="isTrial"
        :manuscriptRevisionData="manuscriptRevisionData"
        :modelData="modelData"
        :reportId="paramIdToNumber(route.params.reportId)"
    ></component>
    <div v-else>Reporten blev ikke fundet...</div>
    <Dialog v-model:visible="beAwareVisible" modal header="Info" :style="{ width: '50rem' }">
        <div class="mb-5 flex flex-column gap-3">
            <span>Vær opmærksom på, at denne rapport bliver påvirket af Analyseret/Angivet knapperne i venstre nedre hjørne af siden.</span>
            <span>Når der er valgt Analyseret vil analysen give anbefalinger baseret på den analyserede genre og målgruppe.</span>
            <span>Når der er valgt Angivet vil analysen give anbefalinger baseret på den angivne genre og målgruppe.</span>
            <span>
                Som standard er de Angivet værdier valgt. Det betyder altså at rapporten vil give anbefalinger baseret på den angivne genre og målgruppe.
                <br>
                Hvis du ønsker at se anbefalinger baseret på den analyserede genre og målgruppe, skal du vælge Analyseret.
            </span>
        </div>
        <div class="flex justify-content-evenly">
            <Button type="button" label="Okay" severity="secondary" @click="beAwareVisible = false"></Button>
            <Button type="button" label="Vis ikke igen" @click="dismissAnalyzedGivenWarning"></Button>
        </div>

    </Dialog>
</template>

<style scoped lang="scss">

</style>