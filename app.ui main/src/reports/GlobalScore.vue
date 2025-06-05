<script setup lang="ts">
import { ref } from "vue";
import { ManuscriptRevision } from "@interface/Manuscript.ts";
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import { IGlobalAnalyzedContent } from "@interface/Models.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";
import { getModelData } from "@util/ReportHelper.ts";
import { translateGlobalScoreLabels } from "@util/translate.ts";

const hiddenValues = ['score'];

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()

const globalUserData = getModelData<IGlobalAnalyzedContent>(props.modelData, ModelResultDataModelEnum.GlobalUser);
const valid = ref(true);
const data = ref<IGlobalAnalyzedContent>();
const chartLabelsSet: string[] = [];

if (globalUserData === undefined) {
    valid.value = false;
}
else {
    data.value = globalUserData.content;

    try {
        for (const ref in data.value) {
            const val = data.value[ref];
            if (val !== 0 && !hiddenValues.includes(ref)) {
                chartLabelsSet.push(ref);
            }
        }
    } catch (e) {
        valid.value = false;
        console.error('Unhandled error:', e);
    }
}
</script>

<template>
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">
                Global score
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <div v-if="data !== undefined">
                <ModelErrorMessage />
            </div>
            <div v-else>
                Du har ikke adgang til denne model.
            </div>
        </div>
        <div v-if="valid && data !== undefined" class="grid grid-nogutter w-full col-12">
            <div class="col-6 flex">
                <div class="globalScoreBall">{{ data.score }}</div>
            </div>
            <div class="col-6 p-2">
                <div class="mb-2">
                        <span class="font-semibold text-lg">Du har fået en score på {{
                                data.score
                            }} ud af 100.</span><br>
                    Ved sammenligning af bøger inden for samme genre
                    <!--                    Scoren for bestseller bøger i samme genre er {ref til GS for genre}-->
                </div>
                <div>
                    <ul class="list-none pl-0 mt-0">
                        <li v-for="label in chartLabelsSet">{{ translateGlobalScoreLabels(label) }}: {{ data[label] }}</li>
                    </ul>
                    Din Global Score er beregnet ud fra xx og yy. De er ikke nødvendigvis det
                    bedste at stræbe efter en score på 100, men du kan bruge scoren til at
                    sammenligne dit manuskript med lignende bøger,. For at forbedre din
                    score kan du arbejde med de områder, hvor Edison har identificeret
                    forbedringsmuligheder. Når du er klar, kan du lade Edison analysere dit
                    manuskript igen for at se om din score er blevet forbedret.
                </div>
                <div class="mt-auto pt-3 flex align-content-end flex-wrap">
                    <span
                        class="font-semibold text-lg">Edison har fundet elementer i dit manuskript, der kan forbedres:</span>
                    Klik på linke'sene neden under<br><br>
                    <!--                    {Punkter der kan forbedres, de punkter der ikke er 0}<br>-->
                    &lt;Links til de specifikke rapporter&gt;
                </div>
            </div>
        </div>
        <div class="col-12 grid grid-nogutter surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvad er en Global score?</span>
            En global score er en samlet score for dit manuskript på mellem 0 og 100. Scoren udregnes ud fra rigtig
            mange variable i Edisons samlede analyse af manuskriptet. En lavere score betyder som udgangspunkt ikke, at
            manuskriptet ikke er af god kvalitet, men derimod, at der er et eller flere områder, hvor Edisons analyse har
            identificeret områder, hvor der i forhold til genre og målgruppe er mulighed for at optimere dit manuskript.
            Ved at arbejde med disse områder, kan du virkelig gøre en forskel for dine læseres oplevelse af bogen.
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke i nu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.globalScoreBall {
    // Change this variable to change the size of the ball
    $BallSize: 15rem;

    margin: auto;
    background: var(--primary-500);
    color: var(--primary-color-text);
    width: $BallSize;
    height: $BallSize;
    line-height: $BallSize;
    border-radius: 50%;
    font-size: $BallSize * 0.5;
    text-align: center;
}
</style>
