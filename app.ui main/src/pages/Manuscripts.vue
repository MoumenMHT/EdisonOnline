<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Paginator from 'primevue/paginator';
import { ManuscriptService } from "@service/manuscript.service.ts";
import { Manuscript, PageOfManuscript } from "@interface/Manuscript.ts";
import { useMainStore } from "@store/main.ts";
import ManuscriptGridItem from '@component/manuscript/GridItem.vue';
import ManuscriptListItem from '@component/manuscript/ListItem.vue';
import { useEventBus } from '@vueuse/core';

const uploadCompletedBus = useEventBus<string>('UploadCompleted');

function listener(_event: string) {
    if (manuscriptsRequest !== undefined) {
        manuscriptsRequest.execute();
    }
}

// listen to an event
const unsubscribe = uploadCompletedBus.on(listener);

const store = useMainStore();

const manuscripts = ref<Manuscript[]>();
// For paginator
const page = ref<number>(0);
const pageSize = ref<number>(12);
const totalElements = ref<number>(0);

const manuscriptsRequest = ManuscriptService.getManuscripts(page, pageSize);
watch(manuscriptsRequest.data, (value) => {
    if (value) {
        const stuff = value as PageOfManuscript;
        manuscripts.value = stuff.content;
        page.value = stuff.page;
        pageSize.value = stuff.pageSize;
        totalElements.value = stuff.totalElements;
    }
});

const layout = ref<'list' | 'grid' | undefined>('grid');

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

onUnmounted(() => {
    clearInterval(intervalId);
    unsubscribe();
});

const onPaginate = (e) => {
    page.value = e.page;
    document.getElementsByClassName('p-dataview-content')[0]?.scrollTo({ top: 0, behavior: 'smooth' });
};

const hasItems = () => {
    const items = manuscripts.value?.length ?? 0;
    return items > 0;
}
</script>

<template>
    <div class="manuscripts-wrapper">
        <div class="dataview-wrapper">
            <DataView
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
                },
                emptymessage: {
                    style: 'width: 100%; height: 100%;',
                }
            }"
            >
                <template #header>
                        <div class="flex justify-content-end ml-auto" v-if="hasItems()">
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
                </template>

                <template #list="slotProps">
                    <ManuscriptListItem v-for="(item, index) in slotProps.items" :key="index" :data="item" />
                </template>
                <template #grid="slotProps">
                    <ManuscriptGridItem v-for="(item, index) in slotProps.items" :key="index" :data="item" />
                </template>
                <template #empty>
                    <div class="p-2 h-full flex justify-content-center align-items-center flex-column select-none">
                        <div>Du har ingen manuskripter uploadet.</div>
                        <div class="flex justify-content-center align-items-center flex-column" v-if="!store.hasSubscription">
                            <span>Du har ikke noget abonnement, så du kan ikke uploade et nyt manuskript.</span>
                            <router-link :to="{name: 'pricing'}">Gå til Priser.</router-link>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
        <div class="paginator-wrapper" v-if="pageSize<totalElements">
            <Paginator :rows="pageSize" :totalRecords="totalElements" @page="onPaginate"></Paginator>
        </div>
    </div>
</template>

<style scoped lang="scss">
.layout-options {
    width: 9rem;
    height: 2rem;
    border-radius: 1.375rem;
}

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

.parent-ellipsis {
    display: flex; /* flex is already here, but it's better to keep in mind */
    min-width: 0; /* override the default of 'auto' for flex items, which allows it to shrink below content size */

    .font-semibold {
        flex-grow: 1; /* makes the text span grow to occupy the maximum width possible */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
