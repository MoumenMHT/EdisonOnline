<script setup lang="ts">
// outcomment this line to get access to the props in the script part.
//const props = defineProps(['manuscriptRevisionData','modelData']);
import {ManuscriptRevision} from "@interface/Manuscript.ts";
import {ModelResultData} from "@interface/Model.ts";

defineProps<{
    manuscriptRevisionData: ManuscriptRevision,
    modelData: ModelResultData[]
}>()
</script>

<template>
    <div class="grid grid-nogutter w-full p-3">
        <div class="col-12 font-medium text-2xl pb-2">
            Karakter
        </div>
        <div class="col-6 flex flex-column gap-2">
            Left
        </div>
        <div class="col-6 flex flex-column gap-2 pl-2">
            Right
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
