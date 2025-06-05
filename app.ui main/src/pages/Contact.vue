<script setup lang="ts">
import { ref } from 'vue';
import christian from '@asset/contact/christian.jpg';
import emil from '@asset/contact/emil.jpg';
import signe from '@asset/contact/signe.jpg';
import heidi from '@asset/contact/heidi.jpg';
import eva from '@asset/contact/eva.jpg';
import { mailTo } from '@util/mailTo.ts';
import Button from 'primevue/button';


interface Person {
    name: string;
    role: string;
    description: string;
    image: string;
}

const people = ref<Person[]>(
    [
        {
            name: 'Christian Sand',
            role: 'Forlægger og grafisk designer',
            description: 'Christian er uddannet cand.mag. i litteratur med speciale i arkaisk græsk lyrik.' +
                ' Han har 17 års erfaring fra forlagsbranchen som redaktør, grafisk designer og digital produktionsleder.' +
                ' Foruden selv at skrive har Christian oversat 125 titler fra engelsk, svensk og norsk.',
            image: 'christian'
        },
        {
            name: 'Emil Sloth Andersen',
            role: 'Redaktør og PR-medarbejder',
            description: 'Med en baggrund som statskundskaber koblet med en god kommunikativ erfaring besidder Emil' +
                ' rollen som redaktør og PR-medarbejder for Skriveforlaget. Emil er begejstret for den litteratur, hvor' +
                ' lyrik, prosa og faglitteratur blandes mest muligt. Han har været ansat på forlaget siden 2023.',
            image: 'emil'
        },
        {
            name: 'Signe Borup',
            role: 'PR-medarbejder',
            description: 'Signe elsker at markedsføre og sælge bøger. Rigtig brug af presse og sociale medier i' +
                ' formidlingsarbejdet skal skabe synlighed af både forfattere og bøger, så læserne får kendskab til' +
                ' de gode oplevelser, der gemmer sig i dem. Som cand.mag i medievidenskab og sociologi – og gennem' +
                ' mange års arbejde med kommunikation, pr og salg – har hun oparbejdet viden om brug af online- og' +
                ' offline-medier som formidlingskanaler rettet mod forskellige typer af målgrupper.',
            image: 'signe'
        },
        {
            name: 'Heidi Wendelboe',
            role: 'Koordinator og projektleder',
            description: 'Heidi er en meget ivrig læser og har en forkærlighed for litteratur og sprog. Heidi læser' +
                ' gerne på andre sprog, og helst mange forskellige genrer. Hun elsker også struktur og planlægning og' +
                ' har derfor overblikket som projektleder. Derudover løser Heidi opgaver som både redaktør' +
                ' og SoMe-ansvarlig. Hun har været hos Skriveforlaget og EgoLibris siden 2018.',
            image: 'heidi'
        },
        {
            name: 'Eva Götzsche',
            role: 'Administrerende og kreativ direktør',
            description: 'Eva er en innovativ sjæl i forlagsbranchen. Hun grundlagde forlaget EgoLibris i 2013 med' +
                ' den grundtanke, at forlaget skal kunne rumme alt fra den spæde forfatterspire til' +
                ' bestsellerforfattere – og at der er behov for, at nye og talentfulde forfattere skal have en langt' +
                ' større mulighed for at blive spottet, udviklet og udgivet. Eva har redigeret utallige bøger over' +
                ' årene og er medforfatter og ghostwriter på flere bøger.',
            image: 'eva'
        }
    ]
);

const imageResolver = (imageName: string) => {
    switch (imageName) {
        case 'christian':
            return christian;
        case 'emil':
            return emil;
        case 'signe':
            return signe;
        case 'heidi':
            return heidi;
        case 'eva':
            return eva;
        default:
            return '';
    }
}
</script>

<template>
    <div class="container px-4 py-4 xl:py-8 xl:px-8">
        <span class="font-bold text-6xl mb-4 text-center text-headline">Hvem er teamet bag Edison?</span>
        <div class="grid">
            <div
                v-for="person in people"
                :key="person.name"
                class="col-4 mb-4"
            >
                <div>
                    <img :src="imageResolver(person.image)" :alt="person.name" class="person-image">
                    <div class="flex flex-column gap-3 p-2 mt-2">
                        <h2 class="m-0">{{ person.name }}</h2>
                        <span class="m-0 text-gray-200">{{ person.role }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="contact-container">
            <div class="text-center flex flex-column gap-4">
                <div class="font-bold text-xl text-lg">Hvordan kan du komme i kontakt med os?</div>
                <p class="text-gray-200 m-0 p-0">Vi er klar til at hjælpe dig. Ring på 86511900 eller skriv en mail til os for at få svar på dine spørgsmål.</p>
                <div>
                    <Button icon="pi pi-send" @click="mailTo('Edison@skriveforlaget.dk')" label="Kontakt os" />
                </div>
            </div>
        </div>
        <h4 class="text-center mb-0 text-gray-300">Edison er en del af forlagsgruppen EgoLibris, der også omfatter Skriveforlaget, Trykværket og Forlaget Indblik</h4>
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

.person-image {
    // keep the aspect ratio of the image
    width: 100%;
    height: 30rem;
    object-fit: cover;
    border-radius: 16px;
}

</style>