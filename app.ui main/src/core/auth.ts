import type { Auth0Plugin } from '@auth0/auth0-vue'
import { createAuth0 } from '@auth0/auth0-vue'
import { useMainStore } from '@store/main.ts';
import { AuthorStatus } from '@interface/Author.ts';
import { RecommendationRules } from '@interface/Recommendation.ts';

const client: Auth0Plugin = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    useRefreshTokens: true,
    authorizationParams: {
        redirect_uri: (window.location.origin + import.meta.env.VITE_AUTH0_CALLBACK_URL),
        scope: 'openid profile email',
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
    },
    cacheLocation: 'localstorage',
})

const getAccessToken = async () => {
    return await client.getAccessTokenSilently();
}
const login = async () => {
    await client.loginWithRedirect();
}

const handleRedirectCallback = async () => {
    await client.handleRedirectCallback();
}

const logout = async () => {
    const store = useMainStore();
    store.updateUserInfo({} as AuthorStatus);
    store.updateRules({} as RecommendationRules);
    await client.logout({
        logoutParams: {
            returnTo: window.location.origin,
        }
    });
}

const isAuthenticated = () => {
    return client.isAuthenticated.value;
}

const isLoading = () => {
    return client.isLoading.value;
}
const getUser = () => {
    return client.user;
}

export default client;
export { getAccessToken, login, handleRedirectCallback, logout, isAuthenticated, isLoading, getUser };
