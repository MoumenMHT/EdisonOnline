import { AuthorSetting } from "@interface/Author.ts";

export interface AdminChangeManuscriptRevisionTitleRequest {
    manuscriptId: string;
    revisionId: string;
    newTitle: string;
    reason: string;
    additionalReason?: string;
}

export interface AdminChangeManuscriptTitleRequest {
    manuscriptId: string;
    newTitle: string;
}

export interface AdminDeleteManuscriptRequest {
    manuscriptId: string;
    reason: string;
    additionalReason?: string;
}

export interface AdminDeleteManuscriptRevisionRequest {
    manuscriptId: string;
    revisionId: string;
    reason: string;
    additionalReason?: string;
}

export interface AdminGetAnalyzedDataRequest {
    manuscriptId: string;
    revisionId: string;
    models?: string;
    sections?: string;
}

export interface AdminGetHistoryRequest {
    authorId: string;
    page?: number;
    pageSize?: number;
}

export interface AdminGetManuscriptRevisionsRequest {
    manuscriptId: string;
    page?: number;
    pageSize?: number;
}

export interface AdminGetManuscriptsRequest {
    authorId?: string;
    sortBy?: AdminGetManuscriptsSortByEnum;
    page?: number;
    pageSize?: number;
}

export interface ChangeManuscriptRevisionTitleRequest {
    manuscriptId: string;
    revisionId: string;
    newTitle: string;
}

export interface ChangeManuscriptTitleRequest {
    manuscriptId: string;
    newTitle: string;
}

export interface DeleteManuscriptRequest {
    manuscriptId: string;
    reason: string;
    additionalReason?: string;
}

export interface DeleteManuscriptRevisionRequest {
    manuscriptId: string;
    revisionId: string;
}

export interface DeleteSettingRequest {
    name: string;
}

export interface GetAllAuthorsRequest {
    page?: number;
    pageSize?: number;
}

export interface GetAnalyzedDataRequest {
    manuscriptId: string;
    revisionId: string;
    models?: string;
    sections?: string;
}

export interface GetHistoryRequest {
    page?: number;
    pageSize?: number;
}

export interface GetManuscriptRevisionsRequest {
    manuscriptId: string;
    page?: number;
    pageSize?: number;
}

export interface GetManuscriptsRequest {
    page?: number;
    pageSize?: number;
}

export interface GetRecommendationRequest {
    metricId: number;
    genre: string;
    audience: string;
    metricValue: number;
}

export interface SaveSettingsRequest {
    authorSetting?: Array<AuthorSetting>;
}

export interface UploadManuscriptRequest {
    manuscriptTitle: string;
    targetAudience: string;
    targetGenre: string;
    fileType: UploadManuscriptFileTypeEnum;
    file: Blob;
    revisionTitle?: string;
}

export interface UploadManuscriptRevisionRequest {
    manuscriptId: string;
    targetAudience: string;
    targetGenre: string;
    fileType: UploadManuscriptRevisionFileTypeEnum;
    file: Blob;
    revisionTitle?: string;
}

/**
 * @export
 */
export const AdminGetManuscriptsSortByEnum = {
    GlobalScore: 'globalScore',
    LatestRevision: 'latestRevision'
} as const;
export type AdminGetManuscriptsSortByEnum = typeof AdminGetManuscriptsSortByEnum[keyof typeof AdminGetManuscriptsSortByEnum];
/**
 * @export
 */
export const UploadManuscriptFileTypeEnum = {
    Text: 'TEXT',
    Docx: 'DOCX',
    Epub: 'EPUB'
} as const;
export type UploadManuscriptFileTypeEnum = typeof UploadManuscriptFileTypeEnum[keyof typeof UploadManuscriptFileTypeEnum];
/**
 * @export
 */
export const UploadManuscriptRevisionFileTypeEnum = {
    Text: 'TEXT',
    Docx: 'DOCX',
    Epub: 'EPUB'
} as const;
export type UploadManuscriptRevisionFileTypeEnum = typeof UploadManuscriptRevisionFileTypeEnum[keyof typeof UploadManuscriptRevisionFileTypeEnum];
