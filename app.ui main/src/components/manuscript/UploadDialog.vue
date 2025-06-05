<script setup lang="ts">
import ProgressBar from 'primevue/progressbar';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { UploadManuscriptFileTypeEnum } from '@interface/Api.ts';
import { ManuscriptService } from '@service/manuscript.service.ts';
import { AuthorService } from '@service/author.service.ts';
import { AuthorStatus } from '@interface/Author.ts';
import { computed, onUnmounted, Ref, ref } from 'vue';
import { useMainStore } from '@store/main.ts';
import { formatSize, MbToBytes } from '@util/fileHelper.ts';
import { useEventBus } from '@vueuse/core';
import { useRouter } from 'vue-router';

interface IdNumberNameString {
    id: number;
    name: string;
}

const router = useRouter();

const visible = ref<boolean>(false);

const emit = defineEmits(['update:visible'])

const uploadCompletedBus = useEventBus<string>('UploadCompleted');
const openUploadDialogBus = useEventBus<string>('OpenUploadDialog');

const store = useMainStore();
const currentUser = ref<AuthorStatus>(store.currentUser);
const targetAudienceData = computed<IdNumberNameString[]>(() => store.recommendationRules.audiences);
const targetGenreData = computed<IdNumberNameString[]>(() => store.recommendationRules.genres);
const uploading = ref(false);
const manuscriptTitle = ref<string|null>(null);
const targetAudience = ref<string|null>(null);
const targetGenre = ref<string|null>(null);

const disableUpload = computed(() => {
    const complimentaryUploadsRemaining = currentUser.value.complimentaryUploadsRemaining ?? 0;
    const subscriptionUploadsRemaining = currentUser.value.subscriptionUploadsRemaining ?? 0;
    const purchasedUploadsRemaining = currentUser.value.purchasedUploadsRemaining ?? 0;
    const totalUploadLeft = complimentaryUploadsRemaining + subscriptionUploadsRemaining + purchasedUploadsRemaining;
    return totalUploadLeft <= 0;
});

const isvalid = (input: Ref<string | null>) => {
    return input !== undefined &&
        input.value !== null &&
        input.value !== '' &&
        input.value.trim() !== '';
}
const enableUploadButton = computed(() => (isvalid(manuscriptTitle) && isvalid(targetAudience) && isvalid(targetGenre)));
const UploadButtonDisabled = (files: File[]) => !files || files.length === 0;
const resetUpload = () => {
    emit('update:visible', false);
    manuscriptTitle.value = null;
    targetAudience.value = null;
    targetGenre.value = null;
    uploading.value = false;
}

const customBase64Uploader = (files: File[]) => {
    if (files.length === 0) {
        return;
    }
    let invalidFileType = false;
    uploading.value = true;
    const file = files[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let fileType: UploadManuscriptFileTypeEnum = UploadManuscriptFileTypeEnum.Text;
    switch (fileExtension) {
        case 'docx':
            fileType = UploadManuscriptFileTypeEnum.Docx;
            break;
        case 'epub':
            fileType = UploadManuscriptFileTypeEnum.Epub;
            break;
        case 'txt':
            fileType = UploadManuscriptFileTypeEnum.Text;
            break;
        default:
            invalidFileType = true;
            throw new Error('Det uploadede fil format er ikke understøttet. Kun docx, epub og txt.');
    }
    if (manuscriptTitle.value !== null && targetAudience.value !== null && targetGenre.value !== null && !invalidFileType) {
        ManuscriptService.uploadManuscript({
            file: file,
            fileType: fileType,
            manuscriptTitle: manuscriptTitle.value as string,
            targetAudience: targetAudience.value as string,
            targetGenre: targetGenre.value as string,
        }).then(async () => {
            const authorStatusRequest = await AuthorService.getAuthorStatus();
            if (authorStatusRequest.data) {
                store.updateUserInfo(authorStatusRequest.data.value as AuthorStatus);
            }
            resetUpload();
            visible.value = false;
            uploadCompletedBus.emit('Upload completed');
            await router.push({name: 'manuscripts'});
        });
    }
};

const unsubscribe = openUploadDialogBus.on(() => {
    currentUser.value = store.currentUser;
    visible.value = true;
});
onUnmounted(() => {
    unsubscribe();
});

</script>

<template>
    <Dialog v-model:visible="visible" modal header="Upload manuskript" :style="{ width: '500px' }">
        <div v-if="disableUpload">Du har ikke flere uploads tilbage.</div>
        <ProgressBar v-if="uploading" mode="indeterminate" style="height: 6px"></ProgressBar>
        <div v-if="!uploading && !disableUpload">
            <div class="field">
                <label for="manuscriptTitle">Titel</label>
                <InputText id="manuscriptTitle" v-model="manuscriptTitle" type="text" class="w-full" />
            </div>
            <div class="field">
                <label for="targetAudience">Målgruppe</label>
                <Dropdown id="targetAudience" v-model="targetAudience" :options="targetAudienceData" optionValue="name" optionLabel="name" class="w-full" />
            </div>

            <div class="field">
                <label for="targetGenre">Genre</label>
                <Dropdown id="targetGenre" v-model="targetGenre" :options="targetGenreData" optionValue="name" optionLabel="name" class="w-full" />
            </div>
            <div class="field">
                <FileUpload
                    :fileLimit="1"
                    name="manuscriptsUpload[]"
                    accept=".epub,.docx"
                    :maxFileSize="MbToBytes(10)"
                    :invalidFileSizeMessage="'{0}: Ugyldig filstørrelse, filstørrelsen skal være mindre end {1}'"
                    :invalidFileTypeMessage="'{0}: Er ikke en gyldig fil type. Følgende fil typer er godkendt: {1}'"
                    customUpload
                    :pt="{
                        content: { class: 'p-0' }
                    }"
                >
                    <template #empty>
                        <p class="p-2 px-4">Træk et manuskript her til for at upload det.</p>
                    </template>
                    <template #header="{ chooseCallback, files }">
                        <div class="flex flex-wrap justify-content-between align-items-left flex-1 gap-2 flex-column">
                            <div v-if="UploadButtonDisabled(files)">Der kan kun uploades .ePub og .docx filer</div>
                            <div v-else-if="!enableUploadButton">Udfyld venligst felterne ovenover</div>
                            <div class="flex gap-2">
                                <Button
                                    @click="chooseCallback()"
                                    icon="pi pi-plus"
                                    label="Vælg fil"
                                    v-if="UploadButtonDisabled(files)"
                                />
                                <Button
                                    @click="customBase64Uploader(files)"
                                    label="Upload"
                                    icon="pi pi-upload"
                                    :disabled="!enableUploadButton"
                                    v-if="!UploadButtonDisabled(files)"
                                />
                            </div>
                        </div>
                    </template>
                    <template #content="{ files, removeFileCallback }">
                        <div v-if="files.length > 0">
                            <div class="flex w-full px-4 py-3" v-for="(file, index) of files" :key="file.name + file.type + file.size">
                                <div class="flex justify-content-start flex-column">
                                    <span class="font-semibold">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                </div>
                                <div class="flex justify-content-end ml-auto">
                                    <Button @click="removeFileCallback(index)" outlined rounded severity="danger">
                                        Annuller
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </template>
                </FileUpload>
            </div>
        </div>
    </Dialog>
</template>

<style scoped lang="scss">

</style>
