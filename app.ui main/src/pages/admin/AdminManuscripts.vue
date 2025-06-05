<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import DataView from 'primevue/dataview';
import { AdminService } from "@service/admin.service.ts";
import { Manuscript, PageOfManuscript } from "@interface/Manuscript.ts";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import Paginator from 'primevue/paginator';
import ManuscriptGridItem from '@component/manuscript/GridItem.vue';
import ManuscriptListItem from '@component/manuscript/ListItem.vue';
import Loader from "@component/loader.vue";

const loading = ref<boolean>(true);
const manuscripts = ref<Manuscript[]>()
// For paginator
const page = ref<number>(0);
const pageSize = ref<number>(12);
const totalElements = ref<number>(0);

const manuscriptsRequest = AdminService.getAllManuscripts(computed(() => {
    return {
        pageSize: pageSize.value,
        page: page.value
    }
}));
watch(manuscriptsRequest.data, (value) => {
    if (value) {
        // todo - find a better solution for this.
        const stuff = value as PageOfManuscript;
        manuscripts.value = stuff.content;
        page.value = stuff.page;
        pageSize.value = stuff.pageSize;
        totalElements.value = stuff.totalElements;
        loading.value = false;
    }
});


const layout = ref<'list' | 'grid' | undefined>('grid');

const manuscriptTitle = ref<string|null>(null);
const targetAudience = ref<string|null>(null);
const targetGenre = ref<string|null>(null);
const showUpload = ref(false);
const isvalid = (input) => {
    return input !== undefined &&
        input.value !== null &&
        input.value !== '' &&
        input.value.trim() !== '';
}
const watcher = () => {
    showUpload.value = (isvalid(manuscriptTitle) && isvalid(targetAudience) && isvalid(targetGenre));
};

watch(manuscriptTitle, watcher);
watch(targetAudience, watcher);
watch(targetGenre, watcher);
let intervalId: number;
let refreshAmount: number = 0;
onMounted(() => {
    intervalId = setInterval(() => {
        manuscriptsRequest.execute();
        if (refreshAmount > 60) {
            clearInterval(intervalId);
        }
        refreshAmount++;
    }, 60000, '');
});

onUnmounted(() => clearInterval(intervalId));
const onPaginate = (e) => {
    page.value = e.page;
    document.getElementsByClassName('p-dataview-content')[0]?.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
    <div class="manuscripts-wrapper">
        <div class="dataview-wrapper">
            <loader v-if="loading" />
            <DataView
                v-else
                :value="manuscripts"
                :layout="layout"
                data-key="id"
                :pt="{
                header: { 
                    class: 'surface-ground',
                    style: 'border-bottom: none;'
                },
                content: {
                    class: 'flex flex-wrap align-content-start	',
                }
            }"
            >
                <template #header>
                    <div class="flex w-full">
                        <div class="flex justify-content-start">
                            <h3 class="flex flex-column my-0 justify-content-around">
                                Alle Manuskrifter
                            </h3>
                        </div>
                        <div class="flex justify-content-end ml-auto">
                            <DataViewLayoutOptions
                                v-model="layout"
                                :pt="{
                                    root: {
                                        style: 'border: 1px solid var(--surface-border); border-radius: 1.375rem; width: 9rem; height: 2.125rem; overflow: visible; display: flex; background-color: rgb(63, 63, 63);',
                                    },
                                    listButton: {
                                        style: `border: none; border-radius: 1.375rem; width: ${layout === 'list' ? '5.1rem' : '4.7rem'}; height: 2rem; transition: width 0.3s; margin-right: ${layout === 'list' ? '-0.4rem' : '0'}; z-index: ${layout === 'list' ? '1' : '0'};`,
                                    },
                                    gridButton: {
                                        style: `border: none; border-radius: 1.375rem; width: ${layout === 'grid' ? '5.1rem' : '4.7rem'}; height: 2rem; transition: width 0.3s; margin-left: ${layout === 'grid' ? '-0.4rem' : '0'}; z-index: ${layout === 'grid' ? '1' : '0'};`,
                                    },
                                }"
                            />
                        </div>
                    </div>
                </template>

                <template #list="slotProps">
                    <ManuscriptListItem v-for="(item, index) in slotProps.items" :key="index" :data="item" isAdmin />
                </template>
                <template #grid="slotProps">
                    <ManuscriptGridItem v-for="(item, index) in slotProps.items" :key="index" :data="item" isAdmin />
                </template>
            </DataView>
        </div>
        <div class="paginator-wrapper" v-if="pageSize<totalElements">
            <Paginator :rows="pageSize" :totalRecords="totalElements" @page="onPaginate"></Paginator>
        </div>
    </div>
</template>

<style scoped lang="scss">
.manuscripts-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .dataview-wrapper {
        flex-grow: 1;
        width: 100%;
        overflow:auto;
    }

    .paginator-wrapper {
        border-top: 1px solid var(--surface-border);
    }
}

.p-dataview {
    display: flex;
    flex-direction: column;
    height: 100%;

    &.p-dataview-list {
        > :deep(.p-dataview-content > .p-grid > div) {
            border: none;
        }
    }

    > :deep(.p-dataview-header) {
        border-top: none;
    }

    > :deep(.p-dataview-content) {
        flex: 1;
        overflow: auto;
        background-color: var(--surface-ground);
    }

    :deep(.p-knob > svg:focus) {
        outline: none;
    }
}
</style>
