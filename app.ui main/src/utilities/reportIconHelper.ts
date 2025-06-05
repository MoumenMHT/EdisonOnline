export const globalScoreLabelToReportId = (label: string) => {
    switch (label) {
        case 'archetype':
            return 2;
        case 'audience_classification':
            return 3
        case 'cliches':
            return 17
        case 'dialogue':
            return 7
        case 'genre_classification':
            return 4
        case 'legibility':
            return 8
        case 'power_words':
            return 15
        case 'showing_telling':
            return 6
        case 'tempo':
            return 5
        default:
            return 0;
    }
}