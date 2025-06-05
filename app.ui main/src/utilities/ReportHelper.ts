import { ModelResultData, ModelResultDataModelEnum, ModelResultDataSectionEnum } from "@interface/Model.ts";
import { IArchetypeContentGlobal, IAudienceClassificationGlobal, IDialogueGlobal, IGenreClassificationGlobal, IGlobalAnalyzedContent, ILegibilityGlobal, IPowerWordsGlobal, IShowingTellingGlobal, ITenseGlobal, TempoGlobalContent } from '@interface/Models.ts';
import { RecommendationMetric } from '@interface/Recommendation.ts';
import { useMainStore } from '@store/main.ts';
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ChartService } from '@service/chart.service.ts';
import { NumberBallRecommendation } from '@component/report/reportRecommendations.vue';

/**
 * Get a single model data.
 * @param data models data source.
 * @param model model name, see ModelResultDataModelEnum
 * @param section model section, if not provided Global will be selected, see ModelResultDataSectionEnum
 * 
 * @see ModelResultDataModelEnum
 * @see ModelResultDataSectionEnum
 */
export const getModelData = <T = any>(data: ModelResultData[], model: ModelResultDataModelEnum, section?: ModelResultDataSectionEnum): ModelResultData<T> | undefined => {
    return data.find(x => {
        if (x.model === model) {
            if (section === undefined && x.section === ModelResultDataSectionEnum.Global) {
                return true;
            } 
            else if (x.section === section) {
                return true;
            }
        }
        
        return false;
    });
}

export const recommendationValue = (metric: RecommendationMetric, modelData: ModelResultData[], manuscriptRevisionData: ManuscriptRevision) => {
    const globalData: IGlobalAnalyzedContent = modelData.find(x => x.model === ModelResultDataModelEnum.GlobalAnalyzed && x.section === 'global')?.content;
    const globalLegibilityData: ILegibilityGlobal = modelData.find(x => x.model === ModelResultDataModelEnum.Legibility && x.section === 'global')?.content;
    const globalShowTellData: IShowingTellingGlobal = modelData.find(x => x.model === ModelResultDataModelEnum.ShowingTelling && x.section === 'global')?.content;
    const globalArketypeData: IArchetypeContentGlobal = modelData.find(x => x.model === ModelResultDataModelEnum.Archetypes && x.section === 'global')?.content;
    const globalGenreData: IGenreClassificationGlobal[] = modelData.find(x => x.model === ModelResultDataModelEnum.GenreClassification && x.section === 'global')?.content;
    let selectedGenre = globalGenreData.sort((a, b) => b.score - a.score)[0];
    const globalTempoData: TempoGlobalContent = modelData.find(x => x.model === ModelResultDataModelEnum.Tempo && x.section === 'global')?.content;
    const globalAudienceData: IAudienceClassificationGlobal[] = modelData.find(x => x.model === ModelResultDataModelEnum.AudienceClassification && x.section === 'global')?.content;
    let selectedAudience = globalAudienceData.sort((a, b) => b.score - a.score)[0];
    const globalDialogueData: IDialogueGlobal = modelData.find(x => x.model === ModelResultDataModelEnum.Dialogue && x.section === 'global')?.content;
    const globalPowerwordsData: IPowerWordsGlobal = modelData.find(x => x.model === ModelResultDataModelEnum.PowerWords && x.section === 'global')?.content;
    const globalTenseData: ITenseGlobal = modelData.find(x => x.model === ModelResultDataModelEnum.Tense && x.section === 'global')?.content;

    const store = useMainStore();
    if (store.AnalyzedOrGivenData === 'Angivet') {
        selectedGenre = globalGenreData.find(x => x.class === manuscriptRevisionData.genre)!;
        selectedAudience = globalAudienceData.find(x => x.class === manuscriptRevisionData.audience)!;
    }

    switch (metric.id) {
        case 1:
            return globalLegibilityData.LIX;
        case 2:
            return globalLegibilityData["number of words"];
        case 3:
            return globalLegibilityData["average sentence length"];
        case 4:
            return globalLegibilityData["percentage of complex words"];
        case 5: // number of words
            return globalLegibilityData["lexicon size"];
        case 6:
            return globalArketypeData.best_archetype_score;
        case 7:
            return globalData.score;
        case 8:
            return selectedGenre.score;
        case 9:
            return globalTempoData["percentage of fast paragraphs"];
        case 10:
            return selectedAudience.score;
        case 11:
            return globalShowTellData["percentage of adverbs"];
        case 12:
            return globalShowTellData["percentage of adjectives"];
        case 13:
            return globalShowTellData["percentage of filling words"];
        case 14:
            return globalShowTellData["percentage of descriptive words"];
        case 15:
            return globalShowTellData.show_tell_value;
        case 16:
            return globalDialogueData['percentage of paragraphs with dialogues'] ?? globalDialogueData['percentage of dialogue sentences'] ?? 0;
        case 17:
            return globalPowerwordsData['number of power words'];
        case 18:
            return globalTenseData['percentage of present tense'];
        case 19:
            return globalDialogueData['percentage of verbs in \'sige\' or \'spørge\''] ?? globalDialogueData["percentage of 'sige' or 'spørge' in dialogue-verbs"] ?? globalDialogueData["percentage of 'sige' or 'spørge' in dialogue verbs"] ?? 0;
        case 20:
            return globalDialogueData['number of adverbs in dialogue'];
        case 21:
            return globalDialogueData['number of utterances'];
        case 22:
            return 0;
        case 23:
            return globalLegibilityData["number of sentences"];
        case 24:
            return 0;
        case 25:
            return globalDialogueData['percentage of dialogue sentences'];
        default:
            return 0;
    }
}

export const createNumberBalls = (
    metrics: RecommendationMetric[],
    modelData: ModelResultData[],
    manuscriptRevisionData: ManuscriptRevision,
    gauge?: boolean
): NumberBallRecommendation[] => {
    return metrics.map((metric: RecommendationMetric) => {
        return {
            metric: metric,
            value: recommendationValue(metric, modelData, manuscriptRevisionData)?.toString(),
            gauge: gauge ?? false,
        } as NumberBallRecommendation;
    });
}

export const perspectiveTranslater = (perspectve: string) => {
    switch (perspectve) {
        case '1rst':
            return '1. Person';
        case '2nd':
            return '2. Person';
        case '3rd':
            return '3. Person';
        default:
            return '';
    }
}

export const perspectiveColor = (perspective: string) => {
    switch (perspective) {
        case '1rst':
            return ChartService.backgroundColors[0];
        case '2nd':
            return ChartService.backgroundColors[1];
        case '3rd':
            return ChartService.backgroundColors[2];
        default:
            return '';
    }
}