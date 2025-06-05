<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData, ModelResultDataModelEnum, ModelResultDataSectionEnum } from '@interface/Model.ts';
import NumberBall from '@component/numberBall.vue';
import cirkleArrow from '@asset/icons/circleArrow.svg';
// import cirkleCheckmark from '@asset/icons/circleCheckmark.svg';
import EdisonGauge from '@component/edisonGauge.vue';
import CircleProgress from '@component/circleProgress.vue';
import ArchetypeGraph from '@component/archetypeGraph.vue';
import { useMainStore } from '@store/main.ts';
import { getModelData, perspectiveColor, recommendationValue } from '@util/ReportHelper.ts';
import {
    IArchetypeContentGlobal, IArchetypeContentParts, IArchetypesGlobal,
    IAudienceClassificationGlobal,
    IClichesGlobal, IClichesListItem,
    IDialogueGlobal,
    IGenreClassificationGlobal,
    IGlobalAnalyzedContent,
    ILegibilityGlobal,
    IPerspectiveGlobal,
    IPowerWordsGlobal,
    IScenesCharacters,
    IScenesLocations,
    ISemanticFieldsGlobal,
    IShowingTellingGlobal,
    ISimilarBooksGlobal,
    ITenseGlobal,
    TempoGlobalContent
} from '@interface/Models.ts';
import { computed, h, Ref, ref, VNode, watch } from 'vue';
import { translateGlobalScoreLabels } from '@util/translate.ts';
import { ReportIndex } from '@interface/Report.ts';
import router from '@core/router.ts';
import { RecommendationService } from '@service/recommendation.service.ts';
import { ChartService } from "@service/chart.service.ts";
import Chart from "primevue/chart";
import {ClicheListItem, ClicheListItemChild} from "@page/manuscript/analysis/Cliches.vue";
import { AchetypeRAGLevel } from '@interface/Recommendation.ts';

// Interfaces
interface NameStringValueNumber {
    name: string;
    value: number;
}

interface reportItem extends ReportIndex {
    data: VNode;
    recommendation: Ref;
}

// Props, store and component primary variables
const props = defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[],
}>();
const store = useMainStore();
const valid = ref(false);

const hideRecommendation = [11, 10, 12, 13, 14, 15, 16, 17];

// Model variables
const globalUser = getModelData<IGlobalAnalyzedContent>(props.modelData, ModelResultDataModelEnum.GlobalUser);
const globalAnalyzed = getModelData<IGlobalAnalyzedContent>(props.modelData, ModelResultDataModelEnum.GlobalAnalyzed);
const archetypeGlobal = getModelData<IArchetypeContentGlobal>(props.modelData, ModelResultDataModelEnum.Archetypes);
const archetypeParts = getModelData<IArchetypeContentParts[]>(props.modelData, ModelResultDataModelEnum.Archetypes, ModelResultDataSectionEnum.Parts);
const genreGlobal = getModelData<IGenreClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.GenreClassification);
const audienceGlobal = getModelData<IAudienceClassificationGlobal[]>(props.modelData, ModelResultDataModelEnum.AudienceClassification);
const tempoGlobal = getModelData<TempoGlobalContent>(props.modelData, ModelResultDataModelEnum.Tempo);
const showtellGlobal = getModelData<IShowingTellingGlobal>(props.modelData, ModelResultDataModelEnum.ShowingTelling);
const dialogueGlobal = getModelData<IDialogueGlobal>(props.modelData, ModelResultDataModelEnum.Dialogue);
const legibilityGlobal = getModelData<ILegibilityGlobal>(props.modelData, ModelResultDataModelEnum.Legibility);
const tenseGlobal = getModelData<ITenseGlobal>(props.modelData, ModelResultDataModelEnum.Tense);
const semanticFieldsGlobal = getModelData<ISemanticFieldsGlobal>(props.modelData, ModelResultDataModelEnum.SemanticFields);
const scenesLocations = getModelData<IScenesLocations[]>(props.modelData, ModelResultDataModelEnum.Scenes, ModelResultDataSectionEnum.Locations);
const scenesCharacters = getModelData<IScenesCharacters[]>(props.modelData, ModelResultDataModelEnum.Scenes, ModelResultDataSectionEnum.Characters);
const powerwordsGlobal = getModelData<IPowerWordsGlobal>(props.modelData, ModelResultDataModelEnum.PowerWords);
const perspectiveGlobal = getModelData<IPerspectiveGlobal>(props.modelData, ModelResultDataModelEnum.Perspective);
const clichesGlobal = getModelData<IClichesGlobal>(props.modelData, ModelResultDataModelEnum.Cliches);
const globalSimilarBooks = getModelData<ISimilarBooksGlobal[]>(props.modelData, ModelResultDataModelEnum.SimilarBooks);

// Model data variables
const globalUserData = computed<IGlobalAnalyzedContent>(() => {
    // Enforce analyseret when it is similar books.
    const dataSource = store.AnalyzedOrGivenData;
    
    if (globalUser?.content && dataSource === 'Angivet') {
        return globalUser.content;
    }
    if (globalAnalyzed?.content && dataSource === 'Analyseret') {
        return globalAnalyzed.content
    }
    
    return {
        archetype: 0, audience_classification: 0, cliches: 0, dialogue: 0, genre_classification: 0, legibility: 0,
        power_words: 0, score: 0, showing_telling: 0, tempo: 0
    }
});

const genreGlobalData = ref<IGenreClassificationGlobal[]>([]);
const audienceGlobalData = ref<IAudienceClassificationGlobal[]>([]);
const topGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});
const topAudience = ref<IAudienceClassificationGlobal>({
    class: '',
    score: 0
});
const topArchetype = ref<IArchetypesGlobal>({
    class: '',
    score: 0,
    pattern: [],
});

// Chart variables
const lineChartData = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'Stemning',
            data: [] as number[],
            fill: false,
            borderColor: ChartService.borderColor[1],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[1], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 0,
        },
        {
            label: 'Tendenslinje',
            data: [] as number[],
            fill: false,
            borderColor: ChartService.borderColor[0],
            backgroundColor: ChartService.transparentize(ChartService.backgroundColors[0], 0.6),
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 0,
        },
    ]
});
const lineChartOptions = ChartService.getDefaultLineOptions({
    scales: {
        y: {
            display: false,
        },
        x: {
            display: false,
        },
    }
});

// Other variables
const hiddenGlobalScoreValues = ['score'];
const globalScoreDiviations = computed<NameStringValueNumber[]>(() => {
    const data: NameStringValueNumber[] = [];
    for (const ref in globalUserData.value) {
        const val = globalUserData.value[ref];
        if (val !== 0 && !hiddenGlobalScoreValues.includes(ref)) {
            data.push({
                name: ref,
                value: val,
            });
        }
    }
    data.sort((a,b) => a.value - b.value);
    
    return data;
});

const reportItems = ref<reportItem[]>([]);

// Functions 
const navigate = (reportId: number) => {
    let linkPrefix = 'manuscript';
    if (props.isAdmin) {
        linkPrefix = 'adminManuscript';
    }
    if (props.isSimilarBook) {
        linkPrefix = 'similarBookManuscript';
    }
    if (props.isTrial) {
        linkPrefix = 'trialManuscript';
    }

    document.getElementsByClassName('manuscript-content-container')[0]?.scrollTo({ top: 0, behavior: 'auto' });
    router.push({ name: linkPrefix + 'ReportView', params: { reportId: reportId } }).then();
};

const convertStatisticProcent = (val?: number): number => {
    if (val === undefined) {
        return 0;
    }
    return Math.round(val * 100);
};

const dashboardMetric = (reportId: number) => {
    const metrics = store.getMetricForReport(reportId)

    switch (reportId) {
        case 1:
            return metrics[0]
        case 2:
            return metrics[0]
        case 3:
            return metrics[0]
        case 4:
            return metrics[0]
        case 5:
            return metrics[0]
        case 6:
            return metrics[0]
        case 7:
            return metrics[0]
        case 8:
            return metrics[0]
        case 9:
            return metrics[0]
        case 10:
            return metrics[0]
        case 11:
            return metrics[0]
        case 12:
            return metrics[0]
        case 13:
            return metrics[0]
        case 14:
            return metrics[0]
        case 15:
            return metrics[0]
        case 16:
            return metrics[0]
        case 17:
            return metrics[0]
        default:
            return undefined
    }
}

const loadRecommendations = (reportId: number, recommendation: Ref<string>) => {
    // There should only be one metric per report!
    const metric = dashboardMetric(reportId)
    let genre = topGenre.value.class;
    let audience = topAudience.value.class;
    if (store.AnalyzedOrGivenData === 'Angivet') {
        genre = props.manuscriptRevisionData.genre;
        audience = props.manuscriptRevisionData.audience;
    }
    
    if (metric !== undefined) {
        RecommendationService.getRecommendation(
            metric.id,
            store.getGenreId(genre),
            store.getAudienceId(audience),
            recommendationValue(metric, props.modelData, props.manuscriptRevisionData)
        ).then(request => {
            const data = request.data.value;
            if (data !== undefined && data !== null) {
                if (metric.id == 6) {
                    recommendation.value = store.getArchetypeTextByClass(topArchetype.value.class, data.RAGLevel as AchetypeRAGLevel).text;
                    return;
                }
                recommendation.value = data.message;
            } else {
                recommendation.value = 'Fejlede i at hente anbefalingen';
            }
        });
    }
    else {
        recommendation.value = 'Der blev ikke fundet nogen anbefaling til denne report';
    }
}

// THE MACHINE!
try {
    if (genreGlobal?.content !== undefined) {
        genreGlobalData.value = genreGlobal.content.sort((a, b) => b.score - a.score);
        topGenre.value = genreGlobalData.value[0];
    }
    if (audienceGlobal?.content !== undefined) {
        audienceGlobalData.value = audienceGlobal.content.sort((a, b) => b.score - a.score);
        topAudience.value = audienceGlobalData.value[0];
    }
    if (archetypeGlobal?.content !== undefined) {
        topArchetype.value = {
            class: archetypeGlobal.content.best_archetype_name,
            score: archetypeGlobal.content.best_archetype_score,
            pattern: [],
        };
    }
    if (archetypeParts?.content !== undefined) {
        for (const chunks of archetypeParts.content) {
            let chunk = chunks.chunks;
            lineChartData.value.labels.push(chunk.part.toString() + '%');
            lineChartData.value.datasets[0].data.push(chunk["sentiment"]);
            lineChartData.value.datasets[1].data.push(chunk["trendline"]);
        }
    }

    for (const report of store.reports.sort((a, b) => a.sortIndex - b.sortIndex)) {
        if (report.id === 1) { // This is global score
            continue;
        }
        // We do not show the similar books report when it is a trial report
        if (
            (report.id === 10)
            && props.isTrial
            ||
            (report.id === 10)
            && !store.isAdmin
        ) {
            continue;
        }

        const children: VNode[] = [];
        const classes: string[] = ['report-data'];
        const circleProgressBackgroundFill = '#5B5B5B';
        const numberBallFontColor = '#000';
        
        const recommendation = ref<string>('Henter anbefaling...');
        loadRecommendations(report.id, recommendation);
        watch(
            () => store.AnalyzedOrGivenData,
            () => loadRecommendations(report.id, recommendation),
        );
        switch (report.id) {
            case 2:
                children.push(h('div', { class: 'header' }, [
                    archetypeGlobal?.content.best_archetype_name ?? ''
                ]));
                children.push(h('div', { class: 'score' }, [
                    h(ArchetypeGraph, {
                        archetype: archetypeGlobal?.content.best_archetype_name ?? '',
                        width: '10rem', 
                        height: '5rem',
                    })
                ]));
                break;
            case 3:
                children.push(h('div', { class: 'header' }, [
                    topAudience.value.class
                ]));
                children.push(h('div', { class: 'score' }, [
                    h(EdisonGauge, {
                        value: topAudience.value.score,
                        style: 'height: 4rem',
                    })
                ]));
                break;
            case 4:
                children.push(h('div', { class: 'header' }, [
                    topGenre.value.class
                ]));
                children.push(h('div', { class: 'score' }, [
                    h(EdisonGauge, {
                        value: topGenre.value.score,
                        style: 'height: 4rem',
                    })
                ]));
                break;
            case 5:
                let fastParagraphs = convertStatisticProcent(tempoGlobal?.content['percentage of fast paragraphs']);
                let slowParagraphs = 100 - fastParagraphs;
                classes.push('justify-space-around');
                children.push(h('div', { class: 'score circle' }, [
                    h(CircleProgress, {
                        percentage: fastParagraphs,
                        size: '4.5rem',
                        backgroundFill: circleProgressBackgroundFill,
                    }),
                    h('div', { class: 'subline' }, ['Hurtige afsnit'])
                ]));
                children.push(h('div', { class: 'score circle' }, [
                    h(CircleProgress, {
                        percentage: slowParagraphs,
                        size: '4.5rem',
                        backgroundFill: circleProgressBackgroundFill,
                    }),
                    h('div', { class: 'subline' }, ['Langsomme afsnit'])
                ]));
                break;
            case 6:
                children.push(h('div', { class: 'header' }, [
                    'Score'
                ]));
                children.push(h('div', { class: 'score' }, [
                    h(CircleProgress, {
                        percentage: convertStatisticProcent(showtellGlobal?.content.show_tell_value),
                        size: '5.25rem',
                        backgroundFill: circleProgressBackgroundFill,
                    })
                ]));
                break;
            case 7:
                children.push(h('div', { class: 'header' }, [
                    'Dialog'
                ]));
                children.push(h('div', { class: 'score' }, [
                    h(CircleProgress, {
                        percentage: convertStatisticProcent(dialogueGlobal?.content['percentage of paragraphs with dialogues']),
                        size: '5.25rem',
                        backgroundFill: circleProgressBackgroundFill,
                    })
                ]));
                break;
            case 8:
                children.push(h('div', { class: 'header' }, [
                    'LIX TAL'
                ]));
                children.push(h('div', { class: 'score' }, [
                    h(NumberBall, {
                        value: legibilityGlobal?.content.LIX.toFixed(0) ?? 0,
                        size: '5rem',
                        fontSize: 'M',
                        fontColor: numberBallFontColor,
                    })
                ]));
                break;
            case 9:
                if (tenseGlobal?.content['main tense'] === 'Past') {
                    children.push(h('div', { class: 'header' }, [
                        'Datid'
                    ]));
                    children.push(h('div', { class: 'score' }, [
                        h(CircleProgress, {
                            percentage: convertStatisticProcent(tenseGlobal?.content['percentage of past tense']),
                            size: '5.25rem',
                            backgroundFill: circleProgressBackgroundFill,
                        })
                    ]));
                }
                else {
                    children.push(h('div', { class: 'header' }, [
                        'Nutid'
                    ]));
                    children.push(h('div', { class: 'score' }, [
                        h(CircleProgress, {
                            percentage: convertStatisticProcent(tenseGlobal?.content['percentage of present tense']),
                            size: '5.25rem',
                            backgroundFill: circleProgressBackgroundFill,
                        })
                    ]));
                }
                break;
            case 10:
                const tableBody = [
                    h('div', { class: 'data-table-row header text-primary font-bold'}, [
                        h('div', { class: 'data-table-cell'}, ['Title']),
                    ]),
                ];
                
                for (const simBook of globalSimilarBooks?.content ?? []) {
                    tableBody.push(h('div', { class: 'data-table-row' }, [
                        h('div', { class: 'data-table-cell'}, [simBook.title]),
                    ]))
                }
                
                children.push(h('div', { class: 'data-table-wrapper' }, [
                    h('div', { class: 'data-table-body'}, tableBody),
                ]));
                break;
            case 11:
                classes.push('justify-normal');
                children.push(h(Chart, {
                    type: 'line',
                    data: lineChartData.value,
                    options: lineChartOptions,
                    class: 'h-20rem w-full notFullViewWidth',
                }));
                break;
            case 12:
                if (semanticFieldsGlobal?.content !== undefined) {
                    classes.push('justify-space-around');
                    const sortedTopics = semanticFieldsGlobal?.content.topics.sort((a, b) => b.propensity - a.propensity).slice(0,5);

                    const semanticBody = [
                        h(Chart, {
                            type: 'bar',
                            class: 'notFullViewWidth',
                            data: {
                                labels: sortedTopics.map((item) => item['topic name']),
                                datasets: [
                                    {
                                        label: 'Score',
                                        data: sortedTopics.map((item) => item.propensity.toFixed(2)),
                                        backgroundColor: ChartService.backgroundColors,
                                        borderWidth: 1,
                                    },
                                ],
                            },
                            options: {
                                indexAxis: 'y',
                                scales: {
                                    x: {
                                        ticks: {
                                            color: '#FFF',
                                        },
                                    },
                                    y: {
                                        ticks: {
                                            color: '#FFF',
                                        },
                                    },
                                },
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                            },
                            style: 'height: 100%; width: 100%',
                        }),
                    ];

                    children.push(h('div', { class: 'semantic-fields-container' }, semanticBody));
                }
                break;
            case 13:
                classes.push('justify-space-around');
                const sortedScenes = scenesLocations?.content.sort((a, b) => b.score - a.score).slice(0,5);

                const scenedataBody = [
                    h('div', { class: 'data-table'}, [
                        h('div', { class: 'data-table-body'}, [
                            sortedScenes?.map((item, index) => {
                                return h('div', { class: 'data-table-row'}, [
                                    h('div', { class: 'data-table-cell'}, [
                                        h('div', { class: 'scene'}, [
                                            h(NumberBall, {
                                                value: index + 1,
                                                size: '2rem',
                                                fontColor: numberBallFontColor,
                                                background: ChartService.backgroundColors[index],
                                            }),
                                            h('div', { class: 'cell-text'}, [item.name]),
                                        ]),
                                    ]),
                                    h('div', { class: 'data-table-cell'}, [
                                        'Optræder ' + item.score + ' gange'
                                    ]),
                                ]);
                            }),
                        ]),
                    ]),
                ];

                children.push(h('div', { class: 'scenes-wrapper' }, scenedataBody));
                break;
            case 14:
                classes.push('justify-space-around');
                const sortedCharacters = scenesCharacters?.content.sort((a, b) => b.score - a.score).slice(0,5);

                const charadataBody = [
                    h('div', { class: 'data-table'}, [
                        h('div', { class: 'data-table-body'}, [
                            sortedCharacters?.map((item, index) => {
                                return h('div', { class: 'data-table-row'}, [
                                    h('div', { class: 'data-table-cell'}, [
                                        h('div', { class: 'character'}, [
                                            h(NumberBall, {
                                                value: index + 1,
                                                size: '2rem',
                                                fontColor: numberBallFontColor,
                                                background: ChartService.backgroundColors[index],
                                            }),
                                            h('div', { class: 'cell-text'}, [item.name]),
                                        ]),
                                    ]),
                                    h('div', { class: 'data-table-cell'}, [
                                        'Optræder ' + item.score + ' gange'
                                    ]),
                                ]);
                            }),
                        ]),
                    ]),
                ];

                children.push(h('div', { class: 'character-wrapper' }, charadataBody));
                break;
            case 15:
                classes.push('justify-space-around');
                const size = '4rem';
                const fontSize = 'S';

                children.push(h('div', { class: 'score circle' }, [
                    h(NumberBall, {
                        value: powerwordsGlobal?.content['number of power words'] ?? 0,
                        size: size,
                        fontSize: fontSize,
                        fontColor: numberBallFontColor,
                    }),
                    h('div', { class: 'subline small' }, ['Stærke ord'])
                ]));
                children.push(h('div', { class: 'score circle' }, [
                    h(NumberBall, {
                        value: showtellGlobal?.content['number of adjectives'] ?? 0,
                        size: size,
                        fontSize: fontSize,
                        fontColor: numberBallFontColor,
                    }),
                    h('div', { class: 'subline small' }, ['Tillægsord'])
                ]));
                children.push(h('div', { class: 'score circle' }, [
                    h(NumberBall, {
                        value: showtellGlobal?.content['number of filling words'] ?? 0,
                        size: size,
                        fontSize: fontSize,
                        fontColor: numberBallFontColor,
                    }),
                    h('div', { class: 'subline small' }, ['Fyldord'])
                ]));
                children.push(h('div', { class: 'score circle' }, [
                    h(NumberBall, {
                        value: showtellGlobal?.content['number of adverbs'] ?? 0,
                        size: size,
                        fontSize: fontSize,
                        fontColor: numberBallFontColor,
                    }),
                    h('div', { class: 'subline small' }, ['Biord'])
                ]));
                break;
            case 16:
                let perspectiv = '';
                switch (perspectiveGlobal?.content["main person indicator"]) {
                    case '1rst':
                        perspectiv = '1. Person';
                        break;
                    case '2nd':
                        perspectiv = '2. Person';
                        break;
                    case '3rd':
                        perspectiv = '3. Person';
                        break;
                    default:
                        perspectiv = '';
                        break;
                }

                children.push(h('div', { class: 'header' }, [perspectiv]));
                children.push(h('div', { class: 'score subheader' }, [
                    (h(CircleProgress, {
                        percentage: Math.round(perspectiveGlobal?.content['consistence score'] ?? 0),
                        size: '5.25rem',
                        progressFill: perspectiveColor(perspectiveGlobal?.content["main person indicator"] ?? ''),
                    })),
                ]));
                break;
            case 17:
                classes.push('justify-space-around flex flex-column');
                const clichesList = ref<ClicheListItem[]>([]);

                for (let cliche in clichesGlobal?.content["cliches list"]) {
                    const clicheItems = clichesGlobal?.content["cliches list"][cliche] as IClichesListItem[];
                    const listAmount = clicheItems.length;
                    if (listAmount === 0) {
                        continue;
                    }
                    clichesList.value.push({
                        name: cliche,
                        amount: listAmount,
                        children: clicheItems.map<ClicheListItemChild>(x => {
                            return {
                                name: x.sentence,
                                similarity: Math.round(x['similarity score']),
                            }
                        }).sort((a, b) => b.similarity - a.similarity).slice(0,3),
                        childrenVisible: false,
                    });
                }

                children.push(h('div', { class: 'header mb-3' }, ['Oversigt over klicheer']));
                if (clichesList.value.length !== 0) {
                    children.push(h('div', { class: 'cliches-list' }, [
                        clichesList.value.slice(0,3).map((item, index) => {
                            return h('div', { class: 'cliches-list-item' }, [
                                h('div', { class: 'header-wrapper' }, [
                                    h('div', { class: 'left' }, [
                                        h(NumberBall, {
                                            value: index + 1,
                                            size: '2rem',
                                            fontColor: numberBallFontColor,
                                            background: ChartService.backgroundColors[index],
                                        }),
                                        h('div', { class: 'header' }, [item.name]),
                                    ]),
                                ]),
                            ]);
                        }),
                    ]));
                }
                else {
                    children.push(h('div', { class: 'cliches-list' }, [
                        h('div', { class: 'cliches-list-item' }, [
                            h('div', { class: 'header-wrapper' }, [
                                h('div', { class: 'left' }, [
                                    h('div', { class: 'header' }, ['Ingen klicheer fundet']),
                                ]),
                            ]),
                        ]),
                    ]));
                }
                break;
        }

        reportItems.value.push({
            data: h('div', {
                class: classes.join(' '),
            }, children),
            recommendation: recommendation,
            ...report,
        });
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}

</script>

<template>
    <div class="analysis-wrapper">
        <div class="col s12 data-wrapper">
            <div class="data-table">
                <div class="data-table-body">
                    <div class="data-table-row">
                        <div class="data-table-cell">Titel</div>
                        <div class="data-table-cell">Målgruppe</div>
                        <div class="data-table-cell">Genre</div>
                        <div class="data-table-cell">Oprettet</div>
                    </div>
                    <div class="data-table-row">
                        <div class="data-table-cell">{{ manuscriptRevisionData.title }}</div>
                        <div class="data-table-cell">{{ manuscriptRevisionData.audience }}</div>
                        <div class="data-table-cell">{{ manuscriptRevisionData.genre }}</div>
                        <div class="data-table-cell">{{
                                new Date(manuscriptRevisionData.created).toLocaleDateString('da-DK', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col s8">
            <div class="col-item">
                <div class="globalscore-left">
                    <div class="headline">Global Score</div>
                    <div>
                        En global score er en samlet score for dit manuskript på mellem 0 og 100. Scoren udregnes ud
                        fra rigtig mange variable i Edisons samlede analyse af manuskriptet.
                    </div>
                </div>
                <div class="align-center-me margin-left-auto">
                    <NumberBall size="12rem" :value="globalUserData.score" font-color="#000"/>
                </div>
            </div>
        </div>
        <div class="col s4">
            <div class="col-item column align-center">
                <div class="headline">
                    Afvigelser
                </div>
                <div class="listItem" v-for="item in globalScoreDiviations">
                    <span>{{ translateGlobalScoreLabels(item.name) }}</span><span>{{ item.value }}</span>
                </div>
            </div>
        </div>
        <div class="col s4 min-width" v-for="report in reportItems">
            <div class="col-item column">
                <div class="header align-start-me">{{ report.name }}</div> <!-- Add this for debugging " - {{ report.id }}" -->
                <component :is="report.data"/>
                <div class="recommendation" v-if="!hideRecommendation.includes(report.id)">
                    <p class="header">Anbefaling</p>
                    <p class="text">{{ RecommendationService.convertVariablesToText(report.recommendation, manuscriptRevisionData) }}</p>
                </div>
                <div class="bottom">
                    <!-- This is awaiting later development -->
                    <!--<div class="checker">-->
                    <!--<cirkleCheckmark />-->
                    <!--<span>Acceptér</span>-->
                    <!--</div>-->
                    <div class="navigation noPrint" @click="navigate(report.id)">
                        <span>Gå til {{ report.name }} rapport</span>
                        <cirkleArrow class="arrow E" fill="#2C2C2C"/>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<style scoped lang="scss">
.analysis-wrapper {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem 5rem;
    // 1200px is the min size before this layout breaks.
    min-width: calc(1200px);
    max-width: calc(2000px);
    margin: auto;
    
    @media print {
        color: #000 !important;
        min-width: calc(800px) !important;
        //max-width: calc(1000px) !important;
        padding: 0 !important;
    }

    > .col {
        flex: 0 0 auto;
        padding: 1rem;
        
        @media print {
            &:not(.s12):nth-child(odd):not(:last-child) {
                page-break-after: always;
            }
        }

        &.s4 {
            width: 33.3333%;
            
            @media print {
                width: calc(50% - 2rem) !important;
            }
        }

        &.s8 {
            width: 66.6667%;
            
            @media print {
                width: calc(50% - 2rem) !important;
            }
        }

        &.s12 {
            width: 100%;

            @media print {
                width: calc(100% - 4rem) !important;
            }
        }

        &.min-width {
            @media only screen and (max-width: 1441px) {
                min-width: 50%;
            }
        }

        &.data-wrapper {
            flex: 0 1 auto;

            > .data-table {
                display: table;
                table-layout: fixed;
                border-radius: 1.75rem;
                border: 1px solid #E4B200;
                background: #3F3F3F;
                width: calc(100% - 2px); // 2px = border
                height: calc(100% - 2px); // 2px = border
                background: rgba(217, 217, 217, 0.13);
                overflow: hidden;

                > .data-table-body {
                    display: table-row-group;

                    > .data-table-row {
                        display: table-row;

                        &:first-child {
                            > .data-table-cell {
                                font-size: 1.25rem;
                                font-weight: 600;
                                color: var(--primary-color);
                            }
                        }
                        &:not(:last-child) {
                            > .data-table-cell {
                                border-bottom: 1px solid rgba(255, 255, 255, 0.29);
                            }
                        }

                        > .data-table-cell {
                            display: table-cell;
                            padding: 1rem 1.5rem;

                            &:not(:last-child) {
                                border-right: 1px solid rgba(255, 255, 255, 0.29);
                            }
                        }
                    }
                }
            }
        }
        
        > .col-item {
            padding: 1rem;
            border-radius: 1.75rem;
            border: 1px solid #E4B200;
            background: #3F3F3F;

            width: calc(100% - 2px); // 2px = border
            height: calc(100% - 2px); // 2px = border

            display: flex;
            flex-direction: row;
            
            @media print {
                background-color: #fff;
            }

            &.column {
                flex-direction: column;
            }

            &.justify-center {
                justify-content: center;
            }

            &.align-center {
                align-items: center;
            }

            &.align-start {
                align-items: flex-start;
            }

            > .align-center-me {
                align-self: center;
            }
            
            > .margin-left-auto {
                margin-left: auto;
            }

            > .align-start-me {
                align-self: flex-start;
            }

            > .header {
                flex-shrink: 0;
                border-radius: 0.75rem;
                border: 1px solid #E4B200;
                background: #E4B200;
                color: #2C2C2C;
                text-align: center;
                font-weight: 600;
                font-size: 1.25rem;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0.25rem 1rem;
                margin-bottom: 1.25rem;
            }

            > .headline {
                color: #E4B200;
                font-size: 2rem;
                font-weight: 600;
            }

            > .listItem {
                border-bottom: 1px solid #E4B200;
                align-self: stretch;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                font-size: 1rem;
                padding: 0.25rem;
            }

            > .globalscore-left {
                padding-right: 2rem;

                > .headline {
                    color: #E4B200;
                    font-size: 2rem;
                    font-weight: 600;
                }
            }

            > .recommendation {
                margin-top: 0.5rem;

                > p {
                    margin: 0;
                }

                > .header {
                    font-size: 1.25rem;
                    padding: 0.25rem 0;
                    border-bottom: 1px solid #E4B200;
                    margin-bottom: 0.75rem;
                }

                > .text {
                    line-height: 1.5rem;
                }
            }

            > .bottom {
                display: grid;
                grid-auto-flow: column;
                align-self: stretch;
                align-items: center;
                margin-top: auto;
                padding-top: 1rem;

                > div {
                    cursor: pointer;
                    user-select: none;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                }

                > .checker {
                    justify-self: start;

                    > span {
                        padding-left: 0.5rem;
                    }

                    > svg {
                        width: 2.5rem;
                        fill: #3F3F3F;

                        > :deep(circle) {
                            stroke: #E4B200;
                        }

                        > :deep(path) {
                            fill: #3F3F3F;
                        }
                    }
                }

                > .navigation {
                    justify-self: end;

                    > span {
                        padding-right: 0.5rem;
                    }

                    > svg {
                        width: 2.5rem;
                    }
                }
            }

            > :deep(.report-data) {
                display: grid;
                grid-auto-flow: column;
                align-items: center;
                justify-content: space-between;

                &.justify-space-around {
                    justify-content: space-around;
                }
                &.justify-normal {
                    justify-content: normal;
                }

                > .cliches-list {
                    display: flex;
                    flex-direction: column;

                    > .cliches-list-item {
                        display: flex;
                        flex-direction: column;
                        flex: 1 1 auto;
                        user-select: none;
                        //border-bottom: 1px solid var(--primary-500);

                        > .header-wrapper {
                            flex: 1 1 auto;
                            padding-bottom: 0.5rem;
                            margin-top: 1rem;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            border-bottom: 1px solid var(--primary-500);
                            justify-content: space-between;

                            @media print {
                                > div {
                                    color: #000 !important;
                                }
                            }
                            
                            > div {
                                color: #FFF;
                                font-family: var(--font-family);
                                font-size: 2rem;
                                font-weight: 600;
                                display: flex;
                                flex-direction: row;
                                margin-right: 1rem;

                                > .header {
                                    margin-left: 1rem;
                                }

                                > .amount {
                                    margin-right: 1rem;
                                    color: var(--primary-color);
                                }

                                > .children-button {
                                    cursor: pointer;
                                    border: 1px solid var(--primary-color);
                                    color: var(--primary-color);
                                    border-radius: 50%;
                                    width: 40px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                }
                            }
                        }

                        > .child-container {
                            padding: 1rem 5rem;
                            border-bottom: 1px solid var(--primary-500);

                            > .similarity-item {
                                flex: 1 1 auto;
                                display: flex;
                                flex-direction: row;
                                justify-content: space-between;
                                align-items: center;

                                &:not(:last-child) {
                                    margin-bottom: 2rem;
                                }

                                > .left {

                                    display: flex;
                                    flex-direction: row;
                                    flex: 1 1 auto;
                                    justify-content: space-between;
                                    align-items: flex-start;
                                    font-family: var(--font-family);
                                    // This is to make sure the items is center aligned
                                    // This sould be the same as font-size!
                                    $font-size: 1.5rem;
                                    margin-top: -$font-size;
                                    font-size: $font-size;

                                    > div {
                                        flex: 1 1 auto;
                                        border-bottom: 1px solid var(--primary-color);
                                    }

                                    > .left-left {
                                        text-align: left;
                                    }
                                    > .left-right {
                                        text-align: right;
                                        padding-right: 1rem;
                                        color: var(--primary-color);
                                    }
                                }
                            }
                        }
                    }
                }

                > .semantic-fields-container {
                    border-radius: 1.25rem;
                    border: 1px solid #E4B200;
                    background: rgba(217, 217, 217, 0.13);
                    padding: 1.25rem;
                    width: 100%;

                    //display: flex;
                    //flex-direction: row;
                    
                    @media print {
                        align-content: stretch;
                        align-items: stretch;
                    }

                    > .left {
                        flex-direction: column;
                        flex-grow: 1;
                        padding: 2.5rem 0.5rem 0.5rem 0.5rem;
                        max-width: 70%; // This is bad solution to fix this, but need way more time to find the better solution.

                        @media print {
                            max-width: 100%;
                            flex: 1 1 auto;
                            padding: 0.5rem;
                        }
                    }

                    > .right {
                        margin-left: auto;

                        @media print {
                            display: none !important;
                        }
                        
                        &.data-table {
                            border-left: 1px solid rgba(255, 255, 255, 0.29);
                            display: table;
                            table-layout: fixed;
                            //margin: 21px;
                            overflow: hidden;
                            width: 100%;

                            > .data-table-body {
                                display: table-row-group;

                                > .data-table-row {
                                    display: table-row;

                                    &:not(:last-child) {
                                        > .data-table-cell {
                                            border-bottom: 1px solid rgba(255, 255, 255, 0.29);
                                        }
                                    }
                                    &.primary {
                                        color: var(--primary-color);
                                    }

                                    > .data-table-cell {
                                        display: table-cell;
                                        padding: 0.25rem 0.5rem;
                                        vertical-align: middle;
                                        font-size: 0.75rem;

                                        &:not(:last-child) {
                                            padding-right: 5rem;
                                            border-right: 1px solid rgba(255, 255, 255, 0.29);
                                        }

                                        > .cell-flex {
                                            display: flex;
                                            align-content: center;
                                            align-items: center;
                                            flex-wrap: wrap;
                                            justify-content: flex-start;

                                            > div:last-child {
                                                margin-left: 1rem;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                > .scenes-wrapper {
                    flex: 0 1 auto;
                    border-radius: 0.6rem;
                    border: 1px solid #E4B200;
                    background: rgba(217, 217, 217, 0.13);


                    > .data-table {
                        display: table;
                        table-layout: fixed;
                        padding: 0.5rem;
                        width: 100%;

                        > .data-table-body {
                            display: table-row-group;

                            > .data-table-row {
                                display: table-row;

                                > .data-table-cell {
                                    display: table-cell;
                                    padding: 0.25rem 0.5rem;
                                    font-size: 0.75rem;
                                    line-height: 1.5rem;

                                    &:first-child {
                                        border-right: 1px solid rgba(255, 255, 255, 0.29);

                                        > .scene {
                                            display: flex;
                                            align-items: center;
                                            gap: 1rem;
                                        }
                                    }
                                    &:last-child {
                                        text-align: right;
                                    }
                                }
                            }
                        }
                    }
                }

                > .character-wrapper {
                    flex: 0 1 auto;
                    border-radius: 0.6rem;
                    border: 1px solid #E4B200;
                    background: rgba(217, 217, 217, 0.13);


                    > .data-table {
                        display: table;
                        table-layout: fixed;
                        padding: 0.5rem;
                        width: 100%;

                        > .data-table-body {
                            display: table-row-group;

                            > .data-table-row {
                                display: table-row;

                                > .data-table-cell {
                                    display: table-cell;
                                    padding: 0.25rem 0.5rem;
                                    font-size: 0.75rem;
                                    line-height: 1.5rem;

                                    &:first-child {
                                        border-right: 1px solid rgba(255, 255, 255, 0.29);

                                        > .character {
                                            display: flex;
                                            align-items: center;
                                            gap: 1rem;
                                        }
                                    }
                                    &:last-child {
                                        text-align: right;
                                    }
                                }
                            }
                        }
                    }
                }

                > .header {
                    color: #E4B200;
                    font-size: 2rem;
                    font-weight: 600;
                }

                > .score {
                    justify-self: end;

                    &.subheader {
                        font-size: 1.5rem;
                        font-weight: 600;
                        &.pill-score {
                            height: 3.5rem;
                            border-radius: 4rem;
                            border: 0.646px solid;
                            background: #5B5B5B;
                            border-color: var(--RAG-A-border);
                            padding-inline: 1.5rem;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            margin-top: 1rem;

                            @media print {
                                background-color: #fff !important;
                            }
                        }
                    }

                    &.circle {
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        &.row {
                            flex-direction: row;
                        }

                        > .subline {
                            font-size: 1rem;
                            padding: 0.5rem 0;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
}

</style>
