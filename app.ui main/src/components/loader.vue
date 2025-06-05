<template>
    <div class="loader-wrapper">
        <logo />
<!--        TODO: Make this work better -->
        <span class="loader">Loading</span>
    </div>
</template>

<script setup lang="ts">
import logo from '@asset/icons/logo.svg';
</script>

<style scoped lang="scss">
.loader-wrapper {
    overflow: hidden;
    text-align: center;

    .loader {
        display: inline-block;
        position: relative;
        font-size: 48px;
        box-sizing: border-box;
    }
    .loader::after {
        content: '';
        width: 5px;
        height: 5px;
        background: currentColor;
        border-radius: 50%;
        position: absolute;
        bottom: 10px;
        right: -10px;
        box-sizing: border-box;
        animation: animloader 10s linear infinite;
    }
    
    svg {
        height: 80vh;
        display: block;
        margin-left: auto;
        margin-right: auto;
        padding-top: 5vh;
        padding-bottom: 5vh;
        animation: rotation 20s linear infinite;
        fill: var(--primary-500)
    }
}

@keyframes rotation {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
}
$color: #ffffff;
@keyframes animloader {
    0% {
        box-shadow: 
            10px 0 rgba($color, 0), 
            20px 0 rgba($color, 0),
            30px 0 rgba($color, 0),
            40px 0 rgba($color, 0);
    }
    20% {
        box-shadow:
            10px 0 rgba($color, 1),
            20px 0 rgba($color, 0),
            30px 0 rgba($color, 0),
            40px 0 rgba($color, 0);
    }
    40% {
        box-shadow:
            10px 0 rgba($color, 1),
            20px 0 rgba($color, 1),
            30px 0 rgba($color, 0),
            40px 0 rgba($color, 0);
    }
    60% {
        box-shadow:
            10px 0 rgba($color, 1),
            20px 0 rgba($color, 1),
            30px 0 rgba($color, 1),
            40px 0 rgba($color, 0);
    }
    80%, 100% {
        box-shadow:
            10px 0 rgba($color, 1),
            20px 0 rgba($color, 1),
            30px 0 rgba($color, 1),
            40px 0 rgba($color, 1);
    }
}
</style>
