import * as VueRouter from "vue-router";
import { getAccessToken, isAuthenticated, isLoading, login, logout } from '@core/auth.ts';
import { useMainStore } from "@store/main.ts";
import { RecommendationService } from '@service/recommendation.service.ts';
import { RecommendationRules } from '@interface/Recommendation.ts';
import { AuthorService } from '@service/author.service.ts';
import { AuthorStatus } from '@interface/Author.ts';
import { ReportService } from '@service/report.service.ts';
import { FAQ } from '@interface/FAQ.ts';
import { FaqService } from "@service/faq.service.ts";

type manuscriptChildrenOption = 'admin' | 'similarbook' | 'trial' | null;

const manuscriptChildren = (option: manuscriptChildrenOption = null) => {
    let prefix: string;
    switch (option) {
        case "admin":
            prefix = 'adminM';
            break;
        case "similarbook":
            prefix = 'similarBookM';
            break;
        case "trial":
            prefix = 'trialM';
            break;
        default:
            prefix = 'm';
    }
    
    return [
        {
            path: 'dashboard',
            name: prefix+'anuscriptDashboard',
            component: () => import('@page/manuscript/Dashboard.vue'),
        },
        {
            path: 'analysis',
            name: prefix+'anuscriptAnalysis',
            component: () => import('@page/manuscript/Analysis.vue'),
        },
        {
            path: 'print',
            name: prefix+'anuscriptPrint',
            component: () => import('@page/manuscript/Print.vue'),
        },
        {
            path: 'analysis/:reportId',
            name: prefix+'anuscriptReportView',
            component: () => import('@page/manuscript/ReportView.vue'),
        },
        {
            path: 'analysis/wip',
            name: prefix+'anuscriptWIP',
            component: () => import('@page/manuscript/analysis/ReportInProgress.vue')
        },
        {
            path: 'newdashboard',
            name: prefix+'anuscriptNewDashboard',
            component: () => import('@page/manuscript/Newdashboard.vue'),
        },
    ]
}

function determineDestination() {
    const store = useMainStore();
    if (store.hasSubscription) {
        return { name: 'overview' };
    }
    else {
        return { name: 'pricing' };
    }
}

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            beforeEnter: [determineDestination],
            component: () => import('@component/loader.vue'),
        },
        {
            path: '/overview',
            name: 'overview',
            component: () => import('@page/Overview.vue'),
            children: [
                {
                    path: '/guide',
                    name: 'guide',
                    component: () => import('@page/Guide.vue'),
                    meta : {
                        requiresAuth : true
                    }
                },
                {
                    path: '/manuscripts',
                    name: 'manuscripts',
                    component: () => import('@page/Manuscripts.vue'),
                    meta : {
                        requiresAuth : true
                    }
                },
            ],
            redirect: { name: 'guide' }
        },
        {
            path: '/callback',
            name: 'callback',
            component: () => import('@page/callback.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@page/loading.vue')
        },
        {
            path: '/logout',
            name: 'logout',
            component: () => import('@page/loading.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('@page/Admin.vue'),
            children: [
                {
                    path: 'manuscripts',
                    name: 'adminmanuscripts',
                    component: () => import('@page/admin/AdminManuscripts.vue'),
                },
                {
                    path: 'manuscript/:manuscriptId',
                    name: 'adminmanuscript',
                    component: () => import('@page/Manuscript.vue'),
                    props: {
                        isAdmin: true,
                    },
                    children: manuscriptChildren('admin'),
                    redirect: {
                        name: 'adminManuscriptAnalysis'
                    },
                },
                {
                    path:'author/:authorId',
                    name: 'adminauthorprofile',
                    component: () => import('@page/UserProfile.vue'),
                },
                {
                    path:'author/:authorId/history',
                    name: 'adminauthorhistory',
                    component: () => import('@page/admin/AdminAuthorHistory.vue'),
                },
                {
                    path: 'authors',
                    name: 'authors',
                    component: () => import('@page/admin/AdminAuthors.vue'),
                },
                {
                    path: 'authors/manuscripts/:authorId',
                    name: 'authormanuscripts',
                    component: () => import('@page/admin/AdminAuthorManuscripts.vue'),
                },
                {
                    path: 'similarbooks',
                    name: 'similarbooks',
                    component: () => import('@page/admin/AdminSimilarBooks.vue'),
                },
                {
                    path: 'newusers',
                    name: 'newusers',
                    component: () => import('@page/admin/AdminNewUsers.vue'),
                }
            ],
            meta : {
                requiresAuth : true,
                admin: true,
            },
            redirect: { name: 'adminmanuscripts' }
        },

        {
            path: '/manuscripts/:manuscriptId',
            name: 'manuscript',
            component: () => import('@page/Manuscript.vue'),
            props: {
                isAdmin: false,
            },
            children: manuscriptChildren(),
            redirect: { 
                name: 'manuscriptAnalysis'
            },
            meta : {
                requiresAuth : true,
                requiresSubscription: true,
            }
        },
        {
            path: '/similarbook/:isbn',
            name: 'similarbook',
            // component: () => import('@page/SimilarBook.vue'),
            component: () => import('@page/Manuscript.vue'),
            props: {
                isAdmin: false,
                isSimilarBook: true,
            },
            children: manuscriptChildren('similarbook'),
            redirect: {
                name: 'similarBookManuscriptAnalysis'
            },
            meta : {
                requiresAuth : true
            }
        },
        {
            path: '/userprofile',
            name: 'userprofile',
            component: () => import('@page/UserProfile.vue'),
            meta : {
                requiresAuth : true
            }
        },
        {
            path: '/pricing',
            name: 'pricing',
            component: () => import('@page/Pricing.vue'),
        },
        {
            path: '/faq',
            name: 'faq',
            component : () => import('@page/Faq.vue'),
        },
        {
            path: '/contact',
            name: 'contact',
            component: () => import('@page/Contact.vue'),
        },
        {
            path: '/payment',
            name: 'payment',
            redirect: {
                name: 'home'
            },
            children: [
                {
                    path: '?clientReferenceId=:clientReferenceId',
                    redirect: {
                        name: 'home'
                    },
                }
            ]
        },
        {
            path: '/trial',
            name: 'trial',
            component: () => import('@page/TrialReport.vue'),
            // This is alot of things breaking when using manuscript.vue here. 
            // The main reason things break here is you are able to navigate directly to this from a manuscript
            // Manuscript.vue is mostly fixed to handle trial reports, but since it keeps acting up it was stopped being used.
            // component: () => import('@page/Manuscript.vue'),
            props: {
                isAdmin: false,
                isSimilarBook: false,
                isTrial: true,
            },
            children: manuscriptChildren('trial'),
            redirect: {
                name: 'trialManuscriptAnalysis'
            },
        },
    ],
});

const delay = (ms:number) => new Promise(res => setTimeout(res, ms));

const isNullOrUndefined = (val) => {
    return val === null || val === undefined;
}

let settingsLoaded = false;

router.beforeEach(async (to, _from, next) => {
    // Since there is no to await for isloading on auth0 we have created our way to do it...
    while (isLoading()) { await delay(250); }
    const store = useMainStore();
    if (isAuthenticated()) {
        // If there is an error getting the access token then the stored auth0 data is invalid.
        try {
            await getAccessToken();
        } catch (e) {
            login().then();
        }
        if (isNullOrUndefined(store.currentUser.id)) {
            const authorStatusRequest = await AuthorService.getAuthorStatus();
            if (authorStatusRequest.data.value) {
                store.updateUserInfo(authorStatusRequest.data.value as AuthorStatus);
            }
        }
        if (!settingsLoaded) {
            const authorSettingsRequest = await AuthorService.getAuthourSettings();
            if (authorSettingsRequest.data.value) {
                store.updateSettings(authorSettingsRequest.data.value);
            }
            settingsLoaded=true;
        }
        // if (store.dashboard.length <= 0) {
        //     const dashboard = await RecommendationService.getDashboard();
        //     if (dashboard.data.value) {
        //         store.updateDashboard(dashboard.data.value);
        //     }
        // }
        // if (store.archetypeIndexes.length <= 0) {
        //     const archetypeIndexes = await RecommendationService.getArchetypeIndexes();
        //     if (archetypeIndexes.data.value) {
        //         store.updateArchetypeIndexes(archetypeIndexes.data.value);
        //     }
        // }
    }

    if (isNullOrUndefined(store.rules.audiences)) {
        const recommendationRulesRequest = await RecommendationService.getRecommendationsRules();
        if (recommendationRulesRequest.data.value) {
            store.updateRules(recommendationRulesRequest.data.value as RecommendationRules);
        }
    }
    if (store.globalScoreText.length <= 0) {
        const globalScoreText = await RecommendationService.getGlobalScoreText();
        if (globalScoreText.data.value) {
            store.updateGlobalScoreText(globalScoreText.data.value);
        }
    }
    if (store.archetypeText.length <= 0) {
        const archetypeText = await RecommendationService.getArchetypeText();
        if (archetypeText.data.value) {
            store.updateArchetypeText(archetypeText.data.value);
        }
    }
    if (store.whatIs.length <= 0) {
        const whatIs = await RecommendationService.getWhatIs();
        if (whatIs.data.value) {
            store.updateWhatIs(whatIs.data.value);
        }
    }
    if (store.reportLix.length <= 0) {
        const lix = await RecommendationService.getLixText();
        if (lix.data.value) {
            store.updateLixData(lix.data.value);
        }
    }
    if (store.reports.length <= 0) {
        const reports = await ReportService.getReports();
        if (reports.data.value) {
            store.updateReports(reports.data.value);
        }
    }
    if (store.edisonFaqs.length <= 0) {
        const faqs = await FaqService.getAllFAQs();
        if (faqs.data.value) {
            store.updateFaqs(faqs.data.value as FAQ[]);
        }
    }
    
    if (to.path === '/login') {
        if (isAuthenticated()) {
            next('/');
        }
        else {
            login().then();
        }
    }
    else if (to.path === '/logout') {
        logout().then();
    }
    else if (to.path === '/callback') {
        next('/');
    }
    else if (
        (to.path.endsWith('analysis/10'))
        && !store.isAdmin
    ) {
        next(to.path.replace('analysis/10', 'analysis/wip'));
    }
    else {
        if (to.matched.some((record) => record.meta.requiresAuth)) {
            if (isAuthenticated()) {
                if (to.matched.some((record) => record.meta.requiresSubscription)) {
                    if (store.hasSubscription) {
                        next();
                    }
                    else {
                        next('/');
                    }
                }
                else {
                    next();
                }
            }
            else {
                login().then();
            }
        }
        else {
            next();
        }
    }
});

export default router;
