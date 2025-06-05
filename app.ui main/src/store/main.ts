import { defineStore } from 'pinia';
import { AuthorStatus } from "@interface/Author.ts";
import { AchetypeRAGLevel, IArchetypeIndexesResponse, IArchetypeTextResponse, IDashboardResponse, IGlobalScoreTextResponse, ILixResponse, IWhatIsResponse, RecommendationMetric, RecommendationRules } from '@interface/Recommendation.ts';
import { AuthorSetting } from '@interface/defaultModels.ts';
import { AuthorService } from '@service/author.service.ts';
import { remove } from 'lodash';
import { ReportIndex } from '@interface/Report.ts';
import { FAQ } from "@interface/FAQ.ts";

export const useMainStore = defineStore('main', {
    state: () => ({
        userInfo: {} as AuthorStatus,
        recommendationRules: {} as RecommendationRules,
        reportWhatIs: [] as IWhatIsResponse[],
        authorSettings: [] as AuthorSetting[],
        reportIndexs: [] as ReportIndex[],
        reportDashboard: [] as IDashboardResponse[],
        reportGlobalScoreText: [] as IGlobalScoreTextResponse[],
        reportArchetypeIndexes: [] as IArchetypeIndexesResponse[],
        reportArchetypeText: [] as IArchetypeTextResponse[],
        reportAnalyzedOrGivenData: 'Angivet' as string,
        faqs: [] as FAQ[],
        reportLix: [] as ILixResponse[],
        analyzedGivenWarning: true as boolean,
    }),
    getters: {
        currentUser: state => state.userInfo as AuthorStatus,
        isAdmin: state => (state.userInfo?.role === 'ADMIN' || state.userInfo?.role === 'DEVELOPER') as boolean,
        whatIs: state => state.reportWhatIs,
        rules: state => state.recommendationRules,
        settings: state => state.authorSettings,
        reports: state => state.reportIndexs,
        dashboard: state => state.reportDashboard,
        globalScoreText: state => state.reportGlobalScoreText,
        archetypeIndexes: state => state.reportArchetypeIndexes,
        archetypeText: state => state.reportArchetypeText,
        AnalyzedOrGivenData: state => state.reportAnalyzedOrGivenData,
        lixText: state => state.reportLix,
        hasSubscription: state => (state.userInfo?.accessLevel === 'STANDARD' || state.userInfo?.accessLevel === 'PREMIUM') as boolean,
        edisonFaqs: state => state.faqs,
        analyzedOrGivenWarning: state => state.analyzedGivenWarning,
    },
    actions: {
        // Update
        updateUserInfo(info: AuthorStatus) {
            this.userInfo = info;
        },
        updateRules(rules: RecommendationRules) {
            this.recommendationRules = rules;
        },
        updateReports(reports: ReportIndex[]) {
            this.reportIndexs = reports;
        },
        updateWhatIs(whatIs: IWhatIsResponse[]) {
            this.reportWhatIs = whatIs;
        },
        updateDashboard(dashboard: IDashboardResponse[]) {
            this.reportDashboard = dashboard;
        },
        updateGlobalScoreText(GSText) {
            this.reportGlobalScoreText = GSText;
        },
        updateSettings(settings: AuthorSetting[]): void {
            this.authorSettings = settings;
        },
        updateSetting(setting: AuthorSetting): void {
            let obj = this.authorSettings.find(f=>f.name === setting.name);
            if(obj) {
                obj.value = setting.value;
            }
            AuthorService.updateAuthorSetting(setting).then();
        },
        updateArchetypeIndexes(archetypeIndexes: IArchetypeIndexesResponse[]): void {
            this.reportArchetypeIndexes = archetypeIndexes;
        },
        updateArchetypeText(archetypeText: IArchetypeTextResponse[]): void {
            this.reportArchetypeText = archetypeText;
        },
        updateAnalyzedOrGivenData(val: string): void {
            this.reportAnalyzedOrGivenData = val;
        },
        updateFaqs(faqs: FAQ[]): void {
            this.faqs = faqs;
        },
        updateLixData(val: ILixResponse[]) {
            this.reportLix = val;
        },

        // Get with paramenters
        getReport(reportId: number): ReportIndex | undefined {
            return this.reportIndexs.find(x => x.id === reportId);
        },

        getWhatIs(reportId: number): IWhatIsResponse {
            return this.reportWhatIs.find(x => x.report === reportId) || {id:0,report:0,report_name:'',head:'',text:''};
        },
        
        getMetric(id: number): RecommendationMetric {
            const metrics = this.recommendationRules.metrics;
            return metrics.find(x => x.id === id) || {id:0,name:'',uniqueName:'',reportIndex:0,variableName:'',modelName:''};
        },
        
        getMetricForReport(reportId: number): RecommendationMetric[] {
            const metrics = this.recommendationRules.metrics;
            return metrics.filter(x => x.reportIndex == reportId);
        },
        getAudienceId(name: string): number {
            const audiences = this.recommendationRules.audiences;
            if (name === 'Spaending') {
                name = 'Spænding';
            }
            return audiences.find(x => x.name === name)?.id || 0;
        },
        getAudienceName(id: number): string {
            const audiences = this.recommendationRules.audiences;
            return audiences.find(x => x.id === id)?.name || 'Audience not found';
        },
        getGenreId(name: string): number {
            const genres = this.recommendationRules.genres;
            if (name === 'Boern') {
                name = 'Børn';
            }
            return genres.find(x => x.name === name)?.id || 0;
        },
        getGenreName(id: number): string {
            const genres = this.recommendationRules.genres;
            return genres.find(x => x.id === id)?.name || 'Genre not found';
        },
        getSetting(name: string): AuthorSetting | undefined {
            return this.authorSettings.find(x => x.name === name);
        },
        getGlobalScoreTextByType(type: number): IGlobalScoreTextResponse {
            return this.reportGlobalScoreText.find(x => x.type === type) || {id: 0,type:0,typeName:'',text:'',};
        },
        getGlobalScoreTextById(id: number): IGlobalScoreTextResponse {
            return this.reportGlobalScoreText.find(x => x.id === id) || {id: 0,type:0,typeName:'',text:'',};
        },
        getArchetypeTextByClass(aClass: string, RAGLevel: AchetypeRAGLevel = 'Text'): IArchetypeTextResponse {
            let type = 0;
            switch (aClass.toLowerCase().replaceAll(' ','_').replace('ø','oe')) {
                case 'rags_to_riches':
                    type = 1;
                    break;
                case 'tragedy':
                    type = 2;
                    break;
                case 'icarus':
                    type = 3;
                    break;
                case 'man_in_a_hole':
                    type = 4;
                    break;
                case 'cinderella':
                    type = 5;
                    break;
                case 'oedipus':
                    type = 6;
                    break;
            }
            
            return this.reportArchetypeText.find(x => x.type === type && x.RAGLevel === RAGLevel) || 
                {id: 0,type: 0,typeName: '',RAGLevel: '',text: '',};
        },
        getLixText(value: number): ILixResponse {
            return this.reportLix.find(lix => lix.min <= value && lix.max >= value) ??
                {id:0, text: '', max: 0, min: 0, lign: '', headline: ''};
        },
        dismissAnalyzedGivenWarning(): void {
            this.analyzedGivenWarning = false;
        },

        // Delete
        deleteSetting(name: string): void {
            remove(this.authorSettings, (item) => item.name === name);

            AuthorService.deleteAuthorSetting(name).then();
        }
    },
});
