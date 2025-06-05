/* tslint:disable */
/* eslint-disable */
/**
 *
 * @export
 * @interface Article
 */
export interface Article {
    /**
     *
     * @type {number}
     * @memberof Article
     */
    id: number;
    /**
     *
     * @type {number}
     * @memberof Article
     */
    report: number;
    /**
     *
     * @type {string}
     * @memberof Article
     */
    reportName: string;
    /**
     *
     * @type {string}
     * @memberof Article
     */
    text: string;
    /**
     *
     * @type {string}
     * @memberof Article
     */
    link: string;
}
/**
 * information about an author
 * @export
 * @interface Author
 */
export interface Author {
    /**
     *
     * @type {string}
     * @memberof Author
     */
    id: string;
    /**
     *
     * @type {string}
     * @memberof Author
     */
    name?: string;
    /**
     *
     * @type {string}
     * @memberof Author
     */
    email?: string;
    /**
     *
     * @type {string}
     * @memberof Author
     */
    nickname?: string;
    /**
     *
     * @type {string}
     * @memberof Author
     */
    username?: string;
    /**
     *
     * @type {AuthorRole}
     * @memberof Author
     */
    role: AuthorRole;
    /**
     *
     * @type {number}
     * @memberof Author
     */
    complimentaryUploadsRemaining: number;
    /**
     *
     * @type {number}
     * @memberof Author
     */
    purchasedUploadsRemaining: number;
    /**
     *
     * @type {number}
     * @memberof Author
     */
    subscriptionUploadsRemaining: number;
    /**
     *
     * @type {boolean}
     * @memberof Author
     */
    restrictedModels: boolean;
    /**
     *
     * @type {string}
     * @memberof Author
     */
    created: string;
    /**
     *
     * @type {string}
     * @memberof Author
     */
    updated: string;
}
/**
 * basic author information with only enough to display in a list and link to author specific pages
 * @export
 * @interface AuthorListItem
 */
export interface AuthorListItem {
    /**
     *
     * @type {string}
     * @memberof AuthorListItem
     */
    id: string;
    /**
     *
     * @type {string}
     * @memberof AuthorListItem
     */
    name?: string;
}
/**
 *
 * @export
 * @enum {string}
 */
export enum AuthorRole {
    New = 'NEW',
    User = 'USER',
    Admin = 'ADMIN',
    Developer = 'DEVELOPER',
    Banned = 'BANNED'
}

/**
 *
 * @export
 * @interface AuthorSetting
 */
export interface AuthorSetting {
    /**
     *
     * @type {string}
     * @memberof AuthorSetting
     */
    name: string;
    /**
     *
     * @type {string}
     * @memberof AuthorSetting
     */
    value: string;
}
/**
 * Information about the logged-in user.
 * @export
 * @interface AuthorStatus
 */
export interface AuthorStatus {
    /**
     *
     * @type {string}
     * @memberof AuthorStatus
     */
    id: string;
    /**
     *
     * @type {string}
     * @memberof AuthorStatus
     */
    name?: string;
    /**
     *
     * @type {string}
     * @memberof AuthorStatus
     */
    email?: string;
    /**
     *
     * @type {string}
     * @memberof AuthorStatus
     */
    nickname?: string;
    /**
     *
     * @type {string}
     * @memberof AuthorStatus
     */
    username?: string;
    /**
     *
     * @type {AuthorRole}
     * @memberof AuthorStatus
     */
    role: AuthorRole;
    /**
     *
     * @type {Array<string>}
     * @memberof AuthorStatus
     */
    permissions: Array<string>;
    /**
     *
     * @type {number}
     * @memberof AuthorStatus
     */
    complimentaryUploadsRemaining: number;
    /**
     *
     * @type {number}
     * @memberof AuthorStatus
     */
    purchasedUploadsRemaining: number;
    /**
     *
     * @type {number}
     * @memberof AuthorStatus
     */
    subscriptionUploadsRemaining: number;
    /**
     *
     * @type {boolean}
     * @memberof AuthorStatus
     */
    restrictedModels: boolean;
}
/**
 * List the supported genres and audiences
 * @export
 * @interface CategoryInfo
 */
export interface CategoryInfo {
    /**
     *
     * @type {Array<string>}
     * @memberof CategoryInfo
     */
    genres: Array<string>;
    /**
     *
     * @type {Array<string>}
     * @memberof CategoryInfo
     */
    audiences: Array<string>;
}
/**
 *
 * @export
 * @interface CategoryInfo2
 */
export interface CategoryInfo2 {
    /**
     *
     * @type {Array<IdName>}
     * @memberof CategoryInfo2
     */
    metrics: Array<IdName>;
    /**
     *
     * @type {Array<IdName>}
     * @memberof CategoryInfo2
     */
    audiences: Array<IdName>;
    /**
     *
     * @type {Array<IdName>}
     * @memberof CategoryInfo2
     */
    genres: Array<IdName>;
    /**
     *
     * @type {MatchText}
     * @memberof CategoryInfo2
     */
    audienceMatch: MatchText;
    /**
     *
     * @type {MatchText}
     * @memberof CategoryInfo2
     */
    genreMatch: MatchText;
}
/**
 *
 * @export
 * @interface Characteristic
 */
export interface Characteristic {
    /**
     *
     * @type {number}
     * @memberof Characteristic
     */
    id: number;
    /**
     *
     * @type {number}
     * @memberof Characteristic
     */
    report: number;
    /**
     *
     * @type {string}
     * @memberof Characteristic
     */
    reportName: string;
    /**
     *
     * @type {string}
     * @memberof Characteristic
     */
    metric: string;
    /**
     *
     * @type {string}
     * @memberof Characteristic
     */
    text: string;
}
/**
 * history event
 * @export
 * @interface DetailedHistoryEvent
 */
export interface DetailedHistoryEvent {
    /**
     *
     * @type {string}
     * @memberof DetailedHistoryEvent
     */
    eventTime: string;
    /**
     *
     * @type {HistoryEventType}
     * @memberof DetailedHistoryEvent
     */
    eventType: HistoryEventType;
    /**
     *
     * @type {string}
     * @memberof DetailedHistoryEvent
     */
    eventSubType: string;
    /**
     *
     * @type {string}
     * @memberof DetailedHistoryEvent
     */
    message: string;
    /**
     * Lots of unstructured data
     * @type {any}
     * @memberof DetailedHistoryEvent
     */
    details?: any | null;
}
/**
 *
 * @export
 * @interface EngineInfo
 */
export interface EngineInfo {
    /**
     *
     * @type {string}
     * @memberof EngineInfo
     */
    id: string;
    /**
     *
     * @type {string}
     * @memberof EngineInfo
     */
    uri: string;
    /**
     *
     * @type {number}
     * @memberof EngineInfo
     */
    pendingQueue?: number;
    /**
     *
     * @type {number}
     * @memberof EngineInfo
     */
    finishedQueue?: number;
    /**
     *
     * @type {number}
     * @memberof EngineInfo
     */
    dispatchedQueue?: number;
    /**
     *
     * @type {number}
     * @memberof EngineInfo
     */
    errors?: number;
    /**
     *
     * @type {number}
     * @memberof EngineInfo
     */
    timeoutErrors?: number;
    /**
     *
     * @type {number}
     * @memberof EngineInfo
     */
    modelVersion?: number;
    /**
     *
     * @type {string}
     * @memberof EngineInfo
     */
    status: EngineInfoStatusEnum;
    /**
     *
     * @type {string}
     * @memberof EngineInfo
     */
    aliveSince?: string;
    /**
     *
     * @type {string}
     * @memberof EngineInfo
     */
    deadSince?: string;
}

/**
 * @export
 * @enum {string}
 */
export enum EngineInfoStatusEnum {
    Initial = 'INITIAL',
    Alive = 'ALIVE',
    Dead = 'DEAD'
}

/**
 * history event
 * @export
 * @interface HistoryEvent
 */
export interface HistoryEvent {
    /**
     *
     * @type {string}
     * @memberof HistoryEvent
     */
    eventTime: string;
    /**
     *
     * @type {HistoryEventType}
     * @memberof HistoryEvent
     */
    eventType: HistoryEventType;
    /**
     *
     * @type {string}
     * @memberof HistoryEvent
     */
    eventSubType: string;
    /**
     *
     * @type {string}
     * @memberof HistoryEvent
     */
    message: string;
}
/**
 *
 * @export
 * @enum {string}
 */
export enum HistoryEventType {
    Author = 'AUTHOR',
    Payment = 'PAYMENT',
    Subscription = 'SUBSCRIPTION',
    Manuscript = 'MANUSCRIPT'
}

/**
 *
 * @export
 * @interface IdName
 */
export interface IdName {
    /**
     *
     * @type {number}
     * @memberof IdName
     */
    id: number;
    /**
     *
     * @type {string}
     * @memberof IdName
     */
    name: string;
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
     * @type {string}
     * @memberof Manuscript
     */
    created: string;
    /**
     *
     * @type {string}
     * @memberof Manuscript
     */
    latestRevision: string;
}
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
     * @type {string}
     * @memberof ManuscriptRevision
     */
    created: string;
}
/**
 * Overall status:
 * `PENDING` - Waiting to be processed
 * `PROCESSING` - Being processed
 * `DONE` - Done processing

 * @export
 * @enum {string}
 */
export enum ManuscriptStatus {
    Pending = 'PENDING',
    Processing = 'PROCESSING',
    Done = 'DONE'
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
 * @interface MatchText
 */
export interface MatchText {
    /**
     *
     * @type {string}
     * @memberof MatchText
     */
    match: string;
    /**
     *
     * @type {string}
     * @memberof MatchText
     */
    noMatch: string;
}
/**
 *
 * @export
 * @interface ModelError
 */
export interface ModelError {
    /**
     *
     * @type {string}
     * @memberof ModelError
     */
    type: string;
    /**
     *
     * @type {string}
     * @memberof ModelError
     */
    message: string;
}
/**
 *
 * @export
 * @interface ModelResultData
 */
export interface ModelResultData {
    /**
     * Name of the model
     * @type {string}
     * @memberof ModelResultData
     */
    model: string;
    /**
     * Name of the section within the model
     * @type {string}
     * @memberof ModelResultData
     */
    section?: string;
    /**
     *
     * @type {string}
     * @memberof ModelResultData
     */
    status: ModelResultDataStatusEnum;
    /**
     * Lots of unstructured data
     * @type {any}
     * @memberof ModelResultData
     */
    content?: any | null;
}

/**
 * @export
 * @enum {string}
 */
export enum ModelResultDataStatusEnum {
    Pending = 'PENDING',
    Processing = 'PROCESSING',
    Done = 'DONE',
    Error = 'ERROR'
}

/**
 *
 * @export
 * @interface PageOfAuthor
 */
export interface PageOfAuthor {
    /**
     *
     * @type {number}
     * @memberof PageOfAuthor
     */
    page: number;
    /**
     *
     * @type {number}
     * @memberof PageOfAuthor
     */
    pageSize: number;
    /**
     *
     * @type {number}
     * @memberof PageOfAuthor
     */
    totalPages: number;
    /**
     *
     * @type {number}
     * @memberof PageOfAuthor
     */
    totalElements: number;
    /**
     *
     * @type {Array<Author>}
     * @memberof PageOfAuthor
     */
    content: Array<Author>;
}
/**
 *
 * @export
 * @interface PageOfDetailedHistoryEvent
 */
export interface PageOfDetailedHistoryEvent {
    /**
     *
     * @type {number}
     * @memberof PageOfDetailedHistoryEvent
     */
    page: number;
    /**
     *
     * @type {number}
     * @memberof PageOfDetailedHistoryEvent
     */
    pageSize: number;
    /**
     *
     * @type {number}
     * @memberof PageOfDetailedHistoryEvent
     */
    totalPages: number;
    /**
     *
     * @type {number}
     * @memberof PageOfDetailedHistoryEvent
     */
    totalElements: number;
    /**
     *
     * @type {Array<DetailedHistoryEvent>}
     * @memberof PageOfDetailedHistoryEvent
     */
    content: Array<DetailedHistoryEvent>;
}
/**
 *
 * @export
 * @interface PageOfHistoryEvent
 */
export interface PageOfHistoryEvent {
    /**
     *
     * @type {number}
     * @memberof PageOfHistoryEvent
     */
    page: number;
    /**
     *
     * @type {number}
     * @memberof PageOfHistoryEvent
     */
    pageSize: number;
    /**
     *
     * @type {number}
     * @memberof PageOfHistoryEvent
     */
    totalPages: number;
    /**
     *
     * @type {number}
     * @memberof PageOfHistoryEvent
     */
    totalElements: number;
    /**
     *
     * @type {Array<HistoryEvent>}
     * @memberof PageOfHistoryEvent
     */
    content: Array<HistoryEvent>;
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
/**
 *
 * @export
 * @interface Recommendation
 */
export interface Recommendation {
    /**
     *
     * @type {string}
     * @memberof Recommendation
     */
    message: string;
    /**
     *
     * @type {string}
     * @memberof Recommendation
     */
    rAG?: string;
    /**
     *
     * @type {string}
     * @memberof Recommendation
     */
    rAGText?: string;
}
/**
 *
 * @export
 * @interface SimilarBookMetadata
 */
export interface SimilarBookMetadata {
    /**
     *
     * @type {number}
     * @memberof SimilarBookMetadata
     */
    isbn: number;
    /**
     *
     * @type {string}
     * @memberof SimilarBookMetadata
     */
    title: string;
    /**
     *
     * @type {string}
     * @memberof SimilarBookMetadata
     */
    genre: string;
    /**
     *
     * @type {string}
     * @memberof SimilarBookMetadata
     */
    audience: string;
}
/**
 *
 * @export
 * @interface Text
 */
export interface Text {
    /**
     *
     * @type {string}
     * @memberof Text
     */
    name: string;
    /**
     *
     * @type {string}
     * @memberof Text
     */
    language: string;
    /**
     *
     * @type {string}
     * @memberof Text
     */
    value: string;
}
/**
 *
 * @export
 * @interface Tip
 */
export interface Tip {
    /**
     *
     * @type {number}
     * @memberof Tip
     */
    id: number;
    /**
     *
     * @type {number}
     * @memberof Tip
     */
    report: number;
    /**
     *
     * @type {string}
     * @memberof Tip
     */
    reportName: string;
    /**
     *
     * @type {string}
     * @memberof Tip
     */
    text: string;
}
