<script setup lang="ts">
import circleInfo from '@asset/icons/circleInfo.svg';
import Dialog from 'primevue/dialog';
import { Ref, ref } from 'vue';
import { ReportService } from '@service/report.service.ts';
import { ReportInfo } from '@interface/Report.ts';
import { RecommendationService } from '@service/recommendation.service.ts';

interface Information extends ReportInfo {
    dialogVisible: Ref<boolean>;
}

const props = defineProps<{
    reportId: number,
}>();

const informations = ref<Information[]>([]);

ReportService.getReportInfo(props.reportId).then((infos) => {
    const data = infos.data;
    if (data.value !== null) {
        for (const info of data.value) {
            informations.value.push({
                ...info,
                dialogVisible: false,
            });
        }
    }
});
</script>

<template>
    <div class="information-wrapper noPrint">
        <div class="information" v-for="info in informations">
            <div class="information-button" @click="info.dialogVisible = true">
                <p class="button-text">{{ info.label }}</p>
                <circleInfo class="button-icon"/>
            </div>
            <Dialog v-model:visible="info.dialogVisible" dismissableMask modal :header="info.label" :style="{ width: '50vw' }">
                <p>
                    {{ RecommendationService.convertVariablesToText(info.text) }}
                </p>
            </Dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
.information-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0;
    
    .information {
        > .information-button {
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-size: 1.25rem;
            font-weight: 700;
            border-radius: 1rem;
            background: #E4B200;
            color: #000000;
            gap: 1rem;
            padding-left: 1rem;

            > .button-text {
                margin: 0;
            }

            > .button-icon {
                background: #5B5B5B;
                padding: 0.40rem 0.65rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                border-radius: 1rem;
                width: 3.6rem;
                height: 3.3rem;
                fill: var(--primary-color);

                > :deep(path) {
                    fill: #2C2C2C;
                }
            }
        }
    }
}
</style>