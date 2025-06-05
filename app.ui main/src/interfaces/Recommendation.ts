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
}

export interface IdNumberNameString {
    id: number;
    name: string;
}
interface RulesMatch {
    match: string;
    noMatch: string;
}

export interface RecommendationMetric {
    id: number;
    name: string;
    uniqueName: string;
    reportIndex: number;
    modelName: string;
    variableName: string;
}

export interface RecommendationRules {
    metrics: RecommendationMetric[];
    audiences: IdNumberNameString[];
    genres: IdNumberNameString[];
    audienceMatch: RulesMatch;
    genreMatch: RulesMatch;
}

export interface IRecommendationResponse {
    message: string;
    RAG: string;
    RAGText: string;
    RAGLevel: string;
    rangeHigh: number;
    rangeLow: number;
}

export interface ITipsResponse {
    id: number;
    report: number;
    report_name: string;
    text: string;
}

export interface ICharacteristicsResponse {
    id: number;
    report: number;
    report_name: string;
    metric: string;
    text: string;
}

export interface IArticlesResponse {
    id: number;
    report: number;
    report_name: string;
    headline: string;
    text: string;
    link: string;
}

export interface IWhatIsResponse {
    id: number;
    report: number;
    report_name: string;
    head: string;
    text: string;
}

export interface IDashboardResponse {
    id: number;
    element: string;
    text: string;
}

export interface IGlobalScoreTextResponse {
    id: number;
    type: number;
    typeName: string;
    text: string;
}

export interface IArchetypeIndexesResponse {
    id: number;
    name: string;
}

export interface IArchetypeTextResponse {
    id: number;
    type: number;
    typeName: string;
    RAGLevel: string;
    text: string;
}

export type AchetypeRAGLevel = 'Lav' | 'OK' | 'Høj' | 'Text';

export interface ILixResponse {
    id: number;
    min: number;
    max: number;
    headline: string;
    text: string;
    lign: string;
}