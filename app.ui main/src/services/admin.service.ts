import { useMyFetch } from '@core/api.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import { computed, ComputedRef, Ref } from 'vue';
import { PageOfManuscript, PageOfManuscriptRevision } from '@interface/Manuscript.ts';
import { Author, AuthorRole, PageOfAuthor } from '@interface/Author.ts';
import { PageOfDetailedHistoryEvent } from '@interface/History.ts';
import { PageOfInvoice, PageOfSubscription } from '@interface/Payment.ts';
import { GetAuthorSubscriptions, GetDefaultSortOptions } from '@service/author.service.ts';

interface GetAllManuscriptsOptions {
    page?: number,
    pageSize?: number,
    sortBy?: string,
    authorId?: string,
    minimumGlobalScore?: number
}

interface GetAllAuthorsOptions {
    roles?: AuthorRole[],
    page?: number,
    pageSize?: number,
    sort?: string,
    order?: string,
    email?: string
}

const GlobalPageSize = 50;
export const AdminService = {
    getAllManuscripts(options: ComputedRef<GetAllManuscriptsOptions>) {
        return useMyFetch(
            computed(() => {
                const params = new URLSearchParams();
                const pageSize = options.value.pageSize ?? GlobalPageSize;
                params.append('pageSize', pageSize.toString());
                if (options.value.page !== undefined) {
                    params.append('page', options.value.page.toString());
                }
                if (options.value.sortBy !== undefined) {
                    params.append('sortBy', options.value.sortBy);
                }
                if (options.value.authorId !== undefined) {
                    params.append('authorId', options.value.authorId);
                }
                if (options.value.minimumGlobalScore) {
                    params.append('minimumGlobalScore', options.value.minimumGlobalScore.toString());
                }
                return `admin/manuscripts/?${params}`;
            }),
            { refetch: true }
        ).json<PageOfManuscript>();
    },
    getManuscriptRevisions(id: string) {
        return useMyFetch(`admin/manuscripts/${id}/revisions/`, { refetch: true }).json<PageOfManuscriptRevision>();
    },
    getManuscriptRevisionData(id: string, revisionId: Ref<string>, models?: ModelResultDataModelEnum[]) {
        const getModels = () => {
            return (models !== undefined && models.length !== 0) ? `?models=${models.join(',')}` : '';
        }

        return useMyFetch(
            computed(() => `admin/manuscripts/${id}/revisions/${revisionId.value}/${getModels()}`),
            { refetch: true, immediate: false }
        ).json<ModelResultData[]>();
    },
    getAllAuthors(options: ComputedRef<GetAllAuthorsOptions>) {
        return useMyFetch(computed(() => {
            let params = new URLSearchParams();
            const pageSize = options.value.pageSize ?? GlobalPageSize;
            params.append('pageSize', pageSize.toString());
            if (options.value.page !== undefined) {
                params.append('page', options.value.page.toString());
            }
            if (options.value.roles !== undefined && options.value.roles.length > 0) {
                params.append('roles', options.value.roles.join(','));
            }
            if (options.value.sort !== undefined && options.value.order !== undefined) {
                let sortBy = options.value.sort.toUpperCase() + '_' + options.value.order.toUpperCase()
                if (options.value.order !== 'desc') {
                    sortBy = options.value.sort.toUpperCase()
                }
                params.append('sortBy', sortBy);
            }
            if (options.value.email !== undefined && options.value.email !== '') {
                params.append('email', options.value.email);
            }
            return `admin/authors/?${params}`;
        }), { refetch: true }).json<PageOfAuthor>();
    },
    getAuthor(id: string) {
        return useMyFetch(`admin/authors/${id}/`, { refetch: true }).json<Author>();
    },
    getAuthorHistory(id: string, options: ComputedRef<GetDefaultSortOptions>) {
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
            return `admin/authors/${id}/history/?${params}`;
        }), { refetch: true }).json<PageOfDetailedHistoryEvent>();
    },
    getAuthorSubscription(id: string, options: ComputedRef<GetAuthorSubscriptions>) { // PageOfSubscription
        return useMyFetch(computed(() => {
            let params = new URLSearchParams();
            const pageSize = options.value.pageSize ?? GlobalPageSize;
            params.append('pageSize', pageSize.toString());
            if (options.value.page !== undefined) {
                params.append('page', options.value.page.toString());
            }
            return `admin/authors/${id}/subscriptions/?${params}`;
        }), { refetch: true }).json<PageOfSubscription>();
    },

    getAuthorInvoices(id: string, options: ComputedRef<GetDefaultSortOptions>) {
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
            return `admin/authors/${id}/invoices/?${params}`;
        }), { refetch: true }).json<PageOfInvoice>();
    },
    changeAuthorRole(id: string, role: string) {
        return useMyFetch(`admin/authors/${id}/role?newRole=${role}`, {
            method: 'PATCH',
        }).json<Author>();
    },
    addUploads(id: string, complimentaryUploads: number) {
        return useMyFetch(`admin/authors/${id}/complimentaryUploads?complimentaryUploads=${complimentaryUploads}`, {
            method: 'PATCH',
        }).json<Author>();
    },
    updateTrialReport(isbn: string) {
        return useMyFetch(`admin/config/trial-report/?isbn=${isbn}`, {
            method: 'PUT',
        }).json<number>();
    }
}
