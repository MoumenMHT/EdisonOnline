<script setup lang="ts">
import { useRoute } from "vue-router";
import { AdminService } from "@service/admin.service.ts";
import { ref, watch, computed } from "vue";
import { DetailedHistoryEvent, PageOfDetailedHistoryEvent } from "@interface/History.ts";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import TreeTable from 'primevue/treetable';
import Calendar from 'primevue/calendar';
import Paginator from "primevue/paginator";
import Loader from "@component/loader.vue";
import { Author } from "@interface/Author.ts";

interface DetailsTreeNode {
    key: string;
    data: {
        name: string;
        value: string;
    };
    children?: DetailsTreeNode[];
}

const route = useRoute();
const expandedRows : any = ref([]);
const authorId = route.params.authorId as string;
const author = ref<Author>();

const history = ref<DetailedHistoryEvent[]>()

const startDate = ref<Date>();
const endDate = ref<Date>();

const authorRequest = AdminService.getAuthor(authorId);

watch(authorRequest.data, (value) => {
    if (value) {
        author.value = value;
    }
});

watch(startDate, (newStartDate) => {
    if (endDate.value && newStartDate && newStartDate > endDate.value) {
        endDate.value = newStartDate;
    }
});

watch(endDate, (newEndDate) => {
    if (startDate.value && newEndDate && startDate.value > newEndDate) {
        startDate.value = newEndDate;
    }
});

const page = ref<number>(0);
const pageSize = ref<number>(12);
const totalElements = ref<number>(0);

function getEventIcon(type: string) {
    switch (type) {
        case 'AUTHOR':
            return 'pi pi-fw pi-user-edit';
        case 'PAYMENT':
            return 'pi pi-fw pi-credit-card';
        case 'SUBSCRIPTION':
            return 'pi pi-fw pi-envelope';
        case 'MANUSCRIPT':
            return 'pi pi-fw pi-book';
    }
}

function formatUppercaseString(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatISODate(dateString: string): string {
    // create a Date object from the ISO string
    const date = new Date(dateString);

    // create options for date and time formatting
    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: false,
    };

    // format date and time using the user's locale
    const formattedDate = date.toLocaleDateString('da-DK', dateOptions);
    const formattedTime = date.toLocaleTimeString('da-DK', timeOptions);

    return `${formattedDate} ${formattedTime}`;
}

const populateTreeTable = (data: any, parentKey?: string): DetailsTreeNode[] => {
    let key = 0;
    const outData: DetailsTreeNode[] = [];
    const isArray = Array.isArray(data);
    for (const dataKey in data) {
        let value: any = data[dataKey];
        let children: DetailsTreeNode[] = [];
        if (Array.isArray(value) || typeof value === 'object'){
            children = populateTreeTable(value, key.toString());
            value = '';
        }

        const treeNode: DetailsTreeNode = {
            key: (parentKey ? parentKey + '-' : '') + key.toString(),
            data: {
                name: isArray ? '' : dataKey,
                value: value,
            }
        }

        if (children.length > 0) {
            treeNode.children = children;
        }

        outData.push(treeNode);
        key++;
    }

    return outData;
}

const historyRequest = AdminService.getAuthorHistory(authorId, computed(() => {
    return {
        page: page.value,
        pageSize: pageSize.value,
        startTime: startDate.value?.toISOString(),
        endTime: endDate.value?.toISOString(),
    }
}));
watch(historyRequest.data, (value) => {
    if (value) {
        // todo - find a better solution for this.
        const stuff = value as PageOfDetailedHistoryEvent;
        history.value = stuff.content;
        page.value = stuff.page;
        pageSize.value = stuff.pageSize;
        totalElements.value = stuff.totalElements;
    }
});
const loading = computed<boolean>(() => historyRequest.isFetching.value || authorRequest.isFetching.value);
const onPaginate = (e) => {
  page.value = e.page;
  document.getElementsByClassName('p-datatable-content')[0]?.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
    <div class="history-wrapper">
        <div class="datatable-wrapper">
            <Loader v-if="loading" />
            <DataTable
                v-else
                v-model:expandedRows="expandedRows"
                :value="history"
                dataKey="eventTime"
                :pt="{
                    header: {
                        class: 'surface-ground',
                        style: {
                            border: 'none',
                            flexGrow: '0',
                        }
                    },
                    root: {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            overflow: 'auto',
                        }
                    },
                    wrapper: {
                        style: {
                            flexGrow: '1',
                        }
                    },
                    table: {
                        style: {
                            minWidth: '50rem',
                        }
                    }
                }"
                :tableStyle="{ minWidth: '60rem'}"
                stripedRows scrollable
            >
                <template #header>
                    <div class="flex flex-row justify-content-between">
                        <h3 class="flex flex-column my-0 justify-content-around text-white">
                          Historie for {{ author?.name }}
                        </h3>
                        <div class="flex flex-row gap-3">
                            <Calendar v-model="startDate" :max-date="endDate" placeholder="Start Date" inputId="start_date" dateFormat="dd/mm/yy" />
                            <Calendar v-model="endDate" :min-date="startDate" placeholder="End Date" inputId="end_date" dateFormat="dd/mm/yy" />
                        </div>
                    </div>
                </template>
                <Column expander style="width: 5rem" />
                <Column field="message" header="Message"></Column>
                <Column header="Event Type">
                    <template #body="slotProps">
                        <div class="gap-3">
                            <i :class="getEventIcon(slotProps.data.eventType)"/>
                            {{formatUppercaseString(slotProps.data.eventType) + ': ' + formatUppercaseString(slotProps.data.eventSubType)}}
                        </div>
                    </template>
                </Column>
                <Column field="eventTime" header="Event Time">
                    <template #body="slotProps">
                        {{formatISODate(slotProps.data.eventTime)}}
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="font-medium font-bold mt-0 m-2">Details</div>
                        <TreeTable class="p-treetable-sm" :value="populateTreeTable(slotProps.data.details)">
                            <Column field="name" header="Name" expander></Column>
                            <Column field="value" header="Value"></Column>
                        </TreeTable>
                </template>
            </DataTable>
        </div>
        <div class="paginator-wrapper" v-if="pageSize<totalElements">
          <Paginator :rows="pageSize" :totalRecords="totalElements" @page="onPaginate"></Paginator>
        </div>
    </div>
</template>

<style scoped lang="scss">
.history-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .datatable-wrapper {
    flex-grow: 1;
    width: 100%;
    overflow:auto;
  }

  .paginator-wrapper {
    border-top: 1px solid var(--surface-border);
  }
}

</style>