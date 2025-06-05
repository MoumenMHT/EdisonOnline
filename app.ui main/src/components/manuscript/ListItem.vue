<script setup lang="ts">
import { Manuscript } from '@interface/Manuscript.ts';
import Tag from 'primevue/tag';
import { navigate, getTagInfo } from '@util/manuscriptItemsHelper.ts';
import ProgressBar from "primevue/progressbar";
import { computed } from "vue";

const props = defineProps<{
    data: Manuscript;
    isAdmin?: boolean;
}>();

const progress = computed(() => {
    return Math.round(props.data.progress.modelsDone / props.data.progress.modelsTotal * 100);
})
</script>

<template>
    <div class="col-12">
        <div class="flex flex-row align-items-start m-2 p-2 gap-4 border-1 surface-border surface-card border-round cursor-pointer"
             v-on:click="navigate(data.id, isAdmin)"
        >
            <div class="flex flex-row justify-content-between align-items-center flex-1 gap-4">
                <div class="flex flex-row align-items-center gap-6">
                    <div class="text-2xl font-bold text-primary">
                        {{ data.title }}
                        <p class="text-sm font-normal my-0 text-gray-200" v-if="isAdmin">Uploadet af: {{ data.author.name }}</p>
                    </div>

                    <div class="flex justify-content-center flex-row gap-3"
                         v-if="!data.progress.globalScore">
                        <h3 class="m-0">
                            Analyseret
                        </h3>
                        <ProgressBar style="height: 1rem; width: 12rem" :value="progress" />
                    </div>
                    <div v-else class="flex flex-column h-full">
                        <h3 class="justify-content-center m-0">
                            Global Score: {{ data.progress.globalScore }}
                        </h3>
                    </div>
                </div>
                <div class="flex flex-row gap-3">
                    <span class="flex align-items-center gap-2 ml-auto">
                        <i class="pi pi-tag"></i>
                        <span class="font-semibold">{{ data.genre }}</span>
                    </span>
                    <span class="flex align-items-center gap-2 ml-auto">
                        <i class="pi pi-users"></i>
                        <span class="font-semibold">{{ data.audience }}</span>
                    </span>
                    <Tag :value="getTagInfo(data)"
                         :severity="getTagInfo(data, 'severity')"
                         class="ml-auto"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
