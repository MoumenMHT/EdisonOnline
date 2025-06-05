//theme
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './styles/main.scss';
// Core
import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import router from "./core/router.ts";
import auth0Service from "./core/auth.ts";
// PrimeVue
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import BadgeDirective from 'primevue/badgedirective';
import Tooltip from 'primevue/tooltip';

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(auth0Service);
app.use(router);
// PrimeVue use
app.use(PrimeVue);
app.use(ConfirmationService);
// PrimeVue directive
app.directive('badge', BadgeDirective);
app.directive('tooltip', Tooltip);


// This should always be the last line!
app.mount('#app');
