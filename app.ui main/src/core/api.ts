import { createFetch } from "@vueuse/core";
import { getAccessToken, isAuthenticated } from '@core/auth.ts';

export const useMyFetch = createFetch({
    baseUrl: '/api',
    options: {
        async beforeFetch({ options }) {
            if (isAuthenticated()) {
                const myToken = await getAccessToken();
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${myToken}`,
                }
            }
            return { options }
        },
        onFetchError(ctx) {
            console.error('FETCH ERROR', ctx);
            return ctx
        },
    },
})
