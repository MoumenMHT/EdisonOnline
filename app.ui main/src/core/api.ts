/*
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
*/

import { createFetch } from "@vueuse/core";
import { getAccessToken, isAuthenticated } from '@core/auth.ts';

const MAINTENANCE_MODE = true; // 🚫 Set to true to block all API calls

export const useMyFetch = createFetch({
  baseUrl: '/api',
  options: {
    async beforeFetch({ options, cancel }) {
      if (MAINTENANCE_MODE) {
        console.warn('🚧 API request blocked due to maintenance mode');
        cancel(); // 🔥 This cancels the request cleanly
        return { options };
      }

      if (isAuthenticated()) {
        const myToken = await getAccessToken();
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${myToken}`,
        };
      }

      return { options };
    },

    onFetchError(ctx) {
      console.error('FETCH ERROR', ctx);
      return ctx;
    },
  },
});
