import type { AuthorListItem } from '@interface/Author.ts';

export interface ReportsListItem {
    Id: number;
    Name: string;
    DisplayName: string;
    SortIndex: number;
}

/**
 * Information about a manuscript
 * @export
 * @interface Manuscript
 */
export interface Manuscript {
    /**
     *
     * @type {string}
     * @memberof Manuscript
     */
    id: string;
    /**
     *
     * @type {AuthorListItem}
     * @memberof Manuscript
     */
    author: AuthorListItem;
    /**
     *
     * @type {string}
     * @memberof Manuscript
     */
    title: string;
    /**
     *
     * @type {string}
     * @memberof Manuscript
     */
    audience: string;
    /**
     *
     * @type {string}
     * @memberof Manuscript
     */
    genre: string;
    /**
     *
     * @type {ManuscriptProgress}
     * @memberof Manuscript
     */
    progress: ManuscriptProgress;
    /**
     *
     * @type {Date}
     * @memberof Manuscript
     */
    created: Date;
    /**
     *
     * @type {Date}
     * @memberof Manuscript
     */
    latestRevision: Date;
}

/**
 * @export
 */
export const ManuscriptStatusEnum = {
    Pending: 'PENDING',
    Processing: 'PROCESSING',
    Success: 'SUCCESS',
    Done: 'DONE',
    Failed: 'FAILED'
} as const;
export type ManuscriptStatusEnum = typeof ManuscriptStatusEnum[keyof typeof ManuscriptStatusEnum];

/**
 * Overall status:
 * `PENDING` - Waiting to be processed
 * `PROCESSING` - Being processed
 * `DONE` - Done processing

 * @export
 */
export const ManuscriptStatus = {
    Pending: 'PENDING',
    Processing: 'PROCESSING',
    Done: 'DONE'
} as const;
export type ManuscriptStatus = typeof ManuscriptStatus[keyof typeof ManuscriptStatus];

/**
 * Information about the status and progress of analyzing a manuscript
 * @export
 * @interface ManuscriptProgress
 */
export interface ManuscriptProgress {
    /**
     *
     * @type {ManuscriptStatus}
     * @memberof ManuscriptProgress
     */
    status: ManuscriptStatus;
    /**
     *
     * @type {number}
     * @memberof ManuscriptProgress
     */
    modelsDone: number;
    /**
     *
     * @type {number}
     * @memberof ManuscriptProgress
     */
    modelsTotal: number;
    /**
     *
     * @type {number}
     * @memberof ManuscriptProgress
     */
    errors: number;
    /**
     * when non-null this is the number of manuscripts before this one in queue on the assigned server
     * @type {number}
     * @memberof ManuscriptProgress
     */
    positionInQueue?: number;
    /**
     *
     * @type {number}
     * @memberof ManuscriptProgress
     */
    globalScore?: number;
    /**
     *
     * @type {number}
     * @memberof ManuscriptProgress
     */
    userScore?: number;
}

/**
 * Information about a manuscript
 * @export
 * @interface ManuscriptRevision
 */
export interface ManuscriptRevision {
    /**
     *
     * @type {string}
     * @memberof ManuscriptRevision
     */
    id: string;
    /**
     *
     * @type {string}
     * @memberof ManuscriptRevision
     */
    title: string;
    /**
     *
     * @type {string}
     * @memberof ManuscriptRevision
     */
    audience: string;
    /**
     *
     * @type {string}
     * @memberof ManuscriptRevision
     */
    genre: string;
    /**
     *
     * @type {ManuscriptProgress}
     * @memberof ManuscriptRevision
     */
    progress: ManuscriptProgress;
    /**
     *
     * @type {number}
     * @memberof ManuscriptRevision
     */
    modelVersion: number;
    /**
     *
     * @type {Date}
     * @memberof ManuscriptRevision
     */
    created: Date;
}

/**
 * Status for a manuscript upload
 * @export
 * @interface ManuscriptUploadResponse
 */
export interface ManuscriptUploadResponse {
    /**
     *
     * @type {string}
     * @memberof ManuscriptUploadResponse
     */
    manuscriptId: string;
    /**
     *
     * @type {string}
     * @memberof ManuscriptUploadResponse
     */
    revisionId: string;
    /**
     *
     * @type {string}
     * @memberof ManuscriptUploadResponse
     */
    statusMessage?: string;
}

/**
 *
 * @export
 * @interface PageOfManuscript
 */
export interface PageOfManuscript {
    /**
     *
     * @type {number}
     * @memberof PageOfManuscript
     */
    page: number;
    /**
     *
     * @type {number}
     * @memberof PageOfManuscript
     */
    pageSize: number;
    /**
     *
     * @type {number}
     * @memberof PageOfManuscript
     */
    totalPages: number;
    /**
     *
     * @type {number}
     * @memberof PageOfManuscript
     */
    totalElements: number;
    /**
     *
     * @type {Array<Manuscript>}
     * @memberof PageOfManuscript
     */
    content: Array<Manuscript>;
}

/**
 *
 * @export
 * @interface PageOfManuscriptRevision
 */
export interface PageOfManuscriptRevision {
    /**
     *
     * @type {string}
     * @memberof PageOfManuscriptRevision
     */
    manuscriptTitle: string;
    /**
     *
     * @type {number}
     * @memberof PageOfManuscriptRevision
     */
    page: number;
    /**
     *
     * @type {number}
     * @memberof PageOfManuscriptRevision
     */
    pageSize: number;
    /**
     *
     * @type {number}
     * @memberof PageOfManuscriptRevision
     */
    totalPages: number;
    /**
     *
     * @type {number}
     * @memberof PageOfManuscriptRevision
     */
    totalElements: number;
    /**
     *
     * @type {Array<ManuscriptRevision>}
     * @memberof PageOfManuscriptRevision
     */
    content: Array<ManuscriptRevision>;
}
