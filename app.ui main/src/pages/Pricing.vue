<script setup lang="ts">
import { PaymentService } from '@service/payment.service.ts';
import { ref } from 'vue';
import Button from "primevue/button";
import { BillingInterval, PaymentProduct } from '@interface/Payment.ts';
import { isAuthenticated } from '@core/auth.ts';
import router from '@core/router.ts';
import { useConfirm } from 'primevue/useconfirm';
import { mailTo } from '@util/mailTo.ts';

interface Feature {
    header: string;
    description?: string;
    bulletPoints?: string[];
}

const features = ref<Feature[]>([
    {
        header: 'Få øjeblikkelig feedback på din bog med konkrete anbefalinger',
        description: 'Edison er din redaktør, som altid og uden fordomme hjælper dig i din skriveproces',
    },
    {
        header: 'Whats in it for me?',
        bulletPoints: [
            'Unikke indsigter i din bog',
            'Sammenligner din bog med tusindvis af bestsellere i samme genre',
            'Fortæller dig om din bogs tempo, litterære arketype og læsernes præference for din bog',
            'Giver dig anvendelige råd og anbefalinger på 17 forskellige områder',
        ]
    },
    {
        header: 'Edisons professionelle skriveskole',
        bulletPoints: [
            'Få adgang til Edisons skriveskole, der er fyldt med konkrete og brugbare anvisninger på kendte og knap ' +
            'så kendte skriveudfordringer',
            'Artikler og skriveøvelser med masser af eksempler',
            'Webinarer om alt fra karakterudvikling til den svære kunst at vise frem for at beskrive',
        ]
    },
    {
        header: 'Hvem kan bruge Edison?',
        bulletPoints: [
            'Perfekt til både nye og erfarne forfattere',
            'Et godt værktøj til den professionelle redaktør',
            'Alsidige muligheder for specialdesignede licensversioner til forlag, streamingservices og online boghandlere',
        ]
    }
]);
let paymentProducts = ref<PaymentProduct[]>([]);
const confirm = useConfirm();

PaymentService.getProducts().then((request) => {
    let data = request.data.value;
    if (data !== undefined && data !== null) {
        // sort the products so Opening offer is first
        data.sort((a) => {
            if (a.name === 'Edison- Skriveskolen') {
                return -1;
            }
            return 1;
        });
        paymentProducts.value = data;
    }
})
const navigate = (place: string) => {
    router.push({ name: place }).then();
}

const translatePrice = (price: number, currency: string) => {
    switch (currency) {
        case 'DKK': 
            return price/100 + ' kr.';
        default:
            return price + ' ' + currency;
    }
}
const translateBillingInterval = (billingInterval?: BillingInterval) => {
    switch (billingInterval) {
        case 'MONTHLY':
            return 'per måned';
        case 'QUARTERLY': 
            return 'per kvartal';
        default:
            return '';
    }
}

const loadingPayment = ref(false);

const buyProduct = (id?: string) => {
    if (id === undefined) {
        return;
    }
    loadingPayment.value = true;
    PaymentService.buyProduct(id, ctx => { 
        // If there happens a fetch error we handle it here.
        
        if (ctx.data === null) { return; }

        confirm.require({
            group: 'apiError',
            header: 'Der skete en fejl',
            message: ctx.data.message,
            
        });
    }).then(request => {
        if (request.data.value?.paymentUrl !== undefined) {
            window.location.href = request.data.value?.paymentUrl;
        }

        loadingPayment.value = false;
    });
}
</script>

<template>
    <div class="header-banner h-full"/>
    <div class="pricing h-full px-4 py-4 xl:py-6 xl:px-8">
        <div class="font-bold text-6xl mb-4 text-center  text-headline">
            Få en redaktionel vurdering af din bog
        <br>
            på under 30 minutter!
        </div>
        <div class="text-primary text-headline font-bold mb-6 line-height-3 slogan text-center m-auto" style="max-width: 80rem;">
            EDISON – TURNING WRITERS INTO AUTHORS
        </div>

        <div class="grid features">
            <div class="col-12 lg:col-3" v-for="feature in features">
                <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card" style="border-radius: 6px">
                        <div class="flex flex-column gap-2">
                            <div class="font-medium text-primary text-xl">{{feature.header}}</div>
                            <div v-if="feature.description" class="text-400">{{feature.description}}</div>
                        </div>
                        <div class="h-full flex flex-column justify-content-between" v-if="feature.bulletPoints !== undefined">
                            <div>
                                <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>
                                <ul class="p-0 pl-4">
                                    <li class="mb-3 " v-for="bullet in feature.bulletPoints">
                                        <span>{{ bullet }}</span>
                                    </li>
                                </ul>
                            </div>
                            <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="font-bold text-4xl text-center text-headline mt-8 mb-4">Abonnementer</div>

        <div class="grid">
            <div class="col-12 lg:col-4" v-for="product in paymentProducts" v-if="isAuthenticated()">
                <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card" style="border-radius: 6px">
                        <div class="font-medium text-xl mb-2">{{product.name}}</div>
                        <div class="text-400">{{product.description}}</div>
                        <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>
                        <div class="flex align-items-center">
                            <span class="font-bold text-2xl" v-if="product.name === 'Edison- Skriveskolen'">{{translatePrice(3900, product.currency)}}</span>
                            <span class="font-bold text-2xl" v-else>{{translatePrice(product.price, product.currency)}}</span>
                            <span class="ml-2 font-medium text-400">{{translateBillingInterval(product.billingInterval)}}</span>
                        </div>
                        <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                        <ul class="list-none p-0 m-0 flex-grow-1" v-if="product.bullets !== undefined">
                            <li class="flex align-items-center mb-3" v-for="bullet in product.bullets">
                                <i :class="['pi','text-green-500','mr-2',bullet.icon]" v-if="bullet.icon != undefined"></i>
                                <span>{{ bullet.text }}</span>
                            </li>
                        </ul>
                        <hr class="mb-3 mx-0 border-top-1 border-none surface-border mt-auto" v-if="product.bullets != undefined" />
                        <Button label="Køb nu" class="p-3 w-full mt-auto" @click="buyProduct(product.id)" :disabled="loadingPayment"></Button>
                    </div>
                </div>
            </div>
<!--            <div class="col-12 lg:col-4" v-if="!isAuthenticated()">-->
<!--                <div class="p-3 h-full">-->
<!--                    <div class="shadow-2 p-3 h-full flex flex-column surface-card" style="border-radius: 6px">-->
<!--                        <div class="font-medium text-xl mb-2">Edison-Online Standard Subscription</div>-->
<!--                        <div class="text-400">-->
<!--                            Edison-Online Standard Subscription / 1 uploads pr måned-->
<!--                        </div>-->
<!--                        <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>-->
<!--                        <div class="flex align-items-center">-->
<!--                            <span class="font-bold text-2xl">229 kr.</span>-->
<!--                            <span class="ml-2 font-medium text-400">per måned</span>-->
<!--                        </div>-->
<!--                        <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>-->
<!--                        <ul class="list-none p-0 m-0 flex-grow-1">-->
<!--                            <li class="flex align-items-center mb-3">-->
<!--                                <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                                <span>Gratis oprettelse af bruger</span>-->
<!--                            </li>-->
<!--                            <li class="flex align-items-center mb-3">-->
<!--                                <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                                <span>Se gratis prøverapport</span>-->
<!--                            </li>-->
<!--                            <li class="flex align-items-center mb-3">-->
<!--                                <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                                <span>Adgang til relaterede artikler i SprogLab</span>-->
<!--                            </li>-->
<!--                            <li class="flex align-items-center mb-3">-->
<!--                                <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                                <span>En Edison-analyse </span>-->
<!--                            </li>-->
<!--                        </ul>-->
<!--                        <hr class="mb-3 mx-0 border-top-1 border-none surface-border mt-auto"/>-->
<!--                        <Button label="Login for køb" class="p-3 w-full mt-auto" @click="navigate('login')"></Button>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="col-12 lg:col-4" v-if="!isAuthenticated()">-->
<!--                <div class="p-3 h-full">-->
<!--                    <div class="shadow-2 p-3 h-full flex flex-column surface-card" style="border-radius: 6px">-->
<!--                        <div class="font-medium text-xl mb-2">Edison-Online Premium Subscription</div>-->
<!--                        <div class="text-400">-->
<!--                            Edison-Online Premium Subscription / 3 uploads pr kvartal-->
<!--                        </div>-->
<!--                        <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>-->
<!--                        <div class="flex align-items-center">-->
<!--                            <span class="font-bold text-2xl">529 kr.</span>-->
<!--                            <span class="ml-2 font-medium text-400">per kvartal</span>-->
<!--                        </div>-->
<!--                        <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>-->
<!--                        <ul class="list-none p-0 m-0 flex-grow-1">-->
<!--                            <li class="flex align-items-center mb-3">-->
<!--                                <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                                <span>Gratis oprettelse af bruger</span>-->
<!--                            </li>-->
<!--                            <li class="flex align-items-center mb-3">-->
<!--                                <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                                <span>Se gratis prøverapport</span>-->
<!--                            </li>-->
<!--                            <li class="flex align-items-center mb-3">-->
<!--                                <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                                <span>Fuld adgang til SprogLab</span>-->
<!--                            </li>-->
<!--                            <li class="flex align-items-center mb-3">-->
<!--                                <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                                <span>To Edison analyser pr måned så længe dit abonnement varer</span>-->
<!--                            </li>-->
<!--                            <li class="flex align-items-center mb-3">-->
<!--                                <i class="pi pi-info-circle text-yellow-500 mr-2"></i>-->
<!--                                <span>6 måneders bindings periode</span>-->
<!--                            </li>-->
<!--                        </ul>-->
<!--                        <hr class="mb-3 mx-0 border-top-1 border-none surface-border"/>-->
<!--                        <Button label="Login for køb" class="p-3 w-full" @click="navigate('login')"></Button>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
            <div class="col-12 lg:col-4" v-if="!isAuthenticated()">
                <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card" style="border-radius: 6px">
                        <div class="font-medium text-xl mb-2">Edison- Skriveskolen</div>
                        <div class="text-400">
                            Abonnement kun på Skriveskolen
                        </div>
                        <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>
                        <div class="flex align-items-center">
                            <span class="font-bold text-2xl">39 kr.</span>
                            <span class="ml-2 font-medium text-400">per måned</span>
                        </div>
                        <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>
                        <ul class="list-none p-0 m-0 flex-grow-1">
                            <li class="flex align-items-center mb-3">
                                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                <span>Normalpris kr. 99,- spar kr. 60,-</span>
                            </li>
                            <li class="flex align-items-center mb-3">
                                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                <span>Adgang til Edisons Skriveskolen</span>
                            </li>
                            <li class="flex align-items-center mb-3">
                                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                <span>Køb Edisons analyser efter behov</span>
                            </li>
                        </ul>
                        <hr class="mb-3 mx-0 border-top-1 border-none surface-border"/>
                        <Button label="Login for køb" class="p-3 w-full" @click="navigate('login')"></Button>
                    </div>
                </div>
            </div>
            <div class="col-12 lg:col-4" v-if="!isAuthenticated()">
                <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card" style="border-radius: 6px">
                        <div class="font-medium text-xl mb-2">Edison-Online Standard Subscription</div>
                        <div class="text-400">
                            Edison-Online Standard Subscription / 1 upload pr måned
                        </div>
                        <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>
                        <div class="flex align-items-center">
                            <span class="font-bold text-2xl">229 kr.</span>
                            <span class="ml-2 font-medium text-400">per måned</span>
                        </div>
                        <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>
                        <ul class="list-none p-0 m-0 flex-grow-1">
                            <li class="flex align-items-center mb-3">
                                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                <span>En Edison-analyse pr måned, så længe abonnementet løber</span>
                            </li>
                            <li class="flex align-items-center mb-3">
                                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                <span>Fri adgang til Skriveskolen.</span>
                            </li>
                        </ul>
                        <hr class="mb-3 mx-0 border-top-1 border-none surface-border"/>
                        <Button label="Login for køb" class="p-3 w-full" @click="navigate('login')"></Button>
                    </div>
                </div>
            </div>
            <div class="col-12 lg:col-4" v-if="!isAuthenticated()">
                <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card" style="border-radius: 6px">
                        <div class="font-medium text-xl mb-2">Edison-Online Premium Subscription.</div>
                        <div class="text-400">
                            Edison-Online PREMIUM Subscription / 6 uploads pr kvartal
                        </div>
                        <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>
                        <div class="flex align-items-center">
                            <span class="font-bold text-2xl">529 kr.</span>
                            <span class="ml-2 font-medium text-400">per kvartal</span>
                        </div>
                        <hr class="my-3 mx-0 border-top-1 border-none surface-border"/>
                        <ul class="list-none p-0 m-0 flex-grow-1">
                            <li class="flex align-items-center mb-3">
                                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                <span>Spar kr. 158 ift. Edison standard abonnement</span>
                            </li>
                            <li class="flex align-items-center mb-3">
                                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                <span>Fuld adgang til Edison Skriveskolen</span>
                            </li>
                            <li class="flex align-items-center mb-3">
                                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                <span>Køb Edisons analyser efter behov</span>
                            </li>
                        </ul>
                        <hr class="mb-3 mx-0 border-top-1 border-none surface-border"/>
                        <Button label="Login for køb" class="p-3 w-full" @click="navigate('login')"></Button>
                    </div>
                </div>
            </div>
            <div class="col-12 lg:col-4">
                <div class="p-3 h-full">
                    <div class="shadow-2 p-3 flex flex-column surface-card h-full" style="border-radius: 6px">
                        <div class="font-medium text-xl mb-2">Enterprise</div>
                        <div class="text-400">Har du brug for en specialiceret løsning?</div>
                        <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                        <div>Edison kan tilpasses dine behov og din organisation. Vi kan træne Edison på dit eget materiale og tilpasse rapporterne til dit behov - uanset om du er et forlag eller en anden type af virksomhed, hvor der er behov for analyse og rapportering.</div>
                        <hr class="mb-3 mx-0 border-top-1 border-none surface-border mt-auto" />
                        <Button label="Kontakt os" class="p-3 w-full p-button-outlined " @click="mailTo('Edison@skriveforlaget.dk')"></Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex gap-4 justify-content-center align-items-center mt-4 mb-4">
            <div class="font-bold text-4xl text-center text-headline">
                Se et eksempel på Edisons feedback før du beslutter dig:
            </div>
            <img
                src="../assets/trial/trial-report.jpg"
                alt="Edison feedback"
                class="trial-image"
                @click="navigate('trial')"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">

.header-banner {
    margin-top: -20rem;
    background-image: url('../assets/pricing/background.png');
    background-size: auto;
    background-repeat: no-repeat;
}

.pricing {
    margin-top: -55rem;
}

.slogan {
    font-size: 2.5rem;
    letter-spacing: .2rem;
}

.features {
    margin-top: 25rem;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
}

.trial-image {
    width: 100px;
    height: auto;
    cursor: pointer;
    rotate: -12deg;
}
</style>
