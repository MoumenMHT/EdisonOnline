<script lang="ts" setup>
import Menubar from 'primevue/menubar';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import { MenuItem } from 'primevue/menuitem/MenuItem';
import Loader from '@component/loader.vue';
import fullLogo from '@asset/icons/full_logo.svg';
import { isAuthenticated, isLoading, getUser } from '@core/auth.ts';
import { ref } from 'vue';
import { useMainStore } from '@store/main.ts';
import router from '@core/router.ts';
import { User } from '@auth0/auth0-vue';
import ManuscriptUploadDialog from '@component/manuscript/UploadDialog.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import { ConfirmationOptions } from 'primevue/confirmationoptions';

const user = getUser();
const store = useMainStore();
const navigate = (place: string) => {
    router.push({ name: place }).then();
}



const items = ref<MenuItem[]>([
    {
        label: 'Priser',
        command: () => navigate('pricing'),
    },
    {
        label: 'FAQ',
        command: () => navigate('faq'),
    },
    {
        label: 'Kontakt',
        command: () => navigate('contact'),
    },
    {
        label: 'Opret bruger/Login',
        command: () => navigate('login'),
        visible: () => !isAuthenticated(),
    },
    {
        label: 'Prøverapport',
        command: () => navigate('trial'),
        visible: () => !isAuthenticated() || !store.hasSubscription,
    },
]);

const userMenu = ref();

const userItems = ref<MenuItem[]>([
    { 
        label: 'Profil', 
        icon: 'pi pi-fw pi-user',
        command: () => navigate('userprofile'),
    },
    // { 
    //     label: 'Indstillinger', 
    //     icon: 'pi pi-fw pi-cog',
    // },
    { 
        separator: true, 
        visible: () => store.isAdmin,
    },
    {
        label: 'Admin',
        icon: 'pi pi-fw pi-key',
        command: () => navigate('admin'),
        visible: () => store.isAdmin,
    },
    { 
        separator: true 
    },
    {
        label: 'Logout',
        icon: 'pi pi-fw pi-lock',
        command: () => navigate('logout'),
    },
]);

const toggle = (event: MouseEvent) => {
    userMenu.value.toggle(event);
};

const getUserPicture = (user: User | undefined): string => {
    return user?.picture ?? '';
}
const getUserName = (user: User | undefined): string => {
    return user?.name ?? '';
}

</script>

<template>
    <div v-if="isLoading()" class="page-layout">
        <loader/>
    </div>
    <div v-else
         class="main"
         v-bind:class="{
            'authenticated': isAuthenticated(),
        }"
    >
        <div class="top-bar">
            <Menubar :model="items" class="surface-header">
                <template #start>
                    <router-link :to="{ name: 'home' }" class="mainlogo">
                        <fullLogo
                            v-bind:class="{ 'fill-primary': true }"

                        />
                    </router-link>
                </template>
                <template #end v-if="isAuthenticated()">
                    <div class="grid grid-nogutter">
                        <div class="col p-0 flex align-items-center">
                            <Button 
                                text class="profile-button" 
                                @click="toggle" 
                                aria-haspopup="true"
                                aria-controls="user_menu"
                            >
                                <div class="profile-image">
                                    <img :src="getUserPicture(user)"  alt="user profile image"/>
                                </div>
                                <span class="profile-name">{{ getUserName(user) }}</span>
                            </Button>
                            <Menu ref="userMenu" id="user_menu" :model="userItems" :popup="true"/>
                        </div>
                    </div>
                </template>
            </Menubar>
        </div>
        <div class="content-wrapper surface-ground">
            <router-view></router-view>
        </div>
    </div>
    <ManuscriptUploadDialog></ManuscriptUploadDialog>
<!--  Dialogs  -->
    <ConfirmDialog></ConfirmDialog>
    <ConfirmDialog 
        group="apiError"
        :pt="{
            root: {
                style: {
                    border: '0',
                },
            }
        }"
    >
        <template #container="{ message, acceptCallback }: { message: ConfirmationOptions, acceptCallback: () => void }">
            <div class="flex flex-column align-items-center p-5 surface-card border-round border-2 border-red-500">
                <div class="border-circle bg-red-500 inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                    <i class="pi pi-info text-5xl"></i>
                </div>
                <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
                <p class="mb-0">Server besked:</p>
                <p class="mb-0 mt-1">{{ message.message }}</p>
                <p class="mb-0">Hvis det er første gang du ser denne fejl så vent et par min og prøv igen.</p>
                <p class="mb-0 mt-1">Hvis denne fejl bliver ved med ske så kontakt Edison.</p>
                <div class="flex align-items-center gap-2 mt-4">
                    <Button label="OK" @click="acceptCallback" severity="danger"></Button>
                </div>
            </div>
        </template>
    </ConfirmDialog>
</template>

<style lang="scss" scoped>
@media print {
    .main.authenticated {
        width: 100%;
        height: fit-content;

        .top-bar {
            display: none;
        }

        .content-wrapper {
            flex: 1;
            overflow: initial !important;
        }
    }
}
@media screen and (max-width: 960px) {
    .main {
        width: 100%;

        &:not(.authenticated) {
            .top-bar {
                .p-menubar {
                    :deep(.p-menubar-root-list) {
                        border: none;
                        border-radius: 0;
                        background: rgba(0,0,0,0.5);
                    }
                }
            }
        }
    }
}

.main {
    width: 100%;

    .mainlogo {
        display: flex;
        
        > svg {
            margin-right: 0.5rem !important;
            height: 50px;
        }
    }
    
    &:not(.authenticated) {
        height: 100%;
        
        .top-bar {
            position: sticky;
            top: 0;
            /* TODO look into how to make this properly */
            //height: 0;

            .p-menubar {
                border: none;
                border-radius: 0;
                background: rgba(0,0,0,0.2);
                -webkit-backdrop-filter: blur(8px);
                backdrop-filter: blur(8px);
                justify-content: center;
                
                :deep(.p-menubar-root-list) {
                    > .p-menuitem { 
                        &.p-focus {
                            > .p-menuitem-content {
                                color: #efefef;
                                background: none;
                            }
                        }
                        &:not(:last-child) {
                            margin-right: 0.25rem;
                        }

                        > .p-menuitem-content {
                            .p-menuitem-link {                                
                                > .p-menuitem-icon {
                                    display: none;
                                }
                                > .p-menuitem-text {
                                    color: #fff;
                                }
                            }
                            
                            &:hover {
                                color: #efefef;
                                background: none;
                            }
                        }
                    }
                }
            }
        }
        
        .content-wrapper {
            height: calc(100% - 66px);
        }
    }

    &.authenticated {
        height: 100%;
        display: flex;
        flex-direction: column;

        .content-wrapper {
            flex: 1;
            overflow: auto;
        }

        .top-bar {
            flex: 0 0 auto;


            .p-menubar {
                border: none;
                border-radius: 0;

                :deep(.p-menubar-start) {
                    //border-right: 1px solid #dee2e6;
                    padding-right: 1rem;
                    margin-right: 1rem
                }

                :deep(.p-menubar-root-list) {
                    > .p-menuitem {
                        &:not(:last-child) {
                            margin-right: 1rem;
                        }

                        > .p-menuitem-content {
                            .p-menuitem-link {
                                padding: 0.75rem 2rem;
                            }
                        }
                    }
                }

                button {
                    &:focus {
                        box-shadow: none;
                    }

                    :deep(.p-badge) {
                        position: absolute;
                        transform: translate(50%, -50%);
                        transform-origin: 100% 0;
                        margin: 0;
                    }
                }

                .include-spacer {
                    border-right: 1px solid #dee2e6;
                    padding-right: 1rem !important;
                    margin-right: 1rem;
                }

                .profile-button {
                    padding: 0;
                    background-color: var(--primary-500);
                    color: var(--primary-color-text);

                    .profile-image {
                        display: inline-block;
                        max-width: 3rem;
                        max-height: 3rem;
                        
                        > img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .profile-name {
                        padding: 0 1rem;
                    }
                }
            }
        }
    }
}

.notinuseatallstuff {
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
}
</style>
