import { useMyFetch } from '@core/api.ts';
import { FAQ } from '@interface/FAQ.ts';

export const FaqService = {
    getAllFAQs() {
        return useMyFetch('faq/', { refetch: true }).json<FAQ[]>();
    }
}
