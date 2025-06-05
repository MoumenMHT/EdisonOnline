<script setup lang="ts">

import TabMenu from 'primevue/tabmenu';
import { useRouter } from 'vue-router';
import { isAuthenticated } from "@core/auth.ts";
import { MenuItem } from 'primevue/menuitem/MenuItem';

const router = useRouter();

const adminItems: MenuItem[] = [
    {
        label: 'Alle Manuskripter',
        icon: 'pi pi-fw pi-folder-open',
        command: () => { router.push({ name: 'adminmanuscripts' }) },
        visible: () => isAuthenticated()
    },
    {
        label: 'Forfattere',
        icon: 'pi pi-fw pi-user-edit',
        command: () => { router.push({ name: 'authors' }) },
        visible: () => isAuthenticated()
    },
    {
        label: 'Nye Forfattere',
        icon: 'pi pi-fw pi-user-plus',
        command: () => { router.push({ name: 'newusers' }) },
        visible: () => isAuthenticated()
    },
    {
        label: 'Similar Books',
        icon: 'pi pi-fw pi-book',
        command: () => { router.push({ name: 'similarbooks' }) },
        visible: () => isAuthenticated()
    }
];

</script>


<template>
    <div class="admin-wrapper">
        <div>
            <TabMenu :model="adminItems"/>
        </div>
        <div class="router-container">
            <router-view />
        </div>
    </div>
</template>


<style scoped lang="scss">

.admin-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.router-container {
    overflow: auto;
    height: 100%;
}
</style>