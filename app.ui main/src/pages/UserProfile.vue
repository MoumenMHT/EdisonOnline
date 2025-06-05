<script setup lang="ts">
import { getUser } from '@core/auth.ts';
import { computed, ComputedRef, ref, watch } from 'vue';
import { Author, AuthorRole, AuthorStatus } from '@interface/Author.ts';
import { useMainStore } from '@store/main.ts';
import { HistoryEvent } from '@interface/History.ts';
import { AuthorService } from '@service/author.service.ts';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';
import Paginator from 'primevue/paginator';
import {
    AccessLevel,
    Invoice,
    Subscription,
    SubscriptionStatus
} from '@interface/Payment.ts';
import Button from 'primevue/button';
import TabMenu, { TabMenuChangeEvent } from 'primevue/tabmenu';
import { useConfirm } from "primevue/useconfirm";
import { MenuItem } from 'primevue/menuitem/MenuItem';
import { cloneDeep } from 'lodash';
import { AdminService } from '@service/admin.service.ts';
import { useRoute } from 'vue-router';
import Loader from "@/components/loader.vue";
import { sha256 } from 'js-sha256';

const store = useMainStore();
const confirm = useConfirm();
const route = useRoute();
const currentUser = ref<Author | AuthorStatus>();
const activeSubscription = ref<Subscription>();
let getUserName: ComputedRef<string>;
let getUserEmail: ComputedRef<string>;
let getUserNickname: ComputedRef<string>;
let getUserPicture: ComputedRef<string>;
let getUserAccessLevel: ComputedRef<AuthorRole | AccessLevel>;

const subscriptionExpire = computed(() => {
    if (activeSubscription.value === undefined) {
        return '';
    }
    if (activeSubscription.value.currentPeriodEnd === undefined) {
        return '';
    }
    return formatISODate(activeSubscription.value.currentPeriodEnd);
})

let complimentaryUploadsRemaining: ComputedRef<number>;
let subscriptionUploadsRemaining: ComputedRef<number>;
let purchasedUploadsRemaining: ComputedRef<number>;
const totalUploadLeft: ComputedRef<string> = computed(() => {
    const total = complimentaryUploadsRemaining.value + subscriptionUploadsRemaining.value + purchasedUploadsRemaining.value;
    return total.toString();
});

let historyRequest;
let invoiceRequest;
let activeSubscriptionRequest;

const history = ref<HistoryEvent[]>([]);
const invoices = ref<Invoice[]>([]);

const historyPage = ref<number>(0);
const historyPageSize = ref<number>(12);
const historyTotalElements = ref<number>(0);
const historyStartDate = ref<Date>();
const historyEndDate = ref<Date>();

const invoicesPage = ref<number>(0);
const invoicesPageSize = ref<number>(12);
const invoicesTotalElements = ref<number>(0);
const invoicesStartDate = ref<Date>();
const invoicesEndDate = ref<Date>();

const ListItems = ref<MenuItem[]>([
    { label: 'Historie', icon: 'pi pi-info-circle' },
    { label: 'Fakturaer', icon: 'pi pi-credit-card' },
]);
const currentTab = ref(0);

const isLoading = ref(true);

const tabChangeCallback = (event: TabMenuChangeEvent) => {
    if (event.index === currentTab.value) {
        return;
    }
    currentTab.value = event.index;
}

const onPaginate = async (e) => {
    switch (currentTab.value) {
        case 0: // History
            historyPage.value = cloneDeep(e.page);
            await updateHistory();
            break;
        case 1: // Invoices
            invoicesPage.value = cloneDeep(e.page);
            await updateInvoices();
            break;
    }
    document.getElementsByClassName('p-datatable-content')[0]?.scrollTo({top: 0, behavior: 'smooth'});
};

const updateHistory = async () => {
    const res = await historyRequest;
    history.value = res.data.value!.content;
    historyPage.value = res.data.value!.page;
    historyPageSize.value = res.data.value!.pageSize;
    historyTotalElements.value = res.data.value!.totalElements;
}

const updateInvoices = async () => {
    const res = await invoiceRequest;
    invoices.value = res.data.value!.content;
    invoicesPage.value = res.data.value!.page;
    invoicesPageSize.value = res.data.value!.pageSize;
    invoicesTotalElements.value = res.data.value!.totalElements;
}

const page = computed(() => {
    // this is used for the first value on the paginator.
    // value should always be (page number) * (page size)
    switch (currentTab.value) {
        case 0: // History
            return historyPage.value * historyPageSize.value;
        case 1: // Invoices
            return invoicesPage.value * invoicesPageSize.value;
        default:
            return 0;
    }
});

const pageSize = computed(() => {
    switch (currentTab.value) {
        case 0: // History
            return historyPageSize.value;
        case 1: // Invoices
            return invoicesPageSize.value;
        default:
            return 0;
    }
});

const totalElements = computed(() => {
    switch (currentTab.value) {
        case 0: // History
            return historyTotalElements.value;
        case 1: // Invoices
            return invoicesTotalElements.value;
        default:
            return 0;
    }
});

// Todo Find out how to make this work with the tabs
const startDate = ref<Date>();
const endDate = ref<Date>();

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

const dataTableValue = computed(() => {
    switch (currentTab.value) {
        case 0: // History
            return history.value;
        case 1: // Invoices
            return invoices.value;
        default:
            return [];
    }
})

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

const formatUppercaseString = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const formatISODate = (dateString: string): string => {
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

const loading = computed<boolean>(() => historyRequest.isFetching.value);

const configCancel = () => {
    confirm.require({
        message: 'Er du sikker på du vil opsige dit abonnement?',
        header: 'Opsig Abonnement',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Nej',
        acceptLabel: 'Ja',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            AuthorService.cancelSubscription().then(() => {
                activeSubscriptionRequest.execute();
            });
        },
    });
};

const translatePrice = (price: number, currency: string) => {
    switch (currency.toUpperCase()) {
        case 'DKK':
            return price/100 + ' kr.';
        default:
            return price + ' ' + currency;
    }
}
const gotoInvoice = (url: string) => {
    window.open(url, '_blank');
}

const fetchData = async () => {
    isLoading.value = true;
    let authorPromise;
    let historyPromise;
    let invoicePromise;
    let subscriptionPromise;
    if (route.params.authorId) {
        const authorRequest = AdminService.getAuthor(route.params.authorId as string);
        authorPromise = authorRequest.then((res) => {
            const author = res.data.value as Author;
            currentUser.value = author;
            currentUser.value = author;
            getUserName = computed(() => author.name ?? '');
            getUserEmail = computed(() => author.email ?? '');
            getUserNickname = computed(() => author.nickname ?? '');
            const address = String(author.email).trim().toLowerCase();
            const hash = sha256(address);
            getUserPicture = computed(() => `https://www.gravatar.com/avatar/${hash}?d=mp`);
            getUserAccessLevel = computed(() => author.role ?? '');
            complimentaryUploadsRemaining = computed(() => author.complimentaryUploadsRemaining ?? 0);
            subscriptionUploadsRemaining = computed(() => author.subscriptionUploadsRemaining ?? 0);
            purchasedUploadsRemaining = computed(() => author.purchasedUploadsRemaining ?? 0);
        });

        historyRequest = AdminService.getAuthorHistory(route.params.authorId as string, computed(() => {
            return {
                page: historyPage.value,
                pageSize: historyPageSize.value,
                startTime: historyStartDate.value?.toISOString(),
                endTime: historyEndDate.value?.toISOString(),
            }
        }));

        invoiceRequest = AdminService.getAuthorInvoices(route.params.authorId as string, computed(() => {
            return {
                page: invoicesPage.value,
                pageSize: invoicesPageSize.value,
                startTime: invoicesStartDate.value?.toISOString(),
                endTime: invoicesEndDate.value?.toISOString(),
            }
        }));

        activeSubscriptionRequest = AdminService.getAuthorSubscription(route.params.authorId as string, computed(() => {
            return {
                pageSize: 1,
            }
        }));
    } else {
        authorPromise = Promise.resolve();
        currentUser.value = store.currentUser as AuthorStatus;
        const user = currentUser.value as AuthorStatus;
        const auth0User = getUser().value;
        getUserName = computed(() => user.name ?? auth0User?.name ?? '');
        getUserEmail = computed(() => user.email ?? auth0User?.email ?? '');
        getUserNickname = computed(() => user.nickname ?? auth0User?.nickname ?? '');
        getUserPicture = computed(() => auth0User?.picture ?? '');
        getUserAccessLevel = computed(() => user.accessLevel ?? '');
        complimentaryUploadsRemaining = computed(() => user.complimentaryUploadsRemaining ?? 0);
        subscriptionUploadsRemaining = computed(() => user.subscriptionUploadsRemaining ?? 0);
        purchasedUploadsRemaining = computed(() => user.purchasedUploadsRemaining ?? 0);
        historyRequest = AuthorService.getAuthorHistory(computed(() => {
            return {
                page: historyPage.value,
                pageSize: historyPageSize.value,
                startTime: historyStartDate.value?.toISOString(),
                endTime: historyEndDate.value?.toISOString(),
            }
        }));

        invoiceRequest = AuthorService.getAuthorInvoices(computed(() => {
            return {
                page: invoicesPage.value,
                pageSize: invoicesPageSize.value,
                startTime: invoicesStartDate.value?.toISOString(),
                endTime: invoicesEndDate.value?.toISOString(),
            }
        }));

        activeSubscriptionRequest = AuthorService.getAuthorSubscription(computed(() => {
            return {
                pageSize: 1,
            }
        }));
    }

    historyPromise = historyRequest.then((res) => {
        history.value = res.data.value!.content;
        historyPage.value = res.data.value!.page;
        historyPageSize.value = res.data.value!.pageSize;
        historyTotalElements.value = res.data.value!.totalElements;
    });
    invoicePromise = invoiceRequest.then((res) => {
        invoices.value = res.data.value!.content;
        invoicesPage.value = res.data.value!.page;
        invoicesPageSize.value = res.data.value!.pageSize;
        invoicesTotalElements.value = res.data.value!.totalElements;
    });
    subscriptionPromise = activeSubscriptionRequest.then((res) => {
        activeSubscription.value = res.data.value!.content[0];
    });

    await Promise.all([authorPromise, historyPromise, invoicePromise, subscriptionPromise]);

    isLoading.value = false;
}

watch(route, fetchData, { immediate: true });

</script>

<template>
    <div v-if="isLoading">
        <loader/>
    </div>
    <div v-else class="profile-container">
        <div class="col s3">
            <div class="col-item column align-center">
                <img :src="getUserPicture"  alt="user profile image"/>
                <div class="mb-3 text-2xl">{{ getUserName }}</div>
                <div class="header" >
                    Abonnement
                </div>
                <div class="text-5xl underline">
                    {{ getUserAccessLevel }}
                </div>
            </div>
        </div>
        <div class="col s9 data-wrapper">
            <div class="data-table">
                <div class="data-table-body">
                    <div class="data-table-row">
                        <div class="data-table-cell header">Navn</div>
                        <div class="data-table-cell">{{ getUserName }}</div>
                    </div>
                    <div class="data-table-row">
                        <div class="data-table-cell header">Nicknavn</div>
                        <div class="data-table-cell">{{ getUserNickname }}</div>
                    </div>
                    <div class="data-table-row">
                        <div class="data-table-cell header">Email</div>
                        <div class="data-table-cell">{{ getUserEmail }}</div>
                    </div>
                    <div class="data-table-row">
                        <div class="data-table-cell header">Uploads tilbage</div>
                        <div class="data-table-cell">{{ totalUploadLeft }}</div>
                    </div>
                    <div class="data-table-row" v-if="activeSubscription !== undefined">
                        <div class="data-table-cell header">Abonnement udløbsdato</div>
                        <div class="data-table-cell">{{ subscriptionExpire }}</div>
                    </div>
                    <div class="data-table-row" v-if="activeSubscription !== undefined">
                        <div class="data-table-cell header">Abonnement status</div>
                        <div class="data-table-cell no-padding">
                            <div class="subscript-wrapper">
                                <div class="subscription-status">{{ activeSubscription.status }}</div>
                                <div class="subscription-cancel h-full" v-if="activeSubscription.status===SubscriptionStatus.Active && !route.params.authorId">
                                    <Button
                                        :pt="{
                                            root: { 
                                                class: 'h-full border-noround',
                                                style: 'box-shadow: none !important;'
                                            },
                                        }"
                                        label="Opsig Abonnement"
                                        severity="danger" 
                                        @click="configCancel()" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col s12">
            <div class="col-item column data-table">
                <DataTable
                    :value="dataTableValue"
                    dataKey="eventTime"
                    :pt="{
                        root: {
                            style: { 
                                minWidth: '60rem',
                            },
                        },
                        header: {
                            class: 'surface-ground',
                            style: {
                                borderTop: 'none',
                                flexGrow: '0',
                                padding: '0',
                            }
                        },
                }"
                    stripedRows scrollable
                    @loading="loading.valueOf()"
                >
                    <template #header>
                        <div class="flex flex-row justify-content-between">
<!--                            <h3 class="flex flex-column my-0 justify-content-around text-primary">-->
<!--                                Historie-->
<!--                            </h3>-->
                            <div class="flex-auto flex align-items-end">
                                <TabMenu 
                                    :model="ListItems"
                                    :activeIndex="currentTab"
                                    @tabChange="tabChangeCallback"
                                    :pt="{
                                        root: {
                                            class: 'flex-auto'
                                        }
                                    }"
                                />
                            </div>
                            <div class="flex flex-row gap-3 px-3 py-2" style="border-bottom: 2px solid var(--text-color-secondary)">
                                <Calendar v-model="startDate" :max-date="endDate" placeholder="Start Date" inputId="start_date" dateFormat="dd/mm/yy" />
                                <Calendar v-model="endDate" :min-date="startDate" placeholder="End Date" inputId="end_date" dateFormat="dd/mm/yy" />
                            </div>
                        </div>
                    </template>
                    <!-- History -->
                    <Column field="message" header="Message" v-if="currentTab===0" />
                    <Column 
                        header="Event Type" 
                        v-if="currentTab===0"
                        :pt="{
                            root: { 
                                class: 'px-4',
                                style: 'width: 1%; white-space: nowrap;',
                            },
                        }">
                        <template #body="slotProps">
                            <div class="gap-3">
                                <i :class="getEventIcon(slotProps.data.eventType)"/>
                                {{formatUppercaseString(slotProps.data.eventType) + ': ' + formatUppercaseString(slotProps.data.eventSubType)}}
                            </div>
                        </template>
                    </Column>
                    <Column 
                        field="eventTime" 
                        header="Event Time" 
                        v-if="currentTab===0"
                        :pt="{
                            root: { 
                                class: 'px-4',
                                style: 'width: 1%; white-space: nowrap;',
                            },
                        }">
                        <template #body="slotProps">
                            {{formatISODate(slotProps.data.eventTime)}}
                        </template>
                    </Column>
                    <!-- Invoices -->
                    <column field="productName" header="Produkt" v-if="currentTab===1" />
                    <column 
                        field="amountPaid" 
                        header="Betalt" 
                        v-if="currentTab===1"
                        :pt="{
                            root: { 
                                class: 'px-4',
                                style: 'width: 1%; white-space: nowrap;',
                            },
                        }">
                        <template #body="slotProps">
                            {{ translatePrice(slotProps.data.amountPaid, slotProps.data.currency) }}
                        </template>
                    </Column>
                    <column 
                        field="created" 
                        header="Dato" 
                        v-if="currentTab===1"
                        :pt="{
                            root: { 
                                class: 'px-4',
                                style: 'width: 1%; white-space: nowrap;',
                            },
                        }"
                    >
                        <template #body="slotProps">
                            {{formatISODate(slotProps.data.created)}}
                        </template>
                    </Column>
                    <column 
                        field="hostedInvoiceUrl" 
                        header="Faktura" 
                        v-if="currentTab===1"
                        :pt="{
                            root: { 
                                class: 'p-0',
                                style: 'width: 1%; white-space: nowrap;',
                            },
                        }"
                    >
                        <template #body="slotProps">
                            <Button
                                :pt="{
                                    root: { 
                                        class: 'h-full border-noround',
                                        style: 'box-shadow: none !important;'
                                    },
                                }"
                                label="Faktura"
                                @click="gotoInvoice(slotProps.data.hostedInvoiceUrl)"
                            />
                            <Button
                                :pt="{
                                    root: { 
                                        class: 'h-full border-noround',
                                        style: 'box-shadow: none !important;'
                                    },
                                }"
                                label="PDF"
                                @click="gotoInvoice(slotProps.data.pdfInvoiceUrl)"
                            />
                        </template>
                    </Column>
                    
                </DataTable>
                <div class="paginator-wrapper" style="min-height: 2rem; background: var(--surface-footer);">
                    <Paginator :first="page" :rows="pageSize" :totalRecords="totalElements" @page="onPaginate" v-if="pageSize<totalElements" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@mixin data-wrapper {
    flex: 0 1 auto;
    
    > .data-table {
        display: table;
        table-layout: fixed;
        border-radius: 1.75rem;
        border: 1px solid #E4B200;
        background: #3F3F3F;
        width: calc(100% - 2px); // 2px = border
        height: calc(100% - 2px); // 2px = border
        background: rgba(217, 217, 217, 0.13);
        overflow: hidden;
    
        > .data-table-body {
            display: table-row-group;
    
            > .data-table-row {
                display: table-row;
    
                &.header {
                    > .data-table-cell {
                        font-size: 1.25rem;
                        font-weight: 600;
                        color: var(--primary-color);
                    }
                }
    
                &:not(:last-child) {
                    > .data-table-cell {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.29);
                    }
                }
    
                > .data-table-cell {
                    display: table-cell;
                    vertical-align: middle;
                    
                    &:not(.no-padding) {
                        padding: 0.5rem 1.5rem;
                    }
    
                    &.header {
                        font-size: 1.25rem;
                        font-weight: 600;
                        color: var(--primary-color);
                    }
                    
                    &:not(:last-child) {
                        border-right: 1px solid rgba(255, 255, 255, 0.29);
                    }
                    
                    > .subscript-wrapper {
                        display: flex;
                        justify-content: space-between;
                        height: 100%;
                        align-items: center;
                        
                        > .subscription-status {
                            padding: 0 1.5rem;
                        }
                    }
                }
            }
        }
    }
}

.profile-container {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem 5rem;
    // 1200px is the min size before this layout breaks.
    min-width: calc(1200px);
    max-width: calc(2000px);
    margin: auto;

    > .col {
        flex: 0 0 auto;
        padding: 1rem;

        &.s3 {
            width: 25%;
        }
        
        &.s4 {
            width: 33.3333%;
        }

        &.s8 {
            width: 66.6667%;
        }
        
        &.s9 {
            width: 75%;
        }

        &.s12 {
            width: 100%;
        }

        &.min-width {
            @media only screen and (max-width: 1441px) {
                min-width: 50%;
            }
        }

        &.data-wrapper {
            @include data-wrapper;
        }

        > .col-item {
            padding: 1rem;
            border-radius: 1.75rem;
            border: 1px solid #E4B200;
            background: #3F3F3F;

            width: calc(100% - 2px); // 2px = border
            height: calc(100% - 2px); // 2px = border

            display: flex;
            flex-direction: row;

            &.column {
                flex-direction: column;
            }

            &.justify-center {
                justify-content: center;
            }

            &.align-center {
                align-items: center;
            }

            &.align-start {
                align-items: flex-start;
            }
            
            &.data-table {
                padding: 0;
                overflow: hidden;
            }

            > .align-center-me {
                align-self: center;
            }

            > .margin-left-auto {
                margin-left: auto;
            }

            > .align-start-me {
                align-self: flex-start;
            }

            > .header {
                flex-shrink: 0;
                border-radius: 0.75rem;
                border: 1px solid #E4B200;
                background: #E4B200;
                color: #2C2C2C;
                text-align: center;
                font-weight: 600;
                font-size: 1.25rem;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0.25rem 1rem;
                margin-bottom: 1.25rem;
            }

            > .headline {
                color: #E4B200;
                font-size: 2rem;
                font-weight: 600;
                width: 100%;
                
                &.underline {
                    border-bottom: 1px solid #E4B200;
                    text-decoration: none !important;
                }
            }
            
            > .underline {
                border-bottom: 1px solid #E4B200;
                text-decoration: none !important;
            }
            
            > .data-wrapper {
                @include data-wrapper;
            }
            
            > img {
                border-radius: 50%;
                margin-bottom: 1rem;
            }
        }
    }
}
</style>