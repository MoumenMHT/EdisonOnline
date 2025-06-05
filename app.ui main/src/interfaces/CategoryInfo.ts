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
