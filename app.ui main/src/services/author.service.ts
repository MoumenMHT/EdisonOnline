import { useMyFetch } from "@core/api.ts";
import { AuthorStatus } from "@interface/Author.ts";
import { AuthorSetting } from '@interface/defaultModels.ts';
import { computed, ComputedRef } from 'vue';
import { PageOfHistoryEvent } from '@interface/History.ts';
import { PageOfInvoice, PageOfSubscription } from '@interface/Payment.ts';

export interface GetDefaultSortOptions {
    page?: number,
    pageSize?: number,
    endTime?: any,
    startTime?: any,
}

export type GetAuthorSubscriptions = Omit<GetDefaultSortOptions, 'endTime' | 'startTime'>

const GlobalPageSize = 20;

export const AuthorService = {
    getAuthorStatus() {
        return useMyFetch(`author/status`, { refetch: true }).json<AuthorStatus>();
    },
    
    getAuthourSettings() {
        return useMyFetch(`author/settings/`).json<AuthorSetting[]>();
    },
    
    getAuthorHistory(options: ComputedRef<GetDefaultSortOptions>) {
        return useMyFetch(computed(() => {
            let params = new URLSearchParams();
            const pageSize = options.value.pageSize ?? GlobalPageSize;
            params.append('pageSize', pageSize.toString());
            if (options.value.page !== undefined) {
                params.append('page', options.value.page.toString());
            }
            if (options.value.startTime !== undefined) {
                params.append('startTime', options.value.startTime.toString());
            }
            if (options.value.endTime !== undefined) {
                params.append('endTime', options.value.endTime.toString());
            }
            return `author/history/?${params}`;
        }), { refetch: true }).json<PageOfHistoryEvent>();
    },
    
    getAuthorSubscription(options: ComputedRef<GetAuthorSubscriptions>) { // PageOfSubscription
        return useMyFetch(computed(() => {
            let params = new URLSearchParams();
            const pageSize = options.value.pageSize ?? GlobalPageSize;
            params.append('pageSize', pageSize.toString());
            if (options.value.page !== undefined) {
                params.append('page', options.value.page.toString());
            }
            return `author/subscriptions/?${params}`;
        }), { refetch: true }).json<PageOfSubscription>();
    },
    
    getAuthorInvoices(options: ComputedRef<GetDefaultSortOptions>) {
        return useMyFetch(computed(() => {
            let params = new URLSearchParams();
            const pageSize = options.value.pageSize ?? GlobalPageSize;
            params.append('pageSize', pageSize.toString());
            if (options.value.page !== undefined) {
                params.append('page', options.value.page.toString());
            }
            if (options.value.startTime !== undefined) {
                params.append('startTime', options.value.startTime.toString());
            }
            if (options.value.endTime !== undefined) {
                params.append('endTime', options.value.endTime.toString());
            }
            return `author/invoices/?${params}`;
        }), { refetch: true }).json<PageOfInvoice>();
    },

    updateAuthorSettings(settings: Array<AuthorSetting>) {
        return useMyFetch(`author/settings/`, {
            method: 'POST',
            body: JSON.stringify(settings),
        });
    },

    updateAuthorSetting(setting: AuthorSetting) {
        return useMyFetch(`author/settings/`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([ setting ]),
        });
    },
    
    deleteAuthorSetting(setting: string) {
        return useMyFetch(`author/settings/${setting}`, {
            method: 'DELETE',
        });
    },

    deleteAllAuthorSetting() {
        return useMyFetch(`author/settings/`, {
            method: 'DELETE',
        });
    },
    
    cancelSubscription() {
        // author/subscriptions/cancel
        return useMyFetch(`author/subscriptions/cancel`, {
            method: 'POST',
        });
    }
};
