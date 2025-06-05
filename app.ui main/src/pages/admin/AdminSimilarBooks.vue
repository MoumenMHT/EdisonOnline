<script setup lang="ts">
import { ReportService } from "@service/report.service.ts";
import Loader from "@component/loader.vue";
import { computed, ref, watch } from 'vue';
import { ModelResultData } from "@interface/Model.ts";
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import InlineMessage from 'primevue/inlinemessage';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { ManuscriptService } from "@service/manuscript.service.ts";
import { AdminService } from "@service/admin.service.ts";
import { ManuscriptProgress, ManuscriptRevision } from "@interface/Manuscript.ts";

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

const value = ref<number | null>(null);
const loadedSimilarBook = ref<number>(0);
const invalidSimilarBook = ref<boolean>(false);
const similarBookEdit = ref<boolean>(false);
const newIsbn = ref<string>("");

const similarBookRequest = ManuscriptService.getSimilarBooksAdminData(loadedSimilarBook);
const similarBookMetadataRequest = ManuscriptService.getSimilarBooksMetaData(loadedSimilarBook);
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


const updateSimilarBookData = () => {
    if (value.value === null) {
        invalidSimilarBook.value = true;
        return;
    }

    invalidSimilarBook.value = false;
    modelsData.value = undefined;
    if (loadedSimilarBook.value === value.value) {
        similarBookRequest.execute();
        similarBookMetadataRequest.execute();
        return;
    }
    loadedSimilarBook.value = value.value;
}

const validateIsbn = (isbn: string) => {
    return isbn.length >= 13 && !isNaN(parseInt(isbn)) && containsLetters(isbn) === null;
}

const containsLetters = (value: string) => {
    return value.match(/[a-z]/i);
}

const updateTrialReport = () => {
    similarBookEdit.value = false;
    AdminService.updateTrialReport(newIsbn.value);
    newIsbn.value = "";
}

</script>

<template>
    <div class="sticky top-0 surface-header z-1 grid grid-nogutter">
        <div class="col-12 flex justify-content-between p-2">
            <div class="flex gap-2">
                <InputNumber v-model="value" inputId="withoutgrouping" :useGrouping="false" :disabled="loading"/>
                <Button label="Submit" :disabled="loading" @click="updateSimilarBookData"/>
                <InlineMessage severity="error" v-if="invalidSimilarBook">Ikke gyldig similar book.</InlineMessage>
            </div>
            <Button label="Opdater prøverapport" @click="similarBookEdit = true"/>
        </div>
        <div class="col-12 py-2 border-top-1 surface-border" v-if="modelsData !== undefined">
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
    <div v-else-if="loadedSimilarBook === 0">
        Skriv venligst et ISBN nummer til en similar book.
    </div>
    <div v-else-if="loading">
        <loader/>
    </div>
    <div v-else>Fejlede i at hente similar book. Prøv igen senere.</div>
    <Dialog v-model:visible="similarBookEdit" modal header="Opdater Prøverapport" :style="{ width: '25rem' }">
        <span class="p-text-secondary block mb-5">Indtast den ønskede prøverapports ISBN</span>
        <div class="flex flex-column gap-2 mb-2">
            <label for="isbn" class="font-semibold w-6rem">ISBN</label>
            <InputText v-model="newIsbn" id="isbn" class="w-full" :invalid="!validateIsbn(newIsbn)" autocomplete="off" />
        </div>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="similarBookEdit = false"/>
            <Button type="button" :disabled="!validateIsbn(newIsbn)" label="Save" @click="updateTrialReport()"/>
        </div>
    </Dialog>
</template>

<style scoped lang="scss">
.max-size {
    max-width: 1200px;
    margin-left: auto !important;
    margin-right: auto;
    flex-direction: column;
}
</style>