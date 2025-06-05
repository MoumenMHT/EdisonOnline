export const translateGlobalScoreLabels = (ref: string) => {
    switch (ref) {
        case 'archetype':
            return 'Arketype';
        case 'audience_classification':
            return 'Målgruppe'
        case 'cliches':
            return 'Klicheer'
        case 'dialogue':
            return 'Dialog'
        case 'genre_classification':
            return 'Genre'
        case 'legibility':
            return 'Læsbarhed'
        case 'power_words':
            return 'Stærke ord'
        case 'showing_telling':
            return 'Show/Tell'
        case 'tempo':
            return 'Tempo'
        default:
            return ref;
    }
}


export const translateTempoMetric = (metric: string) => {
    switch (metric) {
        case 'number of fast paragraphs':
            return 'Antal af hurtige afsnit';

        case 'number of slow paragraphs':
            return 'Antal af langsomme afsnit';

        case 'percentage of fast paragraphs':
            return 'Procentdel af hurtige afsnit';

        default: return metric;
    }
}

export const translateDialogueMetric = (metric: string) => {
    switch (metric) {
        case 'adverbs count':
            return 'Antal adverbier';
        case 'categories count':
            return 'Antal kategorier';
        case "number of 'sige' or 'spørge'":
            return 'Antal sige eller spørge';
        case 'number of dialogue adverbs':
            return 'Antal adverbier i dialog';
        case 'number of dialogue verbs':
            return 'Antal verber i dialog';
        case 'number of paragraphs with dialogues':
            return 'Antal afsnit med dialoger';
        case 'number of utterances':
            return 'Antal ytringer';
        case "percentage of 'sige' or 'spørge'":
            return 'Procentdel af sige eller spørge';
        case 'percentage of paragraphs with dialogues':
            return 'Procentdel af afsnit med dialoger';
        case 'verbs count':
            return 'Antal verber';

        default:
            return metric;
    }
}

export const translatePerspectiveMetric = (metric: string) => {
    switch (metric) {
        case 'consistence score':
            return 'Konsistens score';
        case 'main person indicator':
            return 'Hovedperson indikator';
        case 'number of 1rst person indicators':
            return 'Antal førstepersons indikatorer';
        case 'number of 2nd person indicators':
            return 'Antal andenpersons indikatorer';
        case 'number of 3rd person indicators':
            return 'Antal tredjepersons indikatorer';
        case 'percentage of 1rst person indicators':
            return 'Procentdel af førstepersons indikatorer';
        case 'percentage of 2nd person indicators':
            return 'Procentdel af andenpersons indikatorer';
        case 'percentage of 3rd person indicators':
            return 'Procentdel af tredjepersons indikatorer';
        case 'pronouns count':
            return 'Antal pronominer';

        default:
            return metric;
    }
}

export const translateReadabilityMetric = (metric: string) => {
    switch (metric) {
        case 'average sentence length':
            return 'Gennemsnits sætnings længde';
        case 'average word length':
            return 'Gennemsnits ord længde';
        case 'lexicon size':
            return 'Leksikonstørrelse';
        case 'number of complex words':
            return 'Antal komplekse ord';
        case 'number of sentences':
            return 'Antal sætninger';
        case 'number of words':
            return 'Antal ord';
        case 'percentage of complex words':
            return 'Procentdel af komplekse ord';

        default:
            return metric;
    }

}

export const translateShowTellMetrics = (metric: string) => {
    switch (metric) {
        case 'adjectives count':
            return 'Antal adjektiver';
        case 'adverbs count':
            return 'Antal adverbier';
        case 'descriptive words count':
            return 'Antal beskrivende ord';
        case 'filling words count':
            return 'Antal fyldord';
        case 'number of adjectives':
            return 'Antal adjektiver';
        case 'number of adverbs':
            return 'Antal adverbier';
        case 'number of descriptive words':
            return 'Antal beskrivende ord';
        case 'number of filling words':
            return 'Antal fyldord';
        case 'percentage of adjectives':
            return 'Procentdel af adjektiver';
        case 'percentage of adverbs':
            return 'Procentdel af adverbier';
        case 'percentage of descriptive words':
            return 'Procentdel af beskrivende ord';
        case 'percentage of filling words':
            return 'Procentdel af fyldord';

        default:
            return metric;
    }
}

export const translateTempusMetric = (metric: string) => {
    switch (metric) {
        case 'main tense':
            return 'Hoved tempus';
        case 'number of past tense':
            return 'Antal datid';
        case 'number of present tense':
            return 'Antal nutid';
        case 'percentage of past tense':
            return 'Procentdel datid';
        case 'percentage of present tense':
            return 'Procentdel nutid';
        case 'tenses count':
            return 'Antal tempus';

        default:
            return metric;
    }
}