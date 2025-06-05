<script setup lang="ts">

import DataView from 'primevue/dataview';
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import Button from "primevue/button";
import Chip from "primevue/chip";
import router from '@core/router.ts';
import { AdminService } from "@service/admin.service.ts";
import { computed, ref, watch } from "vue";
import { Author, PageOfAuthor } from "@interface/Author.ts";
import { onMounted, onUnmounted } from "vue";
import Paginator from "primevue/paginator";
import Loader from "@component/loader.vue";
import Dialog from "primevue/dialog";
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';


interface AuthorSortOptions {
    icon: string;
    sort: string;
    order: string;
    name: string;
}

const roles = ref<string[]>([
    'USER',
    'ADMIN',
    'BANNED',
    'TESTER'
]);

const visibleDialog = ref<boolean>(false);
const selectedAuthorId = ref<string>('');
const authors = ref<Author[]>();
const addedUploads = ref<number>(0);

const sortingOptions = ref<AuthorSortOptions[]>([
    { icon: 'pi pi-sort-amount-up', sort: 'created', order: 'asc', name: 'Oprettet'},
    { icon: 'pi pi-sort-amount-down', sort: 'created', order: 'desc', name: 'Oprettet'},
    { icon: 'pi pi-sort-amount-up', sort: 'name', order: 'asc', name: 'Navn'},
    { icon: 'pi pi-sort-amount-down', sort: 'name', order: 'desc', name: 'Navn'},
]);

const selectedSortOption = ref<AuthorSortOptions>();

const roleOptions = ref<string[]>([
    'NEW',
    'USER',
    'DEVELOPER',
    'ADMIN',
    'BANNED',
    'TESTER'
]);

const selectedRoleOptions = ref<string[]>();

const emailSearch = ref<string>('');

const page = ref<number>(0);
const pageSize = ref<number>(24);
const totalElements = ref<number>(0);

let loading = ref<boolean>(true);

const authorsRequest = AdminService.getAllAuthors(computed(() => {
    const params = {
        page: page.value,
        pageSize: pageSize.value
    }
    if (selectedRoleOptions.value) {
        params['roles'] = selectedRoleOptions.value;
    }
    if (selectedSortOption.value) {
        params['sort'] = selectedSortOption.value.sort;
        params['order'] = selectedSortOption.value.order;
    }
    if (emailSearch.value.length > 0) {
        params['email'] = emailSearch.value;
    }
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

const navigate = (id) => {
    router.push({ name: 'adminauthorhistory', params: { authorId: id } });
}

const navigateToManuscripts = (id) => {
    router.push({ name: 'authormanuscripts', params: { authorId: id } });
}

const navigateToProfile = (id) => {
    router.push({ name: 'adminauthorprofile', params: { authorId: id } });
}

const addUploads = () => {
    AdminService.addUploads(selectedAuthorId.value, addedUploads.value).then(() => {
        authorsRequest.execute();
    });
    visibleDialog.value = false;
}

const onAddUploads = (id: string) => {
    selectedAuthorId.value = id;
    visibleDialog.value = true;
}

const changeRole = (id: string, role: string) => {
    AdminService.changeAuthorRole(id, role).then(() => {
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
                                Forfattere
                            </h3>
                        </div>
                        <div class="flex gap-3 justify-content-end align-items-center ml-auto">
                            <!-- InputGroup is used here as the IconField component was not working properly -->
                            <InputGroup class="w-15rem">
                                <InputGroupAddon>
                                    <i class="pi pi-search"></i>
                                </InputGroupAddon>
                                <InputText v-model="emailSearch" placeholder="Email Search" />
                            </InputGroup>
                            <MultiSelect v-model="selectedRoleOptions" :options="roleOptions" placeholder="Roller" class="w-full md:w-14rem"/>
                            <Dropdown v-model="selectedSortOption" :options="sortingOptions" optionLabel="name" placeholder="Sortering" class="w-full md:w-14rem">
                                <template #value="sortData">
                                    <div v-if="sortData.value" class="flex align-items-center gap-2">
                                        <div>{{ sortData.value.name }}</div>
                                        <i :class="sortData.value.icon"/>
                                    </div>
                                    <span v-else>
                                        {{ sortData.placeholder }}
                                    </span>
                                </template>
                                <template #option="sortData">
                                    <div class="flex align-items-center gap-2">
                                        <div>{{ sortData.option.name }}</div>
                                        <i :class="sortData.option.icon"/>
                                    </div>
                                </template>
                            </Dropdown>
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
                    <div class="col-12 p-0" v-for="(item, index) in slotProps.items" :key="index">
                        <div class="flex flex-row align-items-start p-2 border-top-1 surface-border surface-card justify-content-between">
                            <div class="flex align-items-center justify-content-between gap-4">
                                <div>
                                    <Chip :label="item.name || 'N/A'" class="p-text-bold p-text-uppercase"/>
                                </div>
                                <div v-if="item.email">
                                    <div class="p-text-italic">{{ item.email }}</div>
                                </div>
                                Abonnements uploads: {{ item.subscriptionUploadsRemaining }}
                                Betalte uploads: {{ item.purchasedUploadsRemaining }}
                                Ekstra uploads: {{ item.complimentaryUploadsRemaining }}
                                <Button label="Tilføj uploads" class="p-button-outlined" @click="onAddUploads(item.id)"/>
                            </div>
                            <div class="flex justify-content-between gap-2">
                                <Button label="Historie" class="p-button" @click="navigate(item.id)" />
                                <Button label="Se Manuskripter" class="p-button" @click="navigateToManuscripts(item.id)" />
                                <Dropdown v-model="item.role" :options="roles" :placeholder="item.role" @change="changeRole(item.id, item.role)" />
                            </div>
                        </div>
                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="xl:col-3 lg:col-4 md:col-6 sm:col-12 p-2" v-for="(item, index) in slotProps.items" :key="index">
                        <div class="flex flex-column align-items-start h-full p-3 gap-2 border-1 surface-border surface-card border-round justify-content-between">
                            <div class="flex justify-content-between w-full">
                                <Chip :label="item.name || 'N/A'" class="p-text-bold p-text-uppercase"/>
                                <Button label="Tilføj uploads" class="p-button-outlined" @click="onAddUploads(item.id)"/>
                            </div>
                            <div v-bind:class="item.email ? 'justify-content-between' : 'justify-content-end'" class="flex w-full">
                                <div v-if="item.email" class="p-text-italic">{{ item.email }}</div>
                                <div class="flex gap-2 flex-column">
                                    <span>Abonnements uploads: {{ item.subscriptionUploadsRemaining }}</span>
                                    <span>Betalte uploads: {{ item.purchasedUploadsRemaining }}</span>
                                    <span>Ekstra uploads: {{ item.complimentaryUploadsRemaining }}</span>
                                </div>
                            </div>
                            <Dropdown v-model="item.role" :options="roles" :placeholder="item.role" @change="changeRole(item.id, item.role)" class="w-full my-3" />
                            <div class="w-full flex gap-2 justify-content-between">
                                <Button label="Historie" class="p-button" @click="navigate(item.id)" />
                                <Button label="Se Profil" class="p-button" @click="navigateToProfile(item.id)" />
                                <Button label="Se Manuskripter" class="p-button" @click="navigateToManuscripts(item.id)" />
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

    <Dialog v-model:visible="visibleDialog" modal header="Tilføj uploads">
        <div class="flex flex-column gap-2">
            <label for="username">Hvor mange uploads vil du tilføje?</label>
            <InputNumber v-model="addedUploads" :useGrouping="false" />
        </div>
        <template #footer>
            <Button label="Annuller" icon="pi pi-times" @click="visibleDialog = false" text />
            <Button label="Tilføj" icon="pi pi-check" @click="addUploads()" autofocus />
        </template>
    </Dialog>
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

    > :deep(.p-dataview-header) {
        border-top: none;
    }

    > :deep(.p-dataview-content) {
        flex: 1;
        overflow: auto;
        background-color: var(--surface-ground);
    }
}
</style>