export interface IStringKeyNumberValue {
    [key: string]: number;
}
export interface IStringKeyStringValue {
    [key: string]: string;
}

export interface IGlobalAnalyzedContent {
    archetype: number;
    audience_classification: number;
    cliches: number;
    dialogue: number;
    genre_classification: number;
    legibility: number;
    power_words: number;
    score: number;
    showing_telling: number;
    tempo: number;
}

export interface IDialogueGlobalCategories {
    'Hovmodige ord': IStringKeyNumberValue;
    'Irriterede ord': IStringKeyNumberValue;
    'Ord der giver et svar': IStringKeyNumberValue;
    'Ord der gør grin': IStringKeyNumberValue;
    'Ord der stiller et spørgsmål': IStringKeyNumberValue;
    'Ord til at udtrykke usikkerhed': IStringKeyNumberValue;
    'Skræmte / skræmmede ord': IStringKeyNumberValue;
    'Vrede ord': IStringKeyNumberValue;
}

export interface IDialogueGlobal {
    'categories count': IDialogueGlobalCategories;
    "number of 'sige' or 'spørge'": number;
    'number of adverbs in dialogue': number;
    'number of paragraphs with dialogues': number;
    'number of utterances': number;
    'number of verbs in dialogue': number;
    /* The values below are changed. */
    // In new model version this changed to 'dialogue-adverbs count'
    'adverbs in dialog count'?: IStringKeyNumberValue;
    // In new model version this changed to 'dialogue-verbs count'
    'verbs in dialog count'?: IStringKeyNumberValue;
    // In new model version this changed to "percentage of 'sige' or 'spørge' in dialogue-verbs"
    "percentage of verbs in 'sige' or 'spørge'"?: number;
    // In new model version this changed to 'percentage of dialogue sentences'
    'percentage of paragraphs with dialogues'?: number;
    /* Updates after v3 */
    // This replaces "adverbs in dialog count"
    'dialogue-adverbs count'?: IStringKeyNumberValue;
    // This replaces "verbs in dialog count"
    'dialogue-verbs count'?: IStringKeyNumberValue;
    // This replaces "percentage of verbs in 'sige' or 'spørge'"
    "percentage of 'sige' or 'spørge' in dialogue-verbs"?: number;
    // This replaces "percentage of paragraphs with dialogues"
    'percentage of dialogue sentences'?: number;
    // Not used right now.
    'verb-adverb pairs'?: Array<string|number>;
}

export interface IArchetypesGlobal {
    class: string;
    score: number;
    pattern: number[];
}
export type IArchetypeContentGlobal = {
    best_archetype_name: string;
    best_archetype_score: number;
} & {
    [key: string]: number;
}

export interface IArchetypeContentParagraphs {
    chunks: IStringKeyNumberValue[];
    paragraph_id: number;
}

export interface IArchetypePartsContent {
    end: number;
    part: number;
    start: number;
    Icarus: number;
    Oedipus: number;
    Tragedy: number;
    neutral: number;
    chunk_id: number;
    negative: number;
    one_part: number;
    positive: number;
    sentiment: number;
    trendline: number;
    Cinderella: number;
    "Man in a hole": number;
    "Rags to riches": number;
    running_averages: number;
}

export interface IArchetypeContentParts {
    chunks: IArchetypePartsContent;
}

export interface IArchetypesContent {
    global: IArchetypeContentGlobal;
    paragraphs: {
        chunks: {
            [key: string]: number;
        }[]
    };
    parts: {
        chunks: {
            [key: string]: number;
        }
    }[];
}

export interface IAudienceClassificationGlobal {
    class: string;
    score: number;
}

export interface IGenreClassificationGlobal {
    class: string;
    score: number;
}

export interface IScenesContentGlobal {
    'number of scenes': number;
    'number of locations': number;
    'number of characters': number;
}

export interface IScenesLocations {
    id: number;
    name: string;
    score: number;
    paragraphs: number[][];
    references: string[];
}

export interface IScenesCharacters {
    id: number;
    name: string;
    score: number;
    paragraphs: number[][];
    references: string[];
}

export interface TempoGlobalContent {
    'action verbs count': IStringKeyNumberValue;
    'number of fast paragraphs': number;
    'number of slow paragraphs': number;
    'percentage of fast paragraphs': number;
}

export interface IShowingTellingGlobal {
    'adjectives count': IStringKeyNumberValue;
    'adverbs count': IStringKeyNumberValue;
    'descriptive words count': IStringKeyNumberValue;
    'filling words count': IStringKeyNumberValue;
    'number of adjectives': number;
    'number of adverbs': number;
    'number of descriptive words': number;
    'number of filling words': number;
    'percentage of adjectives': number;
    'percentage of adverbs': number;
    'percentage of descriptive words': number;
    'percentage of filling words': number;
    show_tell_value: number;
}

export interface IPartsShowingTellingChunk {
    chunk_id: number;
    'number of adjectives': number;
    'number of adverbs': number;
    'number of descriptive words': number;
    'number of filling words': number;
    one_part: number;
    part: number;
    'percentage of adjectives': number;
    'percentage of adverbs': number;
    'percentage of descriptive words': number;
    'percentage of filling words': number;
    slut: number;
    start: number;
}

export interface IPartsShowingTelling {
    chunks: IPartsShowingTellingChunk;
}

export interface IClichesListItem {
    'final score': number;
    'fuzz score': number;
    'jaccard score': number;
    sentence: string;
    'similarity score': number;
}
export interface IClichesList {
    [key: string]: IClichesListItem[];
}
export interface IClichesGlobal {
    'cliches list': IClichesList;
    'number of cliches': number;
}

export interface IPerspectiveGlobal {
    'consistence score': number;
    'main person indicator': string;
    'number of 1rst person indicators': number;
    'number of 2nd person indicators': number;
    'number of 3rd person indicators': number;
    'percentage of 1rst person indicators': number;
    'percentage of 2nd person indicators': number;
    'percentage of 3rd person indicators': number;
    'pronouns count': IStringKeyNumberValue;
}

interface IPerspectivePartsChunk {
    chunk_id: number;
    end: number;
    "number of 1rst person indicators": number;
    "number of 2nd person indicators": number;
    "number of 3rd person indicators": number;
    one_part: number;
    part: number;
    start: number;
}

export interface IPerspectiveParts {
    chunks: IPerspectivePartsChunk;
}

export interface IChunksGlobal {
    'number_of_chunks': number;
}

export interface IChunksPartsChunk {
    end: number;
    part: number;
    start: number;
    chunk_id: number;
    one_part: number;
    part_text: string[];
}

export interface IChunksParts {
    chunks: IChunksPartsChunk;
}

export interface IChunksParagraphsChunk {
    chunk_id: number;
    chunk_text: string;
    chunk_in_paragraph_id: number;
}

export interface IChunksParagraphs {
    chunks: IChunksParagraphsChunk[];
    paragraph_id: number;
}

export interface ITopicData {
    'number of words': number;
    score: number;
    'topic name': string;
    'vocabulary size': number;
    propensity: number;
    genre_propensity: IStringKeyNumberValue;
    keywords: IStringKeyNumberValue;
}

export interface ISemanticFieldsGlobal {
    lemma_dictionary: any;
    topics: ITopicData[];
}

export interface IPowerWordsCategoryItem {
    count: IStringKeyNumberValue;
    propensity: number;
    propensity_per_genre: IStringKeyNumberValue;
}

export interface IPowerWordsCategories {
    [key: string]: IPowerWordsCategoryItem
}

export interface IPowerWordsGlobal {
    'number of power words': number;
    power_words_categories: IPowerWordsCategories;
    propensity: number;
    propensity_per_genre: IStringKeyNumberValue;
}

export interface ILegibilityGlobal {
    LIX: number;
    'average sentence length': number;
    'average word length': number;
    'lexicon size': number;
    'number of complex words': number;
    'number of sentences': number;
    'number of words': number;
    'percentage of complex words': number;
}

export interface ILegibilityParagraphChunk extends ILegibilityGlobal {
    chunk_id: number;
    chunk_in_paragraph_id: number;
    lexicon: IStringKeyStringValue;
}

export interface ILegibilityPartsChunk extends ILegibilityGlobal {
    chunk_id: number;
    one_part: number;
    part: number;
    slut: number;
    start: number;
}

export interface ILegibilityParagraph {
    chunks: ILegibilityParagraphChunk[];
    paragraph_id: number;
}

export interface ILegibilityParts {
    chunks: ILegibilityPartsChunk;
}

export interface ISimilarBooksGlobal {
    ISBN: number;
    author: string;
    title: string;
}

export interface ISimilarBooksGlobalContent {
    content: ISimilarBooksGlobal[];
    model: string;
    section: string;
    status: string;
}

export interface ITensesCount {
    Past: number;
    Pres: number;
}

export interface ITenseGlobal {
    'main tense': string;
    'number of past tense': number;
    'number of present tense': number;
    'percentage of past tense': number;
    'percentage of present tense': number;
    'tenses count': ITensesCount;
}

export interface ITensesCountChunk {
    Past?: number;
    Pres?: number;
}

export interface ITenseParagraphsChunk {
    chunk_id: number;
    chunk_in_paragraph_id: number;
    tenses: ITensesCountChunk
}

export interface ITensePartsChunk {
    chunk_id: number;
    one_part: number;
    part: number;
    slut: number;
    start: number;
    tenses: ITensesCountChunk[]
}

export interface ITenseParagraphs {
    chunks: ITenseParagraphsChunk[];
    paragraph_id: number;
}
export interface ITenseParts {
    chunks: ITensePartsChunk;
}

export interface ISentimentGlobal {
    correlation_coefficient: number[];
}