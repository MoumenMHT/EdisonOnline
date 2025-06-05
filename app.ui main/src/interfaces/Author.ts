import { AccessLevel } from '@interface/Payment.ts';

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
