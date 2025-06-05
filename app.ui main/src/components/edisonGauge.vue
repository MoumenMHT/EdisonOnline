<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    value: number,
    backgroundFill?: string,
    progressFill?: string,
}

const props = withDefaults(defineProps<Props>(), {
    value: 0,
    backgroundFill: '#5B5B5B',
    progressFill: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
});

const getVal = () => {
    if (isNaN(props.value)) {
        return 0;
    }
    if (props.value > 1) {
        return 1;
    }
    return props.value;
}

const percentage = computed(() => {
    return `${(getVal() * 100).toFixed(0)}%`;
})
const rotation = computed(() => {
    return `rotate(${(180 * getVal())} 150 150)`;
})

</script>

<template>
    <svg viewBox="0 0 300 150">
        <defs>
            <mask id="donut">
                <path d="M 0 150
                   A 45 45, 0, 0, 1, 300 150
                   L 255 150
                   A 45 45, 0, 0, 0, 45, 150
                   L 0 150" fill="white"
                />
            </mask>
        </defs>

        <path d="M 0 150
            A 45 45, 0, 0, 1, 300 150
            L 255 150
            A 45 45, 0, 0, 0, 45, 150
            L 0 150" :fill="backgroundFill" 
        />

        <g mask="url(#donut)">
            <rect x="0" y="150"
                  height="150" width="300"
                  :fill="progressFill"
                  :transform="rotation" 
            />
        </g>

        <text 
            class="rate" 
            x="150" 
            y="125" 
            text-anchor="middle"
        >
            {{ percentage }}
        </text>
    </svg>
</template>

<style scoped lang="scss">
svg { 
    text {
        font-family: var(--font-family);
        fill: #ffffff;

        &.rate {
            color: #FFF;
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
        }
    }
}
</style>