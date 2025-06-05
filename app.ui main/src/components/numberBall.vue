<script setup lang="ts">

import { computed } from 'vue';

export interface Props {
    value: number | string,
    size?: string,
    font?: string,
    fontSize?: 'XXS' | 'XS' | 'S' | 'M' | 'L',
    background?: string,
    fontColor?: string,
}

const props = withDefaults(defineProps<Props>(), {
    value: 0,
    size: '2.7rem',
    font:  'Inter',
    fontSize: 'L',
    background: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
    fontColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
});

const fontSizeCal = computed(() => {
    switch (props.fontSize) {
        case 'XXS':
            return 0.1;
        case 'XS':
            return 0.2;
        case 'S':
            return 0.25;
        case 'M':
            return 0.35;
        case 'L':
            return 0.5;
        default:
            return 0.5;
    }
})
</script>

<template>
    <div class="numberBall">
        <span>{{ props.value }}</span>
    </div>
</template>

<style scoped lang="scss">
.numberBall {
    background: v-bind(background);
    color: v-bind(fontColor);
    width: v-bind(size);
    min-width: v-bind(size);
    height: v-bind(size);
    min-height: v-bind(size);
    border-radius: 50%;
    font-size: calc(v-bind(size) * v-bind(fontSizeCal));
    text-align: center;

    font-family: v-bind(font), serif;
    font-style: normal;
    font-weight: 700;

    display: flex;
    align-items: center;
    justify-content: center;
}
</style>