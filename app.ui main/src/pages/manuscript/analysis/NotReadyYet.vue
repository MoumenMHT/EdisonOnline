<script setup lang="ts">
import { ManuscriptRevision } from '@interface/Manuscript.ts';
import { ModelResultData } from '@interface/Model.ts';

defineProps<{
    isAdmin?: boolean,
    isSimilarBook?: boolean,
    isTrial?: boolean,
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>();
</script>

<template>
    Report er ikke klar i nu.
</template>

<style scoped lang="scss">

</style>