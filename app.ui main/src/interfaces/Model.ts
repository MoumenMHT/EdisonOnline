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
export interface ModelResultData<T = any> {
    /**
     * Name of the model
     * @type {string}
     * @memberof ModelResultData
     */
    model: ModelResultDataModelEnum;
    /**
     * Name of the section within the model
     * @type {string}
     * @memberof ModelResultData
     */
    section: ModelResultDataSectionEnum;
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
    content: T;
}


/**
 * @export
 */

export const ModelResultDataModelEnum = {
    SimilarBooks: 'SimilarBooks',
    AudienceClassification: 'AudienceClassification',
    GenreClassification: 'GenreClassification',
    Legibility: 'Legibility',
    Cliches: 'Cliches',
    SemanticFields: 'SemanticFields',
    Sentiment: 'Sentiment',
    Archetypes: 'Archetypes',
    Scenes: 'Scenes',
    Dialogue: 'Dialogue',
    ShowingTelling: 'ShowingTelling',
    Perspective: 'Perspective',
    Tense: 'Tense',
    Tempo: 'Tempo',
    PowerWords: 'PowerWords',
    Chunk: 'Chunck',
    GlobalAnalyzed: 'GlobalAnalyzed',
    GlobalUser: 'GlobalUser',
} as const;
export type ModelResultDataModelEnum = typeof ModelResultDataModelEnum[keyof typeof ModelResultDataModelEnum];

export const ModelResultDataSectionEnum = {
    Global: 'global',
    Paragraphs: 'paragraphs',
    Parts: 'parts',
    Characters: 'characters',
    Locations: 'locations',
} as const;
export type ModelResultDataSectionEnum = typeof ModelResultDataSectionEnum[keyof typeof ModelResultDataSectionEnum];

export const ModelResultDataStatusEnum = {
    Pending: 'PENDING',
    Processing: 'PROCESSING',
    Done: 'DONE',
    Error: 'ERROR'
} as const;
export type ModelResultDataStatusEnum = typeof ModelResultDataStatusEnum[keyof typeof ModelResultDataStatusEnum];
