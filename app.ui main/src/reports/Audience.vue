<script setup lang="ts">
import { ref } from "vue";
import { IAudienceClassificationGlobal } from "@interface/Models.ts";
import { ManuscriptRevision } from "@interface/Manuscript.ts";
import logo from '@asset/icons/logo.svg';
import { useMainStore } from "@store/main.ts";
import { percentFormatter } from '@util/numberHelper.ts';
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import ModelErrorMessage from '@component/modelErrorMessage.vue';

const store = useMainStore();
const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>();
const manuscriptRevisionData: ManuscriptRevision = props.manuscriptRevisionData;
const data = ref<IAudienceClassificationGlobal[]>(
    props.modelData.find(x => x.model === ModelResultDataModelEnum.AudienceClassification && x.section === 'global')?.content
        .sort((a, b) => b.score - a.score)
);

const displayData: IAudienceClassificationGlobal[] = [];
const topAudience = ref<IAudienceClassificationGlobal>({
    class: '',
    score: 0
});
const valid = ref(true);

try {
    topAudience.value = data.value[0];
    const limit = (topAudience.value.score / data.value[1].score >= 1.2 || topAudience.value.score * 100 >= 50) ? 1 : 2;

    let i = 0;
    while (i < limit) {
        displayData.push(data.value[i])
        i++;
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
const match = () => {
    if (manuscriptRevisionData.audience === topAudience.value.class) {
        return store.recommendationRules.audienceMatch.match;
    }
    else {
        return store.recommendationRules.audienceMatch.noMatch;
    }
}
</script>

<template>
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">
                Målgruppe
            </div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage/>
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-6 flex flex-column gap-2 align-items-center">
                <logo style="height: 25rem; fill: var(--primary-500)"/>
                <span class="font-semibold text-lg text-red-500">Billede mangler</span>
            </div>
            <div class="col-6 flex flex-column gap-2 pl-2">
                <div class="p-2 w-full">
                <span
                    class="font-semibold text-lg">Edison har læst dit manuskript til at falde ind i disse målgrupper</span>
                    <ul class="list-none pl-0 mt-0 pt-2">
                        <li v-for="audience in displayData">
                            <span class="font-semibold text-lg">{{ audience.class }}:</span>
                            {{ percentFormatter.format(audience.score) }}
                        </li>
                    </ul>
                </div>
                <div class="p-2 w-full mt-auto">
                    <div class="pb-4">
                        <span class="font-semibold text-lg">Edison har analyseret dit manuskript.</span><br>
                        {{ match() }}<br>
                        Du har angivet at dit manuskript er en '{{ manuscriptRevisionData.audience }}', ifølge analysen er
                        det en '{{ topAudience.class }}', med en sikkerhed på
                        {{ percentFormatter.format(topAudience.score) }}
                    </div>
                    <div>Læs mere om genres: -> &lt;link til skrive værksted&gt;</div>
                </div>
            </div>
        </div>
        <div class="col-12 grid grid-nogutter surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvem skriver du til?</span>
            Det er utrolig vigtigt, at matche for eksempel dit manuskripts
            budskab, sprog, lix-tal, sætningslængde med mere til bogens
            målgruppe. Fejler du her, vil din målgruppe måske ikke forstå
            historien og lægge bogen fra sig. Når du er bevidst om din
            målgruppe, kan du tilpasse skrivestilen, sproget og indholdet, så det
            passer til målgruppens behov og forventninger. Hvis man ikke
            kender sin målgruppe, kan det resultere i at ens budskab ikke når
            frem til modtageren eller bliver misforstået.
            Når man kender sin målgruppe, kan man bedre tilpasse sig deres
            sprogbrug og kommunikationsstil, så man kan ramme dem på en
            måde, der er relevant for dem.<br>
            Kort sagt, er det at kende sin målgruppe essentielt for at skrive en
            vellykket tekst, der formidler sit budskab klart og præcist til de rette
            læsere.<br>
            Edison har matchet dit manuskript med den målgruppe, du har
            angivet, at det er skrevet til. Se resultatet nedenfor og find mere
            viden om hvordan, du kommer din målgruppe nærmere i
            Skriveværkstedet.
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke i nu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
