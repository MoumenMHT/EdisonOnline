<script setup lang="ts">
import { RecommendationService } from '@service/recommendation.service.ts';
import { useMainStore } from '@store/main.ts';
import { IWhatIsResponse } from '@interface/Recommendation.ts';

const props = defineProps<{
    reportId: number
}>();

const store = useMainStore();
const reportWhatIs: IWhatIsResponse = store.getWhatIs(props.reportId);
</script>

<template>
    <div>
        <div class="headline">{{ reportWhatIs.head }}</div>
        <div class="textbox">
            {{ RecommendationService.convertVariablesToText(reportWhatIs.text) }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.headline {
    color: #E4B200;
    font-family: var(--font-family);
    font-size: 2rem;
    font-weight: 700;

    &.center-text {
        text-align: center;
    }
}

.textbox {
    padding: 0.5rem;
    border-radius: 0.6rem;
    border: 1px solid #E4B200;
    background: rgba(217, 217, 217, 0.13);
    max-width: 50rem;

    @media print {
        background-color: #fff;
    }
    
    &.large-text {
        font-size: 2rem;

        > p {
            font-size: 3.5rem;
        }
    }

    &.center-text {
        text-align: center;
    }

    > p {
        color: #E4B200;
        margin: 0.5rem 0;
        font-family: var(--font-family);
        font-weight: 700;
    }
}
</style>