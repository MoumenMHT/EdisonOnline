<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import Tips from "@component/report/reportTips.vue";
import Articles from "@component/report/reportArticles.vue";
import Recommendations from '@component/report/reportRecommendations.vue';
import { ref } from 'vue';
import { ISimilarBooksGlobal } from '@interface/Models.ts';
import { getModelData } from '@util/ReportHelper.ts';
import ReportInfoButtons from '@component/report/reportInfoButtons.vue';
import ReportWhatIs from "@component/report/reportWhatIs.vue";

const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
    reportId: number,
}>();

const valid = ref(true);

const globalSimilarBooks = getModelData<ISimilarBooksGlobal[]>(props.modelData, ModelResultDataModelEnum.SimilarBooks);
const globalSimilarBooksData = ref<ISimilarBooksGlobal[]>([]);

try {
    if (globalSimilarBooks?.content !== undefined) {
        globalSimilarBooksData.value = globalSimilarBooks.content;
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}

</script>

<template>
    <div class="report-wrapper">
        <div class="container">
            <div class="header">
                <div class="body column">
                    <ReportWhatIs :report-id="reportId" />
                </div>
                <div class="data-table" v-if="globalSimilarBooksData.length > 0">
                    <div class="data-table-body">
                        <div class="data-table-row header text-primary font-bold">
                            <div class="data-table-cell">ISBN</div>
                            <div class="data-table-cell">Forfatter</div>
                            <div class="data-table-cell">Title</div>
                        </div>
                        <div class="data-table-row" v-for="similarBook in globalSimilarBooksData">
                            <div class="data-table-cell">
<!--                                <router-link :to="{ name: 'similarbook', params: { isbn: similarBook.ISBN }}"></router-link>-->
                                {{ similarBook.ISBN }}
                            </div>
                            <div class="data-table-cell">{{ similarBook.author }}</div>
                            <div class="data-table-cell">{{ similarBook.title }}</div>
                        </div>
                    </div>
                </div>
                <div class="headline" v-else>
                    Der blev ikke fundet nogen lignende bøger
                </div>
            </div>
            <recommendations :report-id="reportId" :model-data="modelData" :manuscript-revision-data="manuscriptRevisionData" />
            <ReportInfoButtons :report-id="reportId" />
        </div>
        <tips :report-id="reportId" />
        <articles :report-id="reportId"/>
    </div>
</template>

<style scoped lang="scss">
.textbox {
    padding: 0.5rem;
    border-radius: 0.6rem;
    border: 1px solid #E4B200;
    background: rgba(217, 217, 217, 0.13);
    max-width: 50rem;
}
</style>