<script setup lang="ts">
import webinarImage from '@/assets/Edison-Webinar.png'; // Import the image
// const calculateWidth = () => {
//     return window.innerWidth;
// }

// const calculateHeight = () => {
//     // Keep 16:9 aspect ratio
//     return window.innerWidth * 9 / 16;
// }

</script>

<template>
    <div class="px-4 py-4 xl:py-8 xl:px-8 h-full">
        <div class="flex flex-column gap-6 w-full h-full">
            <div class="warning-box">
                <p><strong>OBS:</strong> Vi har opdateret Edison. Du kan derfor opleve ændringer, der påvirker dine resultater, fordi Edisons beregninger er blevet mere præcise.</p>
            </div>
            <div class="flex align-items-center flex-column gap-4">
                <span class="text-6xl text-headline">
                    Velkommen til Edison
                </span>
                <span class="text-gray-200 text-xl">Start din forfatterrejse her</span>
            </div>
            <div class="flex justify-content-center">
                <div class="guide-box text-headline">
                    Få en rundtur på Edison!
                    <div class="guide-arrow-down"/>
                </div>
            </div>
            <div class="flex justify-content-center">
                 <a href="https://www.youtube.com/watch?v=lRLlWigZ7aM" target="_blank" rel="noopener noreferrer">
                    <img class="webinar-image" :src="webinarImage" alt="Link to YouTube" />
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.guide-box {
    background-color: var(--primary-color);
    padding: 20px;
    border-radius: 10px;
    font-size: 20px;
    text-align: center;
    width: 300px;
    position: relative;
}

.guide-arrow-down {
    position: absolute;
    bottom: -20px;
    left: 50%;
    margin-left: -20px;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid var(--primary-color);
}

.warning-box {
    background-color: var(--primary-color);
    padding: 15px;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 5px;
    margin-top: -5px;
}

.webinar-image {
    width: 400px;  /* Set the desired width */
    height: 230px;  /* Set the desired height */
    object-fit: cover; /* Optional: Adjusts how the content of the image is resized */
}
</style>
