<script setup lang="ts">
import circleArrow from '@asset/icons/circleArrow.svg';
import { computed, ref, watch } from 'vue';
import WPAPI from 'wpapi';
import Paginator from 'primevue/paginator';

interface WPArticle {
    id: number;
    image: string;
    headline: string;
    summary: string;
    link: string;
}

const props = defineProps<{
    reportId: number
}>();

// const sproglabIdFormatter = (id: number) => {
//     switch (id) {
//         case 1:
//             return 95;
//         case 2:
//             return 92;
//         case 3:
//             return 94;
//         case 4:
//             return 93;
//         case 5:
//             return 97;
//         case 6:
//             return 98;
//         case 7:
//             return 99;
//         case 8:
//             return 100;
//         case 9:
//             return 101;
//         case 10:
//             return 119;
//         case 11:
//             return 96;
//         case 12:
//             return 102;
//         case 13:
//             return 103;
//         case 14:
//             return 104;
//         case 15:
//             return 105;
//         case 16:
//             return 106;
//         case 17:
//             return 107;
//     }
// };

const egolibrisIdFormatter = (id: number) => {
    switch (id) {
        case 1:
            return 2336;
        case 2:
            return 2333;
        case 3:
            return 2343;
        case 4:
            return 2335;
        case 5:
            return 2350;
        case 6:
            return 2348;
        case 7:
            return 2334;
        case 8:
            return 2341;
        case 9:
            return 2351;
        case 10:
            return 2342;
        case 11:
            return 2349;
        case 12:
            return 2337;
        case 13:
            return 2347;
        case 14:
            return 2339;
        case 15:
            return 2344;
        case 16:
            return 2345;
        case 17:
            return 2340;
    }
};

const wp = new WPAPI({endpoint: 'https://egolibris.com/wp-json'});
const articles = ref<WPArticle[]>([]);
const itemsPerPage = ref<number>(4);
const totalItems = ref<number>(0);
const page = ref<number>(1);
const wordpressParams = computed(() => {
    return {
        perPage: itemsPerPage.value,
        page: page.value
    };
});

const fetchArticles = () => {
    wp.posts()
        .perPage(wordpressParams.value.perPage)
        .page(wordpressParams.value.page)
        .embed()
        .param('edisonreport', egolibrisIdFormatter(props.reportId))
        .param('disable_login_redirect', 'true')
        .then((response) => {
            if (!response || response.length === 0) {
                return;
            }
            formatWPData(response);
            response._paging.total ? totalItems.value = response._paging.total : totalItems.value = 0;
        })
        .catch((error) => {
            console.error(error);
        });
}

watch( () => wordpressParams.value, () => {
    fetchArticles();
}, { immediate: true });

const calculateLimit = (total: number, perPage: number): number => {
    if (total < perPage) {
        return total;
    }
    if (page.value * perPage > total) {
        return total - (page.value - 1) * perPage;
    }
    return perPage;
};

const replaceHtmlEntities = (str: string): string => {
    return str.replace(/&nbsp;/g, ' ')
        .replace(/&hellip;/g, '...')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\[.*?]/g, '')
        .replace(/&.*?;/g, '');
};

const formatWPSummary = (summary: string) => {
    const stripHtmlTags = (str: string): string => {
        return str.replace(/<\/?[^>]+(>|$)/g, "");
    };

    let rawText = stripHtmlTags(summary);
    rawText = replaceHtmlEntities(rawText);

    const findLastCompleteSentence = (text: string): string => {
        const sentences = text.match(/[^.!?]*[.!?]/g);
        if (!sentences || sentences.length === 0) {
            return text;
        }

        let result = "";
        let charCount = 0;
        for (const sentence of sentences) {
            charCount += sentence.length;
            if (charCount >= text.length - 1) {
                break;
            }
            result += sentence.trim() + " ";
        }
        return result.trim();
    };

    return findLastCompleteSentence(rawText);
};

const formatWPData = (data: any) => {
    if (articles.value.length > 0) {
        articles.value = [];
    }
    const limit = calculateLimit(data._paging.total, itemsPerPage.value);
    for (let i = 0; i < limit; i++) {
        const article: WPArticle = {
            id: data[i].id,
            image: data[i]._embedded['wp:featuredmedia'][0].source_url,
            headline: replaceHtmlEntities(data[i].title.rendered),
            summary: formatWPSummary(data[i].excerpt.rendered),
            link: data[i].link
        };
        articles.value.push(article);
    }
};

const onPaginate = (e) => {
    page.value = e.page + 1;
};

</script>

<template>
    <div class="pt-5 px-8 noPrint" v-if="articles.length > 0">
        <div class="flex justify-content-center align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#E4B200"/>
            </svg>
            <h1 class="m-0">
                Skriveskole
            </h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#E4B200"/>
            </svg>
        </div>
        <div class="text-wrapper gap-5 my-6 px-3">
            <div class="article" v-for="article in articles">
                <div class="px-2 flex flex-column justify-content-between h-full">
                    <div>
                        <img v-if="article.image" :src="article.image" alt="article image" class="w-full h-auto border-round-xl mb-3 mt-2" />
                        <span class="text-primary" style="font-size: 1.25rem;">
                            {{ article.headline.replaceAll('0x3A', ':') }}
                        </span>
                        <br>
                        <span v-if="article.summary !== 'NoText'">{{ article.summary.replaceAll('0x3A', ':') }}</span>
                    </div>

                    <a :href="article.link.replaceAll('0x3A', ':')" target="_blank"
                       class="flex my-2 align-items-center justify-content-between">
                        <span class="text-primary">
                            Gå til artikel
                        </span>
                        <circleArrow class="arrow NE" style="width: 30px"/>
                    </a>
                </div>
            </div>
        </div>
        <div class="paginator-wrapper" v-if="itemsPerPage <= totalItems">
            <Paginator :rows="itemsPerPage" :totalRecords="totalItems" @page="onPaginate"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
.text-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;

    > .article {
        border-radius: 16px;
        border: 1px solid #E4B200;
        background: rgba(217, 217, 217, 0.13);
        padding: 0.5rem;
        max-width: 22%;

        font-family: var(--font-family);
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
}
</style>