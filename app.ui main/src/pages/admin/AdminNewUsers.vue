<script setup lang="ts">

import DataView from 'primevue/dataview';
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import Button from "primevue/button";
import Chip from "primevue/chip";
import { AdminService } from "@service/admin.service.ts";
import { computed, ref, watch } from "vue";
import { Author, PageOfAuthor } from "@interface/Author.ts";
import { onMounted, onUnmounted } from "vue";
import Paginator from "primevue/paginator";
import Loader from "@component/loader.vue";

const authors = ref<Author[]>();

const page = ref<number>(0);
const pageSize = ref<number>(12);
const totalElements = ref<number>(0);

let loading = ref<boolean>(true);

const authorsRequest = AdminService.getAllAuthors(computed(() => {
    const params = {
        page: page.value,
        pageSize: pageSize.value
    }
    params['roles'] = ['NEW'];
    return params;
}));

watch(authorsRequest.data, (value) => {
    if (value) {
        // todo - find a better solution for this.
        const stuff = value as PageOfAuthor;
        authors.value = stuff.content;
        page.value = stuff.page;
        pageSize.value = stuff.pageSize;
        totalElements.value = stuff.totalElements;
        loading.value = false;
    }
});

const layout = ref<'list' | 'grid' | undefined>('grid');

const declineUser = (id) => {
    AdminService.changeAuthorRole(id, 'BANNED').then(() => {
        authorsRequest.execute();
    });
}

const acceptUser = (id) => {
    AdminService.changeAuthorRole(id, 'USER').then(() => {
        authorsRequest.execute();
    });
}

let intervalId: number;
let refreshAmount: number = 0;
onMounted(() => {
    intervalId = setInterval(() => {
        authorsRequest.execute();
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
    <div class="authors-wrapper">
        <div class="dataview-wrapper">
            <loader v-if="loading" />
            <DataView
                v-else
                :value="authors"
                :layout="layout"
                data-key="id"
                :pt="{
                    header: {
                        style: {
                            borderTop: 'none',
                            borderBottom: 'none',
                        },
                        class: 'surface-ground',
                    },
                    content: {
                        style: {
                            flex: '1',
                            overflow: 'auto',
                            backgroundColor: 'var(--surface-ground)',
                        }
                    },
                }"
            >

                <template #header>
                    <div class="flex w-full">
                        <div class="flex justify-content-start">
                            <h3 class="flex flex-column my-0 justify-content-around">
                                Nye Forfattere
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

                <template #empty>
                    <div class="flex flex-column align-items-center justify-content-center h-full py-4">
                        <i class="pi pi-users" style="font-size: 4rem"></i>
                        <h5 class="p-m-0">Ingen nye forfattere fundet</h5>
                    </div>
                </template>

                <template #list="slotProps">
                    <div class="col-12 p-2" v-for="(item, index) in slotProps.items" :key="index">
                        <div class="flex flex-row align-items-start p-3 gap-4 border-1 surface-border surface-card border-round justify-content-between">
                            <div class="flex flex-column gap-2">
                                <div>
                                    <Chip :label="item.name || 'N/A'" class="p-text-bold p-text-uppercase"/>
                                </div>
                                <div v-if="item.email">
                                    <div class="p-text-italic">{{ item.email }}</div>
                                </div>
                            </div>
                            <div class="flex flex-column justify-content-between gap-2">
                                <Button label="Afvis" class="p-button-danger" @click="declineUser(item.id)" />
                                <Button label="Accepter" class="p-button" @click="acceptUser(item.id)" />
                            </div>
                        </div>
                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="xl:col-3 lg:col-4 md:col-6 sm:col-12 p-2" v-for="(item, index) in slotProps.items" :key="index">
                        <div class="flex flex-column align-items-start h-full p-3 gap-2 border-1 surface-border surface-card border-round justify-content-between">
                            <div>
                                <Chip :label="item.name || 'N/A'" class="p-text-bold p-text-uppercase"/>
                            </div>
                            <div v-if="item.email">
                                <div class="p-text-italic">{{ item.email }}</div>
                            </div>
                            <div class="w-full flex gap-2 justify-content-between">
                                <Button label="Afvis" class="p-button-danger" @click="declineUser(item.id)" />
                                <Button label="Accepter" class="p-button" @click="acceptUser(item.id)" />
                            </div>
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
.authors-wrapper {
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
}
</style>