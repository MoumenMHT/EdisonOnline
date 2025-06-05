import { useMyFetch } from '@core/api.ts';
import { PaymentProduct } from '@interface/Payment.ts';

interface paymentPurchase {
    paymentUrl: string;
}

export const PaymentService = {
    getProducts() {
        return useMyFetch('payment/products/').json<PaymentProduct[]>();
    },
    buyProduct(id: string, fetchError?: (ctx) => void) {
        return useMyFetch(
            'payment/purchase/?productId=' + id,
            {
                method: 'POST',
            },
            {
                onFetchError(ctx) {
                    if (fetchError !== undefined) {
                        fetchError(ctx);
                    }
                    
                    return ctx;
                },
            }
        ).json<paymentPurchase>();
    }
}