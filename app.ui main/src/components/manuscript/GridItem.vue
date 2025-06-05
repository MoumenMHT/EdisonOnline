<script setup lang="ts">
import { Manuscript } from '@interface/Manuscript.ts';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import { navigate, getTagInfo } from '@util/manuscriptItemsHelper.ts';
import { computed } from "vue";
import NumberBall from "@component/numberBall.vue";

const props = defineProps<{
    data: Manuscript;
    isAdmin?: boolean;
}>();

const progress = computed(() => {
    return Math.round(props.data.progress.modelsDone / props.data.progress.modelsTotal * 100);
})
</script>

<template>
    <div class="xl:col-4 lg:col-6 md:col-12 sm:col-12 p-2">
        <div
            class="p-4 flex flex-column justify-content-between h-full border-1 surface-border surface-card manuscript-card cursor-pointer"
            v-on:click="navigate(data.id, isAdmin)"
            style="min-height: 400px">
            <div class="flex flex-row justify-content-between gap-2 pb-2 headline-box">
                <div class="flex flex-row gap-3 flex-shrink-1 flex-grow-1 min-w-0">
                    <span class="flex align-items-center gap-2 parent-ellipsis">
                        <i class="pi pi-tag text-lg"></i>
                        <span class="text-lg">{{ data.genre }}</span>
                    </span>
                    <span class="flex align-items-center gap-2 parent-ellipsis flex-shrink-0">
                        <i class="pi pi-users text-lg"></i>
                        <span class="text-lg">{{ data.audience }}</span>
                    </span>
                </div>
                <div>
                    <Tag :value="getTagInfo(data)"
                         :severity="getTagInfo(data, 'severity')"
                         class="status-tag"
                    ></Tag>
                </div>
            </div>
            <div class="flex flex-column align-items-center gap-1 py-3">
                <div class="text-4xl font-bold text-primary">
                    {{ data.title }}
                </div>
                <p class="text-sm my-0 text-gray-200" v-if="isAdmin">Uploadet af: {{ data.author.name }}</p>
            </div>
            <div class="flex align-items-center justify-content-center flex-column mb-3"
                 v-if="!data.progress.globalScore">
                <h3 class="score-text">
                    Analyseret
                </h3>
                <ProgressBar style="height: 1rem; width: 12rem" :value="progress" />
            </div>
            <div v-else class="flex align-items-center flex-column">
                <h3 class="justify-content-center score-text m-0 my-3">
                    Global Score
                </h3>
                <number-ball :value="data.progress.userScore" size="5.5rem" font-color="black" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.score-text {
    font-family: Inter,serif;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.headline-box {
    border-bottom: 1px solid var(--surface-border);
    line-height: 1.5;
}

.manuscript-card {
    border-radius: 2rem;
    font-family: Kadwa,serif;
}

.status-tag {
    width: 5rem;
    height: 2rem;
    border-radius: 1.375rem;
}

.parent-ellipsis {
    display: flex; /* flex is already here, but it's better to keep in mind */
    min-width: 0; /* override the default of 'auto' for flex items, which allows it to shrink below content size */

    .text-lg {
        flex-grow: 1; /* makes the text span grow to occupy the maximum width possible */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

</style>
