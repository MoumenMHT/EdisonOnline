<script setup lang="ts">
import { computed } from 'vue';

export interface Props {
    // This is 0-100
    percentage: number,
    backgroundFill?: string,
    progressFill?: string,
    size?: string,
    clockwise?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
    percentage: 0,
    backgroundFill: '#3F3F3F',
    progressFill: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
    size: '277px',
    clockwise: false,
});

// This makes the progress go counter clockwise
const transform = computed(() => {
    if (props.clockwise) {
        return `rotate(-90)`;
    }
    return `translate(0,0) scale(-1, 1) rotate(-90)`;
});


const viewBoxSize = 277;
const strokeWidth = 48;
const cx = viewBoxSize / 2;
const cy = viewBoxSize / 2;
const radius = (viewBoxSize / 2) - (strokeWidth / 2);

// circumference = 2 × π × radius
const strokeDasharray = 2 * Math.PI * radius;
// offset = circumference × ((100 - progress)/100)
const strokeDashoffset = computed(() => strokeDasharray * ((100 - props.percentage)/100));

// TODO - Make this work later. This is the start of making it possible to control the size of the circle.
// const innerRadius = radius - strokeWidth / 2;
// const circumference = radius * 2 * Math.PI;
// const arc = circumference * (270 / 360);
// const dashArray = `${arc} ${circumference}`;
// const transform2 = `rotate(135)`;

</script>

<template>
    <svg
        :width="size"
        :height="size"
        :viewBox="`0 0 ${viewBoxSize} ${viewBoxSize}`"
    >
        <circle 
            class="bg" 
            :cx="cx"
            :cy="cy"
            :r="radius"
            :stroke-width="strokeWidth"
            fill="none"
            :stroke="backgroundFill"
        />
        <circle 
            class="progress"
            :cx="cx"
            :cy="cy"
            :r="radius"
            :stroke-width="strokeWidth"
            fill="none"
            :stroke="progressFill"
            :stroke-dasharray="strokeDasharray"
            :stroke-dashoffset="strokeDashoffset"
            :transform="transform"
            style="transform-origin: center;"
        />
        <text 
            x="50%" 
            y="55%"
            fill="#ffffff"
            text-anchor="middle"
            font-family="Kadwa, serif"
            font-size="46"
            font-style="normal"
            font-weight="700"
        >
            {{ percentage }}%
        </text>
    </svg>
</template>

<style scoped lang="scss">
</style>