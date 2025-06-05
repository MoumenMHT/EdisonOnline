<script setup lang="ts">
import { RecommendationService } from '@service/recommendation.service.ts';
import { ref, watch } from 'vue';
import numberBall from '@component/numberBall.vue';
import { ITipsResponse } from '@interface/Recommendation.ts';

const props = defineProps<{
    reportId: number
}>();

const tipsRequest = RecommendationService.getTips(props.reportId);
const reportTips = ref<ITipsResponse[]>([]);

watch(tipsRequest.data, (value) => {
    if (value) {
        value.forEach((tip: ITipsResponse) => {
            reportTips.value.push(tip);
        });
    }
});

</script>

<template>
    <div class="tips-container" v-if="reportTips.length > 0">
        <h1 class="headine">
            Litterære Tips
        </h1>
        <div class="tips-wrapper">
            <div class="tips-wrapper-items">
                <div v-for="(tip, index) in reportTips" class="tip-item">
                    <numberBall :value="index + 1" size="2.7rem" font="Kadwa" font-color="#2C2C2C"/>
                    <span class="tiptext">
                        {{ RecommendationService.convertVariablesToText(tip.text) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@media print {
    .tips-container {
        padding: 2rem 2rem !important;

        > .tips-wrapper {
            display: flex;
            justify-content: center;

            > .tips-wrapper-items {
                gap: 1.5rem !important;

                > .tip-item {
                    gap: 1rem !important;
                }
            }
        }
    }
}

.tips-container {
    padding: 2rem 5rem;
    
    > .headine {
        display: flex;
        margin-top: 0;
        margin-bottom: 3rem;
        justify-content: center;
    }
    > .tips-wrapper {
        display: flex;
        justify-content: center;
        
        > .tips-wrapper-items {
            display: flex;
            flex-direction: column;
            gap: 3rem;
            
            > .tip-item {
                display: flex;
                align-items: center;
                gap: 1.5rem; 
            }
        }
    }
}

.tiptext {
    font-size: 1.375rem;
}

</style>