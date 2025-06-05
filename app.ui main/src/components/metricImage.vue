<script setup lang="ts">
import { computed } from 'vue';
import colorLib from '@kurkle/color';
import { getAudienceImage } from '@util/audienceImage.ts';
import { getGenreImage } from '@util/genreImage.ts';
import { getArchetypeImage } from '@util/archetypeImage.ts';

export interface Props {
    metric: string,
    class: string,
    size?: string,
    procent?: number,
    borderColor?: string,
    circleFill?: string,
    showProcentText?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
    size: '8.5rem',
    procent: 0,
    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
    circleFill: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
    showProcentText: false,
});

const image = computed(() => {
    switch (props.metric.toLowerCase()) {
        case 'genre':
            return getGenreImage(props.class);
        case 'audience':
            return getAudienceImage(props.class);
        case 'archetype':
            return getArchetypeImage(props.class);
    }
});


const circles = computed(() => ({
    value: props.procent.toString() + '%',
    rest: (100 - props.procent).toString() + '%',
}));
const mecticContentProcent = computed(() => `"${Math.round(props.procent)}%"`);

const circleFillColor = computed(() => colorLib(props.circleFill).alpha(0.8).rgbString());

</script>

<template>
    <div class="circle-wrapper">
        <div class="image-wrapper"
             v-bind:class="{ 'showCircle':props.procent > 0, 'showProcent':props.showProcentText, }">
            <img :alt="metric + ' image'" :src="image"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
.circle-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;

    > .image-wrapper {
        width: v-bind('size');
        height: v-bind('size');
        flex-shrink: 0;
        overflow: hidden;
        border: 1px solid v-bind('borderColor');
        border-radius: 9.15625rem;
        position: relative;

        > img {
            width: 100%;
            height: 100%;
        }

        &.showCircle {
            &:after {
                content: "";
                position: absolute;
                top: 0.5rem;
                left: 0.5rem;
                display: block;
                width: calc(100% - 1rem);
                height: calc(100% - 1rem);
                border-radius: 50%;
                background: conic-gradient(
                        v-bind('circleFillColor') v-bind('circles.value'),
                        transparent v-bind('circles.value') v-bind('circles.rest')
                );
            }

            &.showProcent {
                &:after {
                    content: v-bind('mecticContentProcent');
                    display: flex;
                    align-content: center;
                    justify-content: center;
                    align-items: center;
                    color: #000;
                    font-size: 1.5rem;
                    text-shadow: #FFF 2px 0 1px, #FFF 0 2px 1px, #FFF -2px 0 1px, #FFF 0 -2px 1px;
                }
            }
        }
    }
}
</style>