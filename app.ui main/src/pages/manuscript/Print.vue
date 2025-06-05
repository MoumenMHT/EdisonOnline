<script setup lang="ts">
    import { useMainStore } from '@store/main.ts';
    import { ref } from 'vue';
    import { ReportIndex } from '@interface/Report.ts';
    import { ManuscriptRevision } from '@interface/Manuscript.ts';
    import { ModelResultData } from '@interface/Model.ts';
    import { ReportService } from '@service/report.service.ts';
    
    defineProps<{
        isAdmin?: boolean,
        isSimilarBook?: boolean,
        isTrial?: boolean,
        manuscriptRevisionData: ManuscriptRevision,
        modelData: ModelResultData[],
    }>();
    
    const store = useMainStore();
    const reportList = ref<ReportIndex[]>(store.reports.filter(x => x.id > 0).sort((a, b) => a.sortIndex - b.sortIndex));
</script>

<template>
    <div class="print-wrapper">
        <div v-for="report in reportList" class="print-container">
            <div class="print-report-header">
                {{ report.name }}
            </div>
            <component
                v-if="ReportService.getReportComponent(report.id) !== ''"
                :is="ReportService.getReportComponent(report.id)"
                :isAdmin="isAdmin"
                :isSimilarBook="isSimilarBook"
                :isTrial="isTrial"
                :manuscriptRevisionData="manuscriptRevisionData"
                :modelData="modelData"
                :reportId="report.id"
            />
            <div v-else>
                Report fejlet i at blive lavet.
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@page {
    size: A4 portrait;
}

    .print-wrapper {
        display: flex;
        flex-direction: column;
        max-width: 100vw;
        margin: auto;
        
        > .print-container {
            display: flex;
            flex-direction: column;

            @media print {
                page-break-after: always;
            }
            
            &:not(:last-child) {
                border-bottom: 1px solid var(--primary-color);
            }
            
            > .print-report-header {
                color: #E4B200;
                font-family: var(--font-family);
                font-size: 2rem;
                font-weight: 700;
                line-height: 1.75rem;
                margin-bottom: 1.5rem;

                display: flex;
                flex-direction: row;
                justify-content: center;
                border-bottom: 1px solid var(--primary-color);
                border-image: linear-gradient(to left, transparent, #e4b200, transparent) 5;
                padding: 1rem 0;
            }
        }
    }
</style>