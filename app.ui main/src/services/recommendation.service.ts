import { useMyFetch } from '@core/api.ts';
import { IArchetypeIndexesResponse, IArchetypeTextResponse, IArticlesResponse, ICharacteristicsResponse, IDashboardResponse, IGlobalScoreTextResponse, ILixResponse, IRecommendationResponse, ITipsResponse, IWhatIsResponse, RecommendationRules } from '@interface/Recommendation.ts';
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum } from '@interface/Model.ts';
import { IArchetypeContentGlobal, IAudienceClassificationGlobal, IGenreClassificationGlobal } from '@interface/Models.ts';

export const RecommendationService = {
    getRecommendation(metricId, genre, audience, metricValue) {
        return useMyFetch(`recommendations/${metricId}/${genre}/${audience}/${metricValue}`, { refetch: true }).json<IRecommendationResponse>();
    },
    getRecommendationsRules() {
        return useMyFetch('recommendations/rules/', { refetch: true }).json<RecommendationRules>();
    },
    getTips(reportId: number) {
        return useMyFetch(`tips/?report=${reportId}`, { refetch: true }).json<ITipsResponse[]>();
    },
    getCharacteristics(reportId: number) {
        return useMyFetch(`characteristics/?report=${reportId}`, { refetch: true }).json<ICharacteristicsResponse[]>();
    },
    getArticles(reportId: number) {
        return useMyFetch(`articles/?report=${reportId}`, { refetch: true }).json<IArticlesResponse[]>();
    },
    getWhatIs() {
        return useMyFetch('whatIs/', { refetch: true }).json<IWhatIsResponse[]>();
    },
    getDashboard() {
        return useMyFetch('dashboard/', { refetch: true }).json<IDashboardResponse[]>();
    },
    getGlobalScoreText() {
        return useMyFetch('globalScores/', { refetch: true }).json<IGlobalScoreTextResponse[]>();
    },
    getArchetypeIndexes() {
        return useMyFetch('archetypeIndexes/', { refetch: true }).json<IArchetypeIndexesResponse[]>();
    },
    getArchetypeText() {
        return useMyFetch('archetypes/', { refetch: true }).json<IArchetypeTextResponse[]>();
    },
    getLixText() {
        return useMyFetch('lix/', { refetch: true }).json<ILixResponse[]>();
    },
    
    convertVariablesToText(message: string, manuscriptRevisionData?: ManuscriptRevision, modelData?: ModelResultData[]): string {
        const globalGenreData: IGenreClassificationGlobal[] | undefined = modelData?.find(x => x.model === ModelResultDataModelEnum.GenreClassification && x.section === 'global')?.content;
        const topGenre = globalGenreData?.sort((a, b) => b.score - a.score)[0];
        const globalAudienceData: IAudienceClassificationGlobal[] | undefined = modelData?.find(x => x.model === ModelResultDataModelEnum.AudienceClassification && x.section === 'global')?.content;
        const topAudience = globalAudienceData?.sort((a,b) => b.score - a.score)[0];
        const globalArchetype: IArchetypeContentGlobal | undefined = modelData?.find(x => x.model === ModelResultDataModelEnum.Archetypes && x.section === 'global')?.content;
        
        const words: string[] = [
            '(?<title>\\$Titel\\$)',
            '(?<genre>\\$Genre\\$)',
            '(?<audience>\\$Audience\\$)',
            '(?<archetype>\\$Arketype\\$)',
            '(?<colon>0x3A)',
        ];
        const replacer = (_substring: string, ...args: any[]) => {
            // Groups is always the last argument. We need to do it this way since they made this in a bad way...
            // This function signature is this (match, p1, p2, /* …, */ pN, offset, string, groups)
            // So the more words we add the more p# will there be. 
            const groups: {[key: string]: string|undefined} = args.at(-1);
            
            if (groups.title !== undefined) return manuscriptRevisionData?.title || '';
            if (groups.genre !== undefined) return topGenre?.class || '';
            if (groups.audience !== undefined) return topAudience?.class || '';
            if (groups.archetype !== undefined) return globalArchetype?.best_archetype_name || '';
            if (groups.colon !== undefined) return ':';
            return '';
        }
        // Do not edit below this line
        const regex = new RegExp(words.join('|'),'gi');
        return message.replace(regex, replacer);
    }
}
