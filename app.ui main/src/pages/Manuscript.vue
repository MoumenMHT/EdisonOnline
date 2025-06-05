<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, ref, watch } from 'vue';
import SelectButton from 'primevue/selectbutton';
import { ManuscriptService } from "@service/manuscript.service.ts";
import { ManuscriptProgress, ManuscriptRevision, PageOfManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData } from "@interface/Model.ts";
import Loader from "@component/loader.vue";
import { AdminService } from "@service/admin.service.ts";
import router from '@core/router.ts';
import ReportIcon from '@component/report/reportIcon.vue';
import { useMainStore } from '@store/main.ts';
import { ReportIndex } from '@interface/Report.ts';
import { SimilarBookMetadata } from '@interface/defaultModels.ts';

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
}>();

const route = useRoute();
const store = useMainStore();
const manuscriptId = ref(route.params.manuscriptId as string);
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
const revisionId = ref<string>('');
const reportListFilter = (report: ReportIndex): boolean => {
    // x => x.id > 0 && ((props.isTrial && x.id != 10) || true)
    if (props.isTrial && report.id === 10) {
        return false;
    }

    return report.id > 0;
}
const reportListSorter = (a,b) => a.sortIndex - b.sortIndex;
const reportList = ref<ReportIndex[]>(store.reports.filter(reportListFilter).sort(reportListSorter));

const getManuscriptRevisionData = () => {
    if (props.isSimilarBook) {
        return ManuscriptService.getSimilarBooksAdminData(ISBN);
    }
    if (props.isAdmin) {
        return AdminService.getManuscriptRevisionData(manuscriptId.value, revisionId);
    }
    if (props.isTrial) {
        return ManuscriptService.getTrialReportData();
    }
    return ManuscriptService.getManuscriptRevisionData(manuscriptId.value, revisionId);
};

const getManuscriptsRevisions = () => {
    if (props.isSimilarBook) {
        return ManuscriptService.getSimilarBooksMetaData(ISBN);
    }
    if (props.isAdmin) {
        return AdminService.getManuscriptRevisions(manuscriptId.value);
    }
    if (props.isTrial) {
        return ManuscriptService.getTrialReportMetaData();
    }
    return ManuscriptService.getManuscriptRevisions(manuscriptId.value);
};

const manuscriptRevisionDataRequest = ref(getManuscriptRevisionData());
const manuscriptsRevisionsRequest = ref(getManuscriptsRevisions());
const loading = computed(() => manuscriptsRevisionsRequest.value.isFetching || manuscriptRevisionDataRequest.value.isFetching);
const completeFailure = computed(() => manuscriptRevisionData.value.progress.errors === manuscriptRevisionData.value.progress.modelsTotal);
const UA = navigator.userAgent;
const isSafari = UA.indexOf('Safari') !== -1 && UA.indexOf('Chrome') === -1;

watch(() => manuscriptsRevisionsRequest.value.data, (value: PageOfManuscriptRevision | SimilarBookMetadata | null) => {
    if (value) {
        if (!props.isSimilarBook && !props.isTrial) {
            const revisions = value as PageOfManuscriptRevision;
            manuscriptRevisionData.value = revisions.content[0];
            // Right now the revision title is overwritten here, since we only allow the use of one revision.
            manuscriptRevisionData.value.title = revisions.manuscriptTitle;
            revisionId.value = revisions.content[0].id;
        } else {
            const metadat = value as SimilarBookMetadata;
            manuscriptRevisionData.value = {
                modelVersion: 0,
                audience: metadat.audience,
                created: new Date(),
                genre: metadat.genre,
                id: metadat.isbn.toString(),
                progress: {} as ManuscriptProgress,
                title: metadat.title
            };
        }
    }
});
watch(() => manuscriptRevisionDataRequest.value.data, (value) => {
    if (value) {
        // todo - find a better solution for this.
        modelsData.value = value as ModelResultData[];
    }
});

if (props.isSimilarBook) {
    manuscriptRevisionDataRequest.value.execute();
    manuscriptsRevisionsRequest.value.execute();
}
watch(
    () => route.params,
    (newParams, oldParams) => {
        const clearModelsData = () => {
            modelsData.value = undefined;
        }
        
        if (newParams.manuscriptId !== oldParams.manuscriptId && newParams.manuscriptId !== undefined && oldParams.manuscriptId !== undefined) {
            clearModelsData();
            manuscriptId.value = newParams.manuscriptId as string;
        }
        if (newParams.isbn !== oldParams.isbn && newParams.isbn !== undefined && oldParams.isbn !== undefined) {
            clearModelsData();
            ISBN.value = parseInt(newParams.isbn as string);
        }
        if ((newParams.isbn !== undefined && oldParams.manuscriptId !== undefined) ||
            (newParams.manuscriptId !== undefined && oldParams.isbn !== undefined) ||
            (newParams.manuscriptId === undefined && newParams.isbn === undefined)) {
            manuscriptRevisionDataRequest.value = getManuscriptRevisionData() as any;
            manuscriptsRevisionsRequest.value = getManuscriptsRevisions() as any;
            
            // This is just to make sure that the ISBN or ManuscriptId gets updated after we change between manuscript and similar book
            if (props.isSimilarBook) {
                ISBN.value = parseInt(newParams.isbn as string);
            } else {
                manuscriptId.value = newParams.manuscriptId as string;
            }
            
            reportList.value = store.reports.filter(reportListFilter).sort(reportListSorter);
        }
    }
);

const isPage = (name: string) => {
    return route.name === 'manuscript'+name || 
        route.name === 'adminManuscript'+name || 
        route.name === 'similarBookManuscript'+name || 
        route.name === 'trialManuscript'+name;
}
const isReport = (id: number): boolean => {
    const routeName = route.name?.toString() || "";
    if (routeName.endsWith("ReportView") && route.params.hasOwnProperty("reportId")) {
        return route.params.reportId === id.toString();
    }
    return false;
}
const navigate = (place: string | number) => {
    let linkPrefix = 'manuscript';
    if (props.isAdmin) {
        linkPrefix = 'adminManuscript';
    }
    if (props.isSimilarBook) {
        linkPrefix = 'similarBookManuscript';
    }
    if (props.isTrial) {
        linkPrefix = 'trialManuscript';
    }
    if (typeof place === 'string') {
        router.push({ name: linkPrefix+place }).then();
    }
    
    if (typeof place === 'number' && !isReport(place)) {
        document.getElementsByClassName('manuscript-content-container')[0]?.scrollTo({ top: 0, behavior: 'auto' });
        router.push({ name: linkPrefix+'ReportView' , params: { reportId: place } }).then();
    }
}


const SelectButtonOptions = ref(['Analyseret', 'Angivet']);
const SelectButtonValue = ref(store.AnalyzedOrGivenData);
const SelectButtonChange = (val: string) => {
    store.updateAnalyzedOrGivenData(val);
}


</script>

<template>
    <div class="newMain">
        <div class="menu noPrint">
            <div class="mainMenu">
                <ul>
                    <li v-bind:class="{
                        'active': isPage('Analysis'),
                    }" v-on:click="navigate('Analysis')">Dashboard</li>
                </ul>
            </div>
            <div class="subMenu">
                <ul>
                    <li v-for="report in reportList" 
                        v-bind:key="report.id"
                        v-bind:class="{
                            'active': isReport(report.id),
                            'disabled': report.id === 10 && !store.isAdmin
                        }"
                        v-on:click="navigate(report.id)"
                    >
                        <ReportIcon :report-id="report.id" :size="'1.5rem'"/>
                        <span>{{ report.name }}</span>
                        <span v-if="report.id === 10 && !store.isAdmin" class="soon text-primary">Kommer snart</span>
                    </li>
                </ul>
            </div>
            <div class="subMenu" v-if="!isAdmin && !isSimilarBook && !isTrial">
                <ul>
                    <li v-bind:class="{
                            'active': isPage('Print'),
                        }"
                        v-on:click="navigate('Print')">
                        <ReportIcon :report-id="-10" :size="'1.5rem'" /><span>Print</span>
                    </li>
                </ul>
            </div>
            <div class="bottom" v-if="!isTrial">
                <span v-if="isSafari" class="not-supported">
                    Denne funktion er desværre ikke understøttet i Safari. Brug Chrome eller Firefox.
                </span>
                <div class="text">Skift i mellem analyseret og angivet genre og målgruppe.</div>
                <SelectButton 
                    v-model="SelectButtonValue" 
                    :options="SelectButtonOptions" 
                    aria-labelledby="Change analyzed and given"
                    :allowEmpty="false"
                    @update:modelValue="SelectButtonChange"
                />
            </div>
        </div>
        <div class="content-wrapper">
            <div class="content-menu">
                <div class="content-menu-item active">
                    {{ manuscriptRevisionData.title }}
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="14" 
                        height="14" 
                        viewBox="0 0 14 14" 
                        v-if="!isSimilarBook && !isTrial"
                    >
                        <path d="M2.51465 0L0 2.51465L1.28408 3.79873L4.4586 7.02675L1.28408 10.2013L0 11.4318L2.51465 14L3.79873 12.7159L7.02675 9.4879L10.2013 12.7159L11.4318 14L14 11.4318L12.7159 10.2013L9.4879 7.02675L12.7159 3.79873L14 2.51465L11.4318 0L10.2013 1.28408L7.02675 4.4586L3.79873 1.28408L2.51465 0Z" fill="#3F3F3F"/>
                    </svg>
                </div>
                <div class="content-menu-item AddNewVersion" v-if="!isAdmin && !isSimilarBook && !isTrial && false">
                    Tilføj ny version
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <path d="M6 0V5.625H0V9.375H6V15H10V9.375H16V5.625H10V0H6Z" fill="#E4B200"/>
                    </svg>
                </div>
                <div v-if="isSimilarBook && store.isAdmin && false">
                    ADMIN
                </div>
            </div>
            <div class="content manuscript-content-container">
                <div v-if="modelsData !== undefined && modelsData.length > 0">
                    <router-view 
                        :isAdmin="isAdmin" 
                        :isSimilarBook="isSimilarBook" 
                        :isTrial="isTrial" 
                        :manuscriptRevisionData="manuscriptRevisionData"
                        :modelData="modelsData"
                    />
                </div>
                <div v-else-if="loading">
                    <loader />
                </div>
                <div v-else>
                    <div v-if="completeFailure">
                        Alle reporter er fejlet i at blive analyseret af edison. 
                    </div>
                    <div v-else>Fejlede i at hente manuscriptet. Prøv igen senere.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@media print {
    .newMain {
        .content-wrapper {
            background: #fff !important;
            overflow: visible !important;

            .content {
                overflow: visible !important;
            }
        }
        
    }
}

.newMain {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: stretch;
    align-items: stretch;
    height: 100%;
    color: #fff;

    .menu {
        order: 0;
        flex: 0 0 auto;
        align-self: auto;
        //padding-left: 39px;
        //padding-right: 39px;
        //padding-top: 34px;
        background-color: #3f3f3f;
        overflow: auto;
        display: flex;
        flex-direction: column;
        max-width: 300px;

        .logo {
            margin-bottom: 23px;
            
            > svg {
                height: 50px; 
                fill: #E4B200;
            }
        }

        .mainMenu {
            margin-top: 34px;
            margin-left: 39px;
            margin-right: 39px;
            font-size: 20px;
            font-family: "Inter", sans-serif;
            //border-bottom: 2px solid #E4B200;
            color: rgba(255,255,255,0.4);
            
            > ul {
                list-style-type: none;
                margin: 0;
                padding: 0;

                > li {
                    padding-bottom: 6px;
                    line-height: 23px;
                    margin-top: 12px;

                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    user-select: none;
                    cursor: pointer;

                    &::before {
                        content: "";
                        display: inline-block;
                        width: 23px;
                        height: 23px;
                        border-radius: 11.5px;
                        margin-right: 10px;
                        border: 1px solid rgba(228, 178, 0, 0.52);
                    }

                    &:hover {
                        color: rgba(255,255,255,0.8);
                    }

                    &.active {
                        color: rgba(255,255,255,1.0);
                        
                        &::before {
                            background-color: #E4B200;
                        }
                    }
                }
            }
        }

        .subMenu {
            margin-top: 5px;
            margin-left: 39px;
            margin-right: 39px;

            //color: rgba(255,255,255,0.4);
        
            border-top: 2px solid #E4B200;
            padding-top: 6px;
            > ul {
                list-style-type: none;
                margin: 0;
                padding: 0;

                > li {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 7px;

                    user-select: none;
                    cursor: pointer;
                    
                    font-size: 0.9375rem;
                    line-height: 1.2rem;

                    opacity: 0.4;

                    > span {
                        margin-left: 0.5rem;
                    }
                    
                    &:hover {
                        opacity: 0.6;
                    }
                    
                    &.active {
                        opacity: 1.0;
                    }

                    &.disabled {
                        cursor: not-allowed;
                        opacity: 0.25;

                        .soon {
                            font-size: 0.75rem;
                            opacity: 1 !important;
                            margin-left: 0.5rem;
                        }
                    }
                }
            }
        }
        
        > .bottom {
            margin-top: auto;
            width: 100%;
            display: flex;
            flex-direction: column;
            
            > .text {
                text-align: center;
                margin: 1rem 0;
            }

            > .not-supported {
                text-align: center;
                margin: 0 1rem;
                color: #E4B200;
            }
            
            > .p-selectbutton {
                display: flex;
                align-items: stretch;
                flex-direction: row;

                > :deep(.p-button) {
                    flex: 1 1 auto;
                    border-radius: 0;
                    border-bottom: none;
                    
                    &:focus {
                        box-shadow: none;
                    }
                    
                    &:first-of-type {
                        border-left: none;
                    }
                    &:last-of-type {
                        border-right: none;
                    }
                }
            }
        }
    }

    .content-wrapper {
        order: 0;
        flex: 1 1 auto;
        align-self: auto;
        background: #2c2c2c;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: stretch;
        overflow: auto;
        
        .content-menu {
            border-bottom: 1px solid #3F3F3F;
            flex-grow: 0;

            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-content: stretch;
            align-items: stretch;
            
            .content-menu-item {
                padding: 10px;
                color: rgba(255,255,255,0.2);
                font-family: var(--font-family);
                font-size: 15px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                
                display: flex;
                align-items: center;

                user-select: none;
                
                @media print {
                    color: #000 !important;
                }
                &.active {
                    color: #FFF;
                }
                
                &:not(:last-child) {
                    border-right: 1px solid #3F3F3F;
                }
                
                > svg {
                    margin-left: 8px;
                }
                
                &.AddNewVersion {
                    cursor: pointer;
                    &:hover {
                        color: rgba(255,255,255,0.6);
                    }
                }
            }
        }
        
        .content {
            overflow: auto;
            flex: 1 1 auto;
        }
    }
}
</style>
