// TODO - Replace custom url search params functions with 'new URLSearchParams()'
import { useMyFetch } from "@core/api.ts";
import { PageOfManuscript, PageOfManuscriptRevision } from "@interface/Manuscript.ts";
import { UploadManuscriptRequest } from "@interface/Api.ts";
import { ModelResultData, ModelResultDataModelEnum, ModelResultDataSectionEnum } from "@interface/Model.ts";
import { computed, ref, Ref } from 'vue';
import { SimilarBookMetadata } from "@interface/defaultModels.ts";
const GlobalPageSize = 20;
export const ManuscriptService = {
    getManuscripts(page: Ref<number>, pageSize: Ref<number> = ref(GlobalPageSize)) {
        return useMyFetch(
            computed(() => `manuscripts/?pageSize=${pageSize.value}&page=${page.value}`), 
            { refetch: true }
        ).json<PageOfManuscript>();
    },
    getManuscriptRevisions(id: string) {
        return useMyFetch(`manuscripts/${id}/revisions/`, { refetch: true }).json<PageOfManuscriptRevision>();
    },
    getManuscriptRevisionData(id: string, revisionId: Ref<string>, models?: ModelResultDataModelEnum[]) {
        const getModels = () => {
            return (models !== undefined && models.length !== 0) ? `?models=${models.join(',')}`:'';
        }
        return useMyFetch(
            computed(() => `manuscripts/${id}/revisions/${revisionId.value}/${getModels()}`), 
            { refetch: true, immediate: false }
        ).json<ModelResultData[]>();
    },
    uploadManuscript(options: UploadManuscriptRequest) {
        const formData = new FormData();
        for (const key in options) {
            if (key === 'file') {
                const option = options[key] as File;
                formData.set(key, option, option.name);
            }
            else {
                formData.set(key, options[key]);
            }
        }

        return useMyFetch('manuscripts/', {
            method: 'POST',
            body: formData,
        }, {});
    },
    getSimilarBooksData(isbn: number, models?: ModelResultDataModelEnum[], sections?: ModelResultDataSectionEnum[]) {
        let url = `similar-books/${isbn}/`;
        if (models !== undefined && models.length !== 0) {
            url += `?models=${models.join(',')}`;
        }
        if (sections !== undefined && sections.length !== 0) {
            if (models !== undefined && models.length !== 0) {
                url += `&sections=${sections.join(',')}`;
            } 
            else {
                url += `?sections=${sections.join(',')}`;
            }
        }
        return useMyFetch(url, {
            
        }).json<ModelResultData[]>();
    },
    getSimilarBooksMetaData(isbn: Ref<number>) {
        return useMyFetch(computed(() => `similar-books/${isbn.value}/metadata`), {
            refetch: true,
            immediate: false,
        }).json<SimilarBookMetadata>();
    },
    getSimilarBooksAdminData(isbn: Ref<number>) {
        return useMyFetch(computed(() => `similar-books/${isbn.value}/`), {
            refetch: true, 
            immediate: false,
        }).json<ModelResultData[]>();
    },

    getTrialReportData(models?: ModelResultDataModelEnum[], sections?: ModelResultDataSectionEnum[]) {
        let url = 'trial-report/';
        if (models !== undefined && models.length !== 0) {
            url += `?models=${models.join(',')}`;
        }
        if (sections !== undefined && sections.length !== 0) {
            if (models !== undefined && models.length !== 0) {
                url += `&sections=${sections.join(',')}`;
            }
            else {
                url += `?sections=${sections.join(',')}`;
            }
        }
        return useMyFetch(url, {
            refetch: true,
        }).json<ModelResultData[]>();
    },
    getTrialReportMetaData() {
        return useMyFetch('trial-report/metadata', {
            refetch: true,
        }).json<SimilarBookMetadata>();
    },
}
