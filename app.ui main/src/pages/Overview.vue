<script setup lang="ts">

import Menu from 'primevue/menu';
import { useRouter } from 'vue-router';
import { MenuItem } from 'primevue/menuitem/MenuItem';
import Button from 'primevue/button';
import { useEventBus } from '@vueuse/core';
import { computed, ref } from 'vue';
import { AuthorStatus } from '@interface/Author.ts';
import { useMainStore } from '@store/main.ts';

const router = useRouter();
const store = useMainStore();

const menuItems: MenuItem[] = [
    {
        label: 'Edison',
        items: [
            {
                label: 'Mine projekter',
                icon: 'pi pi-fw pi-folder-open',
                command: () => { router.push({ name: 'manuscripts' }) },
            },
        ],
    },
    {
        label: 'Skriveskolen',
        command: () => {
            window.open("https://egolibris.com/edison/skriveskolen-forside/", "_blank");
        },
        items: [
            {
                label: 'Artikler',
                icon: 'pi pi-fw pi-file',
                command: () => {
                    window.open("https://egolibris.com/edison/skriveskolen-artikler/", "_blank");
                },
            },
            {
                label: 'Webinarer',
                icon: 'pi pi-fw pi-video',
                command: () => {
                    window.open("https://egolibris.com/edison/skriveskolen-webinar/", "_blank");
                },
            },
            {
               label: 'Skriveøvelser',
               icon: 'pi pi-fw pi-pencil',
               command: () => {
                    window.open("https://egolibris.com/edison/skriveskolen-skriveovelser/", "_blank");
                },
            }
        ],
    }
];

const openUploadDialogBus = useEventBus<string>('OpenUploadDialog');
const currentUser = ref<AuthorStatus>(store.currentUser);
const disableUpload = computed(() => {
    const complimentaryUploadsRemaining = currentUser.value.complimentaryUploadsRemaining ?? 0;
    const subscriptionUploadsRemaining = currentUser.value.subscriptionUploadsRemaining ?? 0;
    const purchasedUploadsRemaining = currentUser.value.purchasedUploadsRemaining ?? 0;
    const totalUploadLeft = complimentaryUploadsRemaining + subscriptionUploadsRemaining + purchasedUploadsRemaining;

    return totalUploadLeft <= 0;
});


</script>

<template>
    <div class="overview-wrapper">
        <div class="py-3 px-3 flex flex-column gap-3 surface-header">
            <div
                class="flex justify-content-start"
                v-tooltip.right="{
                            value: 'Du er løbet tør for uploads.',
                            disabled: !disableUpload,
                        }"
                v-if="store.hasSubscription"
            >
                <Button
                    label="Analyser manuskript"
                    icon="pi pi-upload"
                    icon-pos="right"
                    severity="dark"
                    class="border-primary"
                    @click="openUploadDialogBus.emit('OPEN')"
                    :disabled="disableUpload"
                    :pt="{
                                root: {
                                    class: 'upload-button',
                                },
                                icon: {
                                    style: 'margin: 0;'
                                }
                            }"
                />
            </div>
            <Menu
                :model="menuItems"
                :pt="{
                            root: {
                                style: {
                                    border: '0 !important',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    backgroundColor: 'var(--surface-header) !important',
                                },
                            },
                            submenuHeader: {
                                style: {
                                    backgroundColor: 'var(--surface-header) !important',
                                },
                            }
                        }"
            >
                <template #submenuheader="{ item }">
                    <span @click="item.command" :class="{'clickable-label': item.command}" class="text-2xl text-headline">{{ item.label }}</span>
                </template>

                <template #end>
                    <span class="text-2xl text-headline coming-soon-menu-header">Skriveværktøjer</span>
                    <div class="coming-soon-container">

                        <ul class="coming-soon-menu">
                            <li>
                                <a class="flex items-center gap-2">
                                    <span class="pi pi-fw pi-sitemap" />
                                    <span>Plotboard</span>
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-2">
                                    <span class="pi pi-fw pi-hammer" />
                                    <span>Karakterbygger</span>
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-2">
                                    <span class="pi pi-fw pi-expand" />
                                    <span>Forsidegenerator</span>
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-2">
                                    <span class="pi pi-fw pi-pen-to-square" />
                                    <span>Skabeloner</span>
                                </a>
                            </li>
                        </ul>
                        <div class="overlay text-headline">Kommer i 2025</div>
                    </div>
                </template>
            </Menu>
        </div>
        <div class="router-container">
            <router-view class="pl-3" />
        </div>
    </div>
</template>

<style scoped lang="scss">

.overview-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
}

.router-container {
    overflow: auto;
    width: 100%;
    height: 100%;
}

.upload-button {
    border-radius: 1.375rem;
    width: 10rem;
    height: 2.5rem;
    font-family: Kadwa,serif;
    font-size: 0.8rem;
    font-weight: 700;
    line-height: 95%;
}

.coming-soon-container {
    position: relative;
}

.coming-soon-menu-header {
    padding: 0.75rem 1.25rem;
}

.coming-soon-menu {
    list-style: none;
    margin-top: 1rem;
}

.coming-soon-menu li {
    padding: 0.75rem 1.25rem;
    user-select: none;
    > a {
        color: var(--text-color);
    }
}

.coming-soon-menu li:last-child {
    border-bottom: none;
}

.overlay {
    position: absolute;
    border-radius: 1rem;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(51, 51, 51, 0.9); /* Semi-transparent overlay */
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    font-size: 20px;
    opacity: 0.9;
    pointer-events: none; /* Allows clicks to pass through to menu items */
}

.clickable-label {
    cursor: pointer;
    &:hover {
        color: var(--primary-color);
    }
}
</style>