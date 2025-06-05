/************************** OLD Reports **************************/
import OLD_GlobalScore from "@report/GlobalScore.vue";
import OLD_Genre from "@report/Genre.vue";
import OLD_Adjectives from "@report/Adjectives.vue";
import OLD_Archetype from "@report/Archetype.vue";
import OLD_Audience from "@report/Audience.vue";
import OLD_Character from "@report/Character.vue";
import OLD_Cliches from "@report/Cliches.vue";
import OLD_Dialogue from "@report/Dialogue.vue";
//import OLD_Emotions from "@report/Emotions.vue";
import OLD_SemanticFields from "@report/SemanticFields.vue";
import OLD_Perspective from "@report/Perspective.vue";
import OLD_Powerwords from "@report/Powerwords.vue";
import OLD_Readability from "@report/Readability.vue";
import OLD_Scenes from "@report/Scenes.vue";
import OLD_ShowTell from "@report/ShowTell.vue";
import OLD_Similarbooks from "@report/Similarbooks.vue";
import OLD_Tempo from "@report/Tempo.vue";
import OLD_Tempus from "@report/Tempus.vue";
import OLD_Verbs from "@report/Verbs.vue";
import OLD_Metadata from '@report/Metadata.vue';
/*****************************************************************/
/************************** New Reports **************************/
import GlobalScore from '@page/manuscript/analysis/GlobalScore.vue'
import Archetype from '@page/manuscript/analysis/Archetype.vue';
import Audience from '@page/manuscript/analysis/Audience.vue';
import Genre from '@page/manuscript/analysis/Genre.vue';
import Tempo from '@page/manuscript/analysis/Tempo.vue';
import ShowTell from '@page/manuscript/analysis/ShowTell.vue';
import Dialogue from '@page/manuscript/analysis/Dialogue.vue';
import Readability from '@page/manuscript/analysis/Readability.vue';
import Tempus from '@page/manuscript/analysis/Tempus.vue';
import SimilarBooks from '@page/manuscript/analysis/SimilarBooks.vue';
import SemanticFields from '@page/manuscript/analysis/SemanticFields.vue';
import Sentiment from '@page/manuscript/analysis/Sentiment.vue';
import SceneAnalysis from '@page/manuscript/analysis/SceneAnalysis.vue';
import CharacterAnalysis from '@page/manuscript/analysis/CharacterAnalysis.vue';
import PowerWords from '@page/manuscript/analysis/PowerWords.vue';
import Perspective from '@page/manuscript/analysis/Perspective.vue';
import Cliches from '@page/manuscript/analysis/Cliches.vue';
/*****************************************************************/
import { useMyFetch } from '@core/api.ts';
import { ReportIndex, ReportInfo } from '@interface/Report.ts';

export const ReportService = {
    reports: [
        {
            component: OLD_Metadata,
            name: 'Din bog',
            uuid: 'Metadata',
        },
        {
            component: OLD_GlobalScore,
            name: 'Global Score',
            uuid: 'GlobalScore',
        },
        {
            component: OLD_Genre,
            name: 'Genre',
            uuid: 'Genre',
        },
        {
            component: OLD_Audience,
            name: 'Målgruppe',
            uuid: 'Audience',
        },
        {
            component: OLD_Archetype,
            name: 'Arketype',
            uuid: 'Archetype',
        },
        {
            component: OLD_Tempo,
            name: 'Tempo',
            uuid: 'Tempo',
        },
        {
            component: OLD_Similarbooks,
            name: 'Lignende bøger',
            uuid: 'Similarbooks',
        },
        {
            component: OLD_SemanticFields,
            name: 'Semantiske felter',
            uuid: 'SemanticFields',
        },
        {
            component: OLD_ShowTell,
            name: 'Show/Tell',
            uuid: 'ShowTell',
        },
        {
            component: OLD_Dialogue,
            name: 'Dialog',
            uuid: 'Dialogue',
        },
        {
            component: OLD_Character,
            name: 'Karakter',
            uuid: 'Character',
        },
        {
            component: OLD_Scenes,
            name: 'Scener',
            uuid: 'Scenes',
        },
        // {
        //     component: OLD_Emotions,
        //     name: 'Følelser',
        //     uuid: 'Emotions',
        // },
        {
            component: OLD_Readability,
            name: 'Læsbarhed',
            uuid: 'Readability',
        },
        {
            component: OLD_Adjectives,
            name: 'Tillægsord',
            uuid: 'Adjectives',
        },
        {
            component: OLD_Verbs,
            name: 'Udsagnsord',
            uuid: 'Verbs',
        },
        {
            component: OLD_Powerwords,
            name: 'Stærke ord',
            uuid: 'Powerwords',
        },
        {
            component: OLD_Cliches,
            name: 'Klicheer',
            uuid: 'Cliches',
        },
        {
            component: OLD_Perspective,
            name: 'Perspektiv',
            uuid: 'Perspective',
        },
        {
            component: OLD_Tempus,
            name: 'Tempus',
            uuid: 'Tempus',
        },
    ],

    getReportComponent(id: number) {
        switch (id) {
            case 1:
                return GlobalScore;
            case 2:
                return Archetype;
            case 3:
                return Audience;
            case 4:
                return Genre;
            case 5:
                return Tempo;
            case 6:
                return ShowTell;
            case 7:
                return Dialogue;
            case 8:
                return Readability;
            case 9:
                return Tempus;
            case 10:
                return SimilarBooks;
            case 11:
                return Sentiment;
            case 12:
                return SemanticFields;
            case 13:
                return SceneAnalysis;
            case 14:
                return CharacterAnalysis;
            case 15:
                return PowerWords;
            case 16:
                return Perspective;
            case 17:
                return Cliches;
            default:
                return '';
        }
    },
    
    getReports() {
        return useMyFetch(`reportIndexes/`, { refetch: true }).json<ReportIndex[]>();
    },
    
    getReportInfo(reportId: number) {
        return useMyFetch(`infos/?report=${reportId}`, { refetch: true }).json<ReportInfo[]>();
    },
}
