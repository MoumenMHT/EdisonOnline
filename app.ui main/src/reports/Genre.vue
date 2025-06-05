<script setup lang="ts">
import { ref } from "vue";
import { IGenreClassificationGlobal } from "@interface/Models.ts";
import logo from '@asset/icons/logo.svg';
import { ManuscriptRevision } from "@interface/Manuscript.ts";
import { useMainStore } from "@store/main.ts";
import { percentFormatter } from '@util/numberHelper.ts';
import { ModelResultData, ModelResultDataModelEnum } from "@interface/Model.ts";
import ModelErrorMessage from "@component/modelErrorMessage.vue";

const props = defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()
const store = useMainStore();
const manuscriptRevisionData: ManuscriptRevision = props.manuscriptRevisionData;
const data = ref<IGenreClassificationGlobal[]>(
    props.modelData.find(x => x.model === ModelResultDataModelEnum.GenreClassification && x.section === 'global')?.content
        .sort((a,b) => b.score - a.score)
);

const topGenre = ref<IGenreClassificationGlobal>({
    class: '',
    score: 0
});
const limitedData: IGenreClassificationGlobal[] = [];
const valid = ref(true);

try {
    topGenre.value = data.value[0];
    const limit = (topGenre.value.score / data.value[1].score >= 1.2 || topGenre.value.score * 100 >= 50) ? 1 : 2;

    let i = 0;
    while (i < limit) {
        limitedData.push(data.value[i]);
        i++;
    }
} catch (e) {
    valid.value = false;
    console.error('Unhandled error:', e);
}
const match = () => {
    if (manuscriptRevisionData.genre === topGenre.value.class) {
        return store.recommendationRules.genreMatch.match;
    }
    else {
        return store.recommendationRules.genreMatch.noMatch;
    }
}

</script>

<template>
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 border-bottom-2 surface-border mb-3 pb-3">
            <div class="text-4xl text-headline font-bold text-white bg-primary inline-block p-1 px-2 border-round">Genre</div>
        </div>
        <div v-if="!valid" class="col-12">
            <ModelErrorMessage />
        </div>
        <div v-if="valid" class="grid grid-nogutter w-full col-12">
            <div class="col-6 flex flex-column gap-2 align-items-center">
                <logo style="height: 25rem; fill: var(--primary-500)" />
                <span class="font-semibold text-lg text-red-500">Billede mangler</span>
            </div>
            <div class="col-6 flex flex-column gap-2 pl-2">
                <div class="p-2 w-full">
                    <span class="font-semibold text-lg">Edison har analyseret dit manuskript og har vurderet, at din(e) primære genre(r) er</span>
                    <ul class="list-none pl-0 mt-0 pt-2">
                        <li v-for="genre in limitedData">
                            <span class="font-semibold text-lg">{{genre.class}}:</span> {{percentFormatter.format(genre.score)}}
                        </li>
                    </ul>
                </div>
                <div class="p-2 w-full mt-auto">
                    <div class="pb-4">
                        <span class="font-semibold text-lg">Edison har analyseret dit manuskript.</span><br>
                        {{ match() }}<br>
                        Du har angivet at dit manuskript er en '{{ manuscriptRevisionData.genre }}', ifølge analysen er det en '{{topGenre.class}}', med en sikkerhed på {{percentFormatter.format(topGenre.score)}}
                    </div>
                    <div>Læs mere om genres: -> &lt;link til skrive værksted&gt;</div>
                </div>
            </div>
        </div>
        <div class="col-12 grid grid-nogutter surface-section p-3 mt-2 border-round">
            <span class="font-semibold text-lg">Hvilken genre er din bog?</span>
            Genreopdelingen etablerer en slags kodeks, der er baseret på almindeligt accepterede standarder, og som man
            som forfattere kan følge. Følger man disse standarder, sender man ofte et signal til en bestemt læsergruppe
            om at her er en bog i deres yndlingsgenre. Det kan både være en fordel, idet nogle læsere vil vælge bogen
            til alene på grund af dens genre, og en ulempe, idet andre vil vælge den fra af samme grund. Men det er
            også helt ok, at udfordre genrekonventionerne og skabe værker,
            der trodser dem; for eksempel bliver Truman Capotes klassiker
            In Cold Blood ofte klassificeret som en nonfiktionsroman og
            spænder dermed over to genrer. Edison er trænet efter
            genrestandardardene, som dog heller ikke er helt sorte og hvide.
            Derfor vil det ikke være ualmindeligt at få et resultat, der spænder
            over flere genrer.<br>
            Man kan sige, at de enkelte genrer har hver deres formål: Fiktion
            og poesi sætter gang i læserens fantasi, underholder og
            opmuntrer til at se verden gennem andre briller. Faglitteratur er
            primært oplysende, introducerer læseren til emner og ideer og
            deler værdifuld indsigt. Drama er underholdende og får læserne
            til at tænke over dynamikken i mellemmenneskelige relationer,
            den menneskelige naturs svagheder og de punkter i fællesskabet,
            vi alle deler, såvel som de områder, der adskiller os.
            Ved at angive at man skriver i en bestemt genre, sætter man også
            læserens forventninger.
            <br>
            <div>
                Vil du læse mere, kan du gøre det lige her (popup)<br>
                <span class="font-italic">Link virker ikke i nu</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
