<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    items: TopicWordListItem[];
    // Default is 3
    firstLimit?: number;
    // Default is 3
    stepCounter?: number;
}

const props = withDefaults(defineProps<Props>(), {
    items: props1 => props1.items || [] as TopicWordListItem[],
    firstLimit: 3,
    stepCounter: 3,
});
const childItemsLimit = ref(props.firstLimit ?? 3);
let childItemsLimitBeforePrint: number = childItemsLimit.value;
const capitalizeFirstLetter = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

try {
    // Resize chart before and after printing to make sure it fits printable area
    window.addEventListener('beforeprint', () => {
        childItemsLimitBeforePrint = childItemsLimit.value;
        // -1 will show all items.
        childItemsLimit.value = -1;
    });
    window.addEventListener('afterprint', () => {
        childItemsLimit.value = childItemsLimitBeforePrint;
    });
} catch (e) {
    console.error('Unhandled error:', e);
}
</script>

<template>
    <div class="infobox-wrapper" v-if="items.length > 0">
        <div class="infoboxes listmode" v-for="(item) in items">
            <div class="top no-border">
                <div class="button-style" :style="`background: ${item.color};`">{{ capitalizeFirstLetter(item.headline) }}</div>
            </div>
            <div class="bottom no-box list">
                <div
                    class="list-item"
                    :style="`border-color: ${item.color}`"
                    v-for="subItem in item.data.slice(0,childItemsLimit)"
                >
                    <div>{{ subItem.name }}</div>
                </div>
                <div class="list-item see-more-items" :style="`border-color: ${item.color}`">
                    <span
                        @click="childItemsLimit += stepCounter"
                        v-if="Object.keys(item.data).length > childItemsLimit"
                    >Se flere</span>
                    <span
                        @click="childItemsLimit -= stepCounter"
                        v-if="childItemsLimit > stepCounter"
                    >Se færre</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.infobox-wrapper {
    display: flex;
    flex-direction: row;
    align-content: stretch;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    margin: 1.5rem 0;

    > .infoboxes {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 13.1875rem;
        margin: 0 1rem;

        > .top {
            > .button-style {
                border-radius: 1rem;
                background: var(--primary-color);
                text-align: center;
                padding: 0.5rem;
                color: #2C2C2C;
                font-size: 1.25rem;
                font-weight: 700;
            }
        }

        > .bottom {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin-top: 1rem;

            > .list-item {
                font-size: 1.25rem;
                font-weight: 700;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                border-bottom: 1px solid var(--primary-color);
                line-height: 2rem;

                &.see-more-items {
                    justify-content: space-between;
                    color: var(--text-color-secondary);
                    font-weight: normal;
                    user-select: none;
                    
                    > span {
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>