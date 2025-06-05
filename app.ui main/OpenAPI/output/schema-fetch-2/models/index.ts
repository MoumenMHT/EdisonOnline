/* tslint:disable */
/* eslint-disable */
/**
 * 
 * @export
 * @enum {string}
 */
export enum AccessLevel {
    None = 'NONE',
    Standard = 'STANDARD',
    Premium = 'PREMIUM'
}

/**
 * 
 * @export
 * @interface AdminPaymentProduct
 */
export interface AdminPaymentProduct {
    /**
     * 
     * @type {string}
     * @memberof AdminPaymentProduct
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof AdminPaymentProduct
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof AdminPaymentProduct
     */
    description: string;
    /**
     * 
     * @type {PaymentProductType}
     * @memberof AdminPaymentProduct
     */
    productType: PaymentProductType;
    /**
     * Price in the smallest unit of the currency (øre for DKK). If SUBSCRIPTION this is per billing interval.
     * @type {number}
     * @memberof AdminPaymentProduct
     */
    price: number;
    /**
     * 
     * @type {string}
     * @memberof AdminPaymentProduct
     */
    currency: string;
    /**
     * if SUBSCRIPTION this is per month
     * @type {number}
     * @memberof AdminPaymentProduct
     */
    uploads: number;
    /**
     * 
     * @type {SubscriptionLevel}
     * @memberof AdminPaymentProduct
     */
    subscriptionLevel?: SubscriptionLevel;
    /**
     * 
     * @type {BillingInterval}
     * @memberof AdminPaymentProduct
     */
    billingInterval?: BillingInterval;
    /**
     * 
     * @type {Array<PaymentProductBulletPoint>}
     * @memberof AdminPaymentProduct
     */
    bullets?: Array<PaymentProductBulletPoint>;
    /**
     * a unique code that ensures products are not duplicated
     * @type {string}
     * @memberof AdminPaymentProduct
     */
    code: string;
    /**
     * 
     * @type {boolean}
     * @memberof AdminPaymentProduct
     */
    active: boolean;
}
/**
 * 
 * @export
 * @interface AdminPaymentProductAllOf
 */
export interface AdminPaymentProductAllOf {
    /**
     * a unique code that ensures products are not duplicated
     * @type {string}
     * @memberof AdminPaymentProductAllOf
     */
    code: string;
    /**
     * 
     * @type {boolean}
     * @memberof AdminPaymentProductAllOf
     */
    active: boolean;
}
/**
 * 
 * @export
 * @interface Archetype
 */
export interface Archetype {
    /**
     * 
     * @type {number}
     * @memberof Archetype
     */
    id: number;
    /**
     * 
     * @type {number}
     * @memberof Archetype
     */
    type: number;
    /**
     * 
     * @type {string}
     * @memberof Archetype
     */
    typeName: string;
    /**
     * 
     * @type {string}
     * @memberof Archetype
     */
    rAGLevel: string;
    /**
     * 
     * @type {string}
     * @memberof Archetype
     */
    text: string;
}
/**
 * 
 * @export
 * @interface ArchetypeIndex
 */
export interface ArchetypeIndex {
    /**
     * 
     * @type {number}
     * @memberof ArchetypeIndex
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof ArchetypeIndex
     */
    name: string;
}
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
    headline: string;
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
    Tester = 'TESTER',
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
     * @type {AccessLevel}
     * @memberof AuthorStatus
     */
    accessLevel: AccessLevel;
}
/**
 * mandatory for SUBSCRIPTION, not allowed for ONE_TIME
 * @export
 * @enum {string}
 */
export enum BillingInterval {
    Monthly = 'MONTHLY',
    Quarterly = 'QUARTERLY'
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
     * @type {Array<Metric>}
     * @memberof CategoryInfo2
     */
    metrics: Array<Metric>;
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
 * 
 * @export
 * @interface Dashboard
 */
export interface Dashboard {
    /**
     * 
     * @type {number}
     * @memberof Dashboard
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof Dashboard
     */
    element: string;
    /**
     * 
     * @type {string}
     * @memberof Dashboard
     */
    text: string;
}
/**
 * history event that includes additional details that only admins should be able to see.
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
 * 
 * @export
 * @interface GlobalScore
 */
export interface GlobalScore {
    /**
     * 
     * @type {number}
     * @memberof GlobalScore
     */
    id: number;
    /**
     * 
     * @type {number}
     * @memberof GlobalScore
     */
    type: number;
    /**
     * 
     * @type {string}
     * @memberof GlobalScore
     */
    typeName: string;
    /**
     * 
     * @type {string}
     * @memberof GlobalScore
     */
    text: string;
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
    Purchase = 'PURCHASE',
    Subscription = 'SUBSCRIPTION',
    Invoice = 'INVOICE',
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
 * 
 * @export
 * @interface Info
 */
export interface Info {
    /**
     * 
     * @type {number}
     * @memberof Info
     */
    id: number;
    /**
     * 
     * @type {number}
     * @memberof Info
     */
    report: number;
    /**
     * 
     * @type {string}
     * @memberof Info
     */
    reportName: string;
    /**
     * 
     * @type {string}
     * @memberof Info
     */
    label: string;
    /**
     * 
     * @type {string}
     * @memberof Info
     */
    text: string;
}
/**
 * 
 * @export
 * @interface Invoice
 */
export interface Invoice {
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    productName: string;
    /**
     * 
     * @type {InvoiceType}
     * @memberof Invoice
     */
    type: InvoiceType;
    /**
     * 
     * @type {number}
     * @memberof Invoice
     */
    amountPaid: number;
    /**
     * 
     * @type {number}
     * @memberof Invoice
     */
    amountDue?: number;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    currency: string;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    periodStart?: string;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    periodEnd?: string;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    hostedInvoiceUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    pdfInvoiceUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof Invoice
     */
    created: string;
}
/**
 * 
 * @export
 * @enum {string}
 */
export enum InvoiceType {
    Payment = 'PAYMENT',
    PaymentFailure = 'PAYMENT_FAILURE'
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
 * @interface Metric
 */
export interface Metric {
    /**
     * 
     * @type {number}
     * @memberof Metric
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof Metric
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Metric
     */
    uniqueName: string;
    /**
     * 
     * @type {number}
     * @memberof Metric
     */
    reportIndex: number;
    /**
     * 
     * @type {string}
     * @memberof Metric
     */
    modelName: string;
    /**
     * 
     * @type {string}
     * @memberof Metric
     */
    variableName: string;
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
 * @interface PageOfAdminPaymentProduct
 */
export interface PageOfAdminPaymentProduct {
    /**
     * 
     * @type {number}
     * @memberof PageOfAdminPaymentProduct
     */
    page: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfAdminPaymentProduct
     */
    pageSize: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfAdminPaymentProduct
     */
    totalPages: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfAdminPaymentProduct
     */
    totalElements: number;
    /**
     * 
     * @type {Array<AdminPaymentProduct>}
     * @memberof PageOfAdminPaymentProduct
     */
    content: Array<AdminPaymentProduct>;
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
 * @interface PageOfInvoice
 */
export interface PageOfInvoice {
    /**
     * 
     * @type {number}
     * @memberof PageOfInvoice
     */
    page: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfInvoice
     */
    pageSize: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfInvoice
     */
    totalPages: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfInvoice
     */
    totalElements: number;
    /**
     * 
     * @type {Array<Invoice>}
     * @memberof PageOfInvoice
     */
    content: Array<Invoice>;
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
 * @interface PageOfPaymentProduct
 */
export interface PageOfPaymentProduct {
    /**
     * 
     * @type {number}
     * @memberof PageOfPaymentProduct
     */
    page: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfPaymentProduct
     */
    pageSize: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfPaymentProduct
     */
    totalPages: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfPaymentProduct
     */
    totalElements: number;
    /**
     * 
     * @type {Array<PaymentProduct>}
     * @memberof PageOfPaymentProduct
     */
    content: Array<PaymentProduct>;
}
/**
 * 
 * @export
 * @interface PageOfPurchase
 */
export interface PageOfPurchase {
    /**
     * 
     * @type {number}
     * @memberof PageOfPurchase
     */
    page: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfPurchase
     */
    pageSize: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfPurchase
     */
    totalPages: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfPurchase
     */
    totalElements: number;
    /**
     * 
     * @type {Array<Purchase>}
     * @memberof PageOfPurchase
     */
    content: Array<Purchase>;
}
/**
 * 
 * @export
 * @interface PageOfSubscription
 */
export interface PageOfSubscription {
    /**
     * 
     * @type {number}
     * @memberof PageOfSubscription
     */
    page: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfSubscription
     */
    pageSize: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfSubscription
     */
    totalPages: number;
    /**
     * 
     * @type {number}
     * @memberof PageOfSubscription
     */
    totalElements: number;
    /**
     * 
     * @type {Array<Subscription>}
     * @memberof PageOfSubscription
     */
    content: Array<Subscription>;
}
/**
 * 
 * @export
 * @interface PaymentProduct
 */
export interface PaymentProduct {
    /**
     * 
     * @type {string}
     * @memberof PaymentProduct
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof PaymentProduct
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof PaymentProduct
     */
    description: string;
    /**
     * 
     * @type {PaymentProductType}
     * @memberof PaymentProduct
     */
    productType: PaymentProductType;
    /**
     * Price in the smallest unit of the currency (øre for DKK). If SUBSCRIPTION this is per billing interval.
     * @type {number}
     * @memberof PaymentProduct
     */
    price: number;
    /**
     * 
     * @type {string}
     * @memberof PaymentProduct
     */
    currency: string;
    /**
     * if SUBSCRIPTION this is per month
     * @type {number}
     * @memberof PaymentProduct
     */
    uploads: number;
    /**
     * 
     * @type {SubscriptionLevel}
     * @memberof PaymentProduct
     */
    subscriptionLevel?: SubscriptionLevel;
    /**
     * 
     * @type {BillingInterval}
     * @memberof PaymentProduct
     */
    billingInterval?: BillingInterval;
    /**
     * 
     * @type {Array<PaymentProductBulletPoint>}
     * @memberof PaymentProduct
     */
    bullets?: Array<PaymentProductBulletPoint>;
}
/**
 * 
 * @export
 * @interface PaymentProductBulletPoint
 */
export interface PaymentProductBulletPoint {
    /**
     * 
     * @type {string}
     * @memberof PaymentProductBulletPoint
     */
    icon?: string;
    /**
     * 
     * @type {string}
     * @memberof PaymentProductBulletPoint
     */
    text: string;
}
/**
 * 
 * @export
 * @enum {string}
 */
export enum PaymentProductType {
    Purchase = 'PURCHASE',
    Subscription = 'SUBSCRIPTION'
}

/**
 * 
 * @export
 * @interface Purchase
 */
export interface Purchase {
    /**
     * 
     * @type {PaymentProduct}
     * @memberof Purchase
     */
    product: PaymentProduct;
    /**
     * Price in the smallest unit of the currency (øre for DKK). If SUBSCRIPTION this is per billing interval.
     * @type {number}
     * @memberof Purchase
     */
    price?: number;
    /**
     * 
     * @type {string}
     * @memberof Purchase
     */
    currency?: string;
    /**
     * 
     * @type {PurchaseStatus}
     * @memberof Purchase
     */
    status: PurchaseStatus;
    /**
     * 
     * @type {string}
     * @memberof Purchase
     */
    created: string;
}
/**
 * 
 * @export
 * @interface PurchaseInitiationResult
 */
export interface PurchaseInitiationResult {
    /**
     * 
     * @type {string}
     * @memberof PurchaseInitiationResult
     */
    paymentUrl: string;
}
/**
 * 
 * @export
 * @enum {string}
 */
export enum PurchaseStatus {
    Pending = 'PENDING',
    Completed = 'COMPLETED',
    Cancelled = 'CANCELLED',
    SessionExpired = 'SESSION_EXPIRED'
}

/**
 * 
 * @export
 * @interface Recommendation
 */
export interface Recommendation {
    /**
     * 
     * @type {number}
     * @memberof Recommendation
     */
    rangeLow: number;
    /**
     * 
     * @type {number}
     * @memberof Recommendation
     */
    rangeHigh: number;
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
    /**
     * 
     * @type {string}
     * @memberof Recommendation
     */
    rAGLevel?: string;
}
/**
 * 
 * @export
 * @interface ReportIndex
 */
export interface ReportIndex {
    /**
     * 
     * @type {number}
     * @memberof ReportIndex
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof ReportIndex
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof ReportIndex
     */
    sortIndex: number;
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
 * @interface Subscription
 */
export interface Subscription {
    /**
     * 
     * @type {PaymentProduct}
     * @memberof Subscription
     */
    product: PaymentProduct;
    /**
     * 
     * @type {SubscriptionStatus}
     * @memberof Subscription
     */
    status: SubscriptionStatus;
    /**
     * 
     * @type {SubscriptionLevel}
     * @memberof Subscription
     */
    level: SubscriptionLevel;
    /**
     * 
     * @type {string}
     * @memberof Subscription
     */
    activated?: string;
    /**
     * 
     * @type {string}
     * @memberof Subscription
     */
    cancelled?: string;
    /**
     * 
     * @type {string}
     * @memberof Subscription
     */
    subscriptionStart?: string;
    /**
     * 
     * @type {string}
     * @memberof Subscription
     */
    subscriptionEnd?: string;
    /**
     * 
     * @type {string}
     * @memberof Subscription
     */
    currentPeriodStart?: string;
    /**
     * 
     * @type {string}
     * @memberof Subscription
     */
    currentPeriodEnd?: string;
}
/**
 * 
 * @export
 * @enum {string}
 */
export enum SubscriptionLevel {
    Standard = 'STANDARD',
    Premium = 'PREMIUM'
}

/**
 * Overall status:
  * `INACTIVE` - Initial state until subscription has been payed
  * `ACTIVE` - Subscription is active
  * `CANCELLED` - Subscription has been cancelled, but is still active until it expires
  * `EXPIRED` - Subscription has expired and is no longer active

 * @export
 * @enum {string}
 */
export enum SubscriptionStatus {
    Inactive = 'INACTIVE',
    Active = 'ACTIVE',
    Cancelled = 'CANCELLED',
    Expired = 'EXPIRED'
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
/**
 * 
 * @export
 * @interface WhatIs
 */
export interface WhatIs {
    /**
     * 
     * @type {number}
     * @memberof WhatIs
     */
    id: number;
    /**
     * 
     * @type {number}
     * @memberof WhatIs
     */
    report: number;
    /**
     * 
     * @type {string}
     * @memberof WhatIs
     */
    reportName: string;
    /**
     * 
     * @type {string}
     * @memberof WhatIs
     */
    head: string;
    /**
     * 
     * @type {string}
     * @memberof WhatIs
     */
    text: string;
}
