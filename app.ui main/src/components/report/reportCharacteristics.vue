<script setup lang="ts">
import checkmark from '@asset/icons/circleCheckmark.svg';
import { ref, watch } from 'vue';
import { RecommendationService } from '@service/recommendation.service.ts';
import { ICharacteristicsResponse } from '@interface/Recommendation.ts';

const props = defineProps<{
    reportId: number,
    genre?: string,
    audience?: string,
}>()

const reportCharacteristics = ref<ICharacteristicsResponse[]>([]);
const getMetric = () => {
    if (props.genre !== undefined) {
        return props.genre;
    }
    if (props.audience !== undefined) {
        return props.audience;
    }
    
    return '';
}
const characteristicsRequest = RecommendationService.getCharacteristics(props.reportId);
watch(characteristicsRequest.data, (value) => {
    if (value) {
        value.forEach((characteristic) => {
            if (characteristic.metric === getMetric() && characteristic.text !== 'NoText') {
                reportCharacteristics.value.push(characteristic);
            }
        });
    }
});
</script>

<template>
    <div class="characteristic-container">
        <h1 v-if="genre !== undefined">
            Vigtige kendetegn ved <span>{{ genre }}</span>
        </h1>
        <h1 v-if="audience !== undefined">
            Vigtige kendetegn om målgruppen <span>{{ audience }}</span>
        </h1>
        <div class="characteristic-list">
            <div v-for="characteristic in reportCharacteristics" class="characteristic">
                <checkmark />
                <span>
                    {{ characteristic.text }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@media print {
    .characteristic-list {
        flex-direction: column;
        gap: 1rem !important;
        
        > .characteristic {
            flex-direction: row !important;
            justify-content: stretch !important;
            text-align: left !important;
            width: 100% !important;

            > svg {
                max-width: 3.5rem;
                min-width: 3.5rem;
            }
        }
    }
}

.characteristic-container {
    padding-top: 2rem;
    padding-bottom: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    line-height: 1.5;
    
    > h1 {
        display: flex;
        margin: 0;
        justify-content: center;
        gap: 0.5rem;
        
        > span {
            color: var(--primary-color);
        }
    }
    
    > .characteristic-list {
        display: flex;
        gap: 4rem;
        margin: 3rem 0;
        justify-content: center;
        
        > .characteristic {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            text-align: center;
            width: 25%;
            
            > svg {
                fill: var(--primary-color); 
                width: 6.3rem;
            }
            
            > span {
                font-size: 1.75rem;
                font-weight: 700;
            }
        }
    }
}


</style>