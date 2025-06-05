/**
 * Information about the logged-in user (for dev purposes).
 * @export
 * @interface UserInfo
 */
export interface UserInfo {
    /**
     *
     * @type {string}
     * @memberof UserInfo
     */
    issuerId: string;
    /**
     *
     * @type {string}
     * @memberof UserInfo
     */
    name?: string;
    /**
     *
     * @type {string}
     * @memberof UserInfo
     */
    email?: string;
    /**
     *
     * @type {string}
     * @memberof UserInfo
     */
    nickname?: string;
    /**
     *
     * @type {string}
     * @memberof UserInfo
     */
    username?: string;
    /**
     *
     * @type {Array<string>}
     * @memberof UserInfo
     */
    permissions?: Array<string>;
}
