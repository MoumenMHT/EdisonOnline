<script setup lang="ts">
import { ref } from 'vue'
import { FAQ } from "@interface/FAQ.ts";
import { useMainStore } from "@store/main.ts";
import Card from 'primevue/card';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import {mailTo} from "@util/mailTo.ts";

interface GroupedFAQS {
    area: string;
    faqs: FAQ[];
}


const store = useMainStore();
const Faqs = ref<FAQ[]>(store.edisonFaqs);

const mapFAQS = (faqs: FAQ[]): GroupedFAQS[] => {
    const areas = faqs.map(faq => faq.area);
    const uniqueAreas = [...new Set(areas)];
    return uniqueAreas.map(area => {
        return <GroupedFAQS>{
            area,
            faqs: faqs.filter(faq => faq.area === area)
        }
    });
}

const groupedFAQS = mapFAQS(Faqs.value);

</script>

<template>
    <div class="container px-4 py-4 xl:py-8 xl:px-8">
        <div class="font-bold text-6xl mb-4 text-center text-headline">Frequently Asked Questions</div>
        <Accordion :multiple="true" :activeIndex="[]">
            <AccordionTab v-for="group in groupedFAQS" :header="group.area">
                <div class="faq-container">
                    <Card v-for="faq in group.faqs" :key="faq.id" class="faq-item">
                        <template #title>{{faq.question}}</template>
                        <template #content>
                            <p class="m-0 text-gray-200">
                                {{faq.answer}}
                            </p>
                        </template>
                    </Card>
                </div>
            </AccordionTab>
        </Accordion>
        <div class="contact-container">
            <div class="text-center flex flex-column gap-4">
                <div class="font-bold text-xl text-lg">Har du yderligere spørgsmål?</div>
                <p class="text-gray-200 m-0 p-0">Vi er klar til at hjælpe dig. Kontakt os for at få svar på dine spørgsmål.</p>
                <div>
                    <Button icon="pi pi-send" @click="mailTo('Edison@skriveforlaget.dk')" label="Kontakt os" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

.contact-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    background-color: var(--surface-card);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
}
</style>
