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
 * history event
 * @export
 * @interface DetailedHistoryEvent
 */
export interface DetailedHistoryEvent {
    /**
     *
     * @type {Date}
     * @memberof DetailedHistoryEvent
     */
    eventTime: Date;
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
 * history event
 * @export
 * @interface HistoryEvent
 */
export interface HistoryEvent {
    /**
     *
     * @type {Date}
     * @memberof HistoryEvent
     */
    eventTime: Date;
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
 */
export const HistoryEventType = {
    Author: 'AUTHOR',
    Payment: 'PAYMENT',
    Subscription: 'SUBSCRIPTION',
    Manuscript: 'MANUSCRIPT'
} as const;
export type HistoryEventType = typeof HistoryEventType[keyof typeof HistoryEventType];
