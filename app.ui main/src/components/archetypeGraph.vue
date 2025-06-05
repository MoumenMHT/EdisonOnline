<script setup lang="ts">
import { h, VNode } from 'vue';

interface archetype {
    id: string,
    d: string;
}

export interface Props {
    archetype: string;
    size?: string;
    width?: string;
    height?: string;
    showRightLine?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    archetype: '',
    width: '60rem',
    height: '30rem',
    showRightLine: false,
});

const archetypesClasses: archetype[] = [
    {
        id: 'Rags_To_Riches',
        d: 'M -0.02795452,39.659302 158.79519,13.223448',
    },
    {
        id: 'Tragedy',
        d: 'M -0.04016487,39.707951 159.05821,66.244808',
    },
    {
        id: 'Icarus',
        d: 'M -0.0450449,39.378659 79.405111,13.198473 158.79138,39.741088',
    },
    {
        id: 'Man_In_A_Hole',
        d: 'M 0,39.679472 79.374909,66.147531 158.74982,39.684793',
    },
    {
        id: 'Cinderella',
        d: 'M 0,39.690116 52.917494,13.227378 105.84076,39.685581 158.74982,13.23536',
    },
    {
        id: 'Oedipus',
        d: 'M 0.00133045,39.690116 52.916666,66.147899 105.83127,39.6875 158.75935,66.147536',
    },
];
const generalizeString = (string: string): string => {
    return string.toLowerCase().replaceAll(' ','_').replace('ø','oe');
}
// This is done because we want the selected archetype at the bottom of the array due to render order of the SVG
const rebuiltArray = [
    ...archetypesClasses.filter(x => generalizeString(x.id) !== generalizeString(props.archetype)),
    ...archetypesClasses.filter(x => generalizeString(x.id) === generalizeString(props.archetype))
];

const archetypePaths: VNode[] = [];
for (const archetype of rebuiltArray) {
    const active = generalizeString(archetype.id) === generalizeString(props.archetype) ? 'active' : '';
    archetypePaths.push(h('path', { 
        d: archetype.d,
        id: archetype.id,
        class: active,
    }));
}


const archetypesRender = () => {
    return h('g', {
        id: 'archetype'
    }, [archetypePaths]);
};
</script>

<template>
    <svg
        :width="width"
        :height="height"
        viewBox="0 0 158.75 79.375"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M 0,39.6875 H 158.75"
            id="ZeroLine" 
        />
        <archetypesRender />
        <path
            d="M 0.26458335,79.375 V 0"
            id="LeftLine"
            class="lines"
        />
        <path
            d="M 0,79.110417 H 158.75"
            id="BottomLine"
            class="lines"
        />
        <path
            d="M 158.48542,79.375 V 0"
            id="RightLine"
            class="lines"
            v-bind:class="{
                'hidden': !showRightLine,
            }"
        />
    </svg>
</template>

<style scoped lang="scss">
svg {
    > #ZeroLine {
        fill:none;
        stroke:#ffffff;
        stroke-width:0.5;
        stroke-dasharray:0.75, 0.75;
        stroke-dashoffset:0;
        stroke-opacity:0.7;
    }
    > .lines {
        fill:none;
        stroke:#e4b200;
        stroke-width:0.5;
        stroke-dasharray:none;
        stroke-opacity:1;
    }
    > #archetype {
        > :deep(path) {
            fill:none;
            stroke:#ffffff;
            stroke-width:0.1;
            stroke-dasharray:none;
            stroke-dashoffset:0;
            stroke-opacity:1;

            &.active {
                stroke:#e4b200;
                stroke-width:0.5;
            }
        }
    }
}
</style>