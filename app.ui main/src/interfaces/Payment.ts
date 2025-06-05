/**
 *
 * @export
 * @enum {string}
 */
export enum AccessLevel {
    None = 'NONE',
    Standard = 'STANDARD',
    Premium = 'PREMIUM'
}
/**
 * mandatory for SUBSCRIPTION, not allowed for ONE_TIME
 * @export
 * @enum {string}
 */
export enum BillingInterval {
    Monthly = 'MONTHLY',
    Quarterly = 'QUARTERLY'
}
/**
 *
 * @export
 * @enum {string}
 */
export enum PaymentProductType {
    Purchase = 'PURCHASE',
    Subscription = 'SUBSCRIPTION'
}
/**
 *
 * @export
 * @enum {string}
 */
export enum PurchaseStatus {
    Pending = 'PENDING',
    Completed = 'COMPLETED',
    Cancelled = 'CANCELLED',
    SessionExpired = 'SESSION_EXPIRED'
}

/**
 *
 * @export
 * @enum {string}
 */
export enum SubscriptionLevel {
    Standard = 'STANDARD',
    Premium = 'PREMIUM'
}

/**
 * Overall status:
 * `INACTIVE` - Initial state until subscription has been payed
 * `ACTIVE` - Subscription is active
 * `CANCELLED` - Subscription has been cancelled, but is still active until it expires
 * `EXPIRED` - Subscription has expired and is no longer active

 * @export
 * @enum {string}
 */
export enum SubscriptionStatus {
    Inactive = 'INACTIVE',
    Active = 'ACTIVE',
    Cancelled = 'CANCELLED',
    Expired = 'EXPIRED'
}
/**
 *
 * @export
 * @enum {string}
 */
export enum InvoiceType {
    Payment = 'PAYMENT',
    PaymentFailure = 'PAYMENT_FAILURE'
}
/**
 *
 * @export
 * @interface PaymentProductBulletPoint
 */
export interface PaymentProductBulletPoint {
    /**
     *
     * @type {string}
     * @memberof PaymentProductBulletPoint
     */
    icon?: string;
    /**
     *
     * @type {string}
     * @memberof PaymentProductBulletPoint
     */
    text: string;
}
/**
 *
 * @export
 * @interface AdminPaymentProduct
 */
export interface AdminPaymentProduct {
    /**
     *
     * @type {string}
     * @memberof AdminPaymentProduct
     */
    id?: string;
    /**
     *
     * @type {string}
     * @memberof AdminPaymentProduct
     */
    name: string;
    /**
     *
     * @type {string}
     * @memberof AdminPaymentProduct
     */
    description: string;
    /**
     *
     * @type {PaymentProductType}
     * @memberof AdminPaymentProduct
     */
    productType: PaymentProductType;
    /**
     * Price in the smallest unit of the currency (øre for DKK). If SUBSCRIPTION this is per billing interval.
     * @type {number}
     * @memberof AdminPaymentProduct
     */
    price: number;
    /**
     *
     * @type {string}
     * @memberof AdminPaymentProduct
     */
    currency: string;
    /**
     * if SUBSCRIPTION this is per month
     * @type {number}
     * @memberof AdminPaymentProduct
     */
    uploads: number;
    /**
     *
     * @type {SubscriptionLevel}
     * @memberof AdminPaymentProduct
     */
    subscriptionLevel?: SubscriptionLevel;
    /**
     *
     * @type {BillingInterval}
     * @memberof AdminPaymentProduct
     */
    billingInterval?: BillingInterval;
    /**
     *
     * @type {Array<PaymentProductBulletPoint>}
     * @memberof AdminPaymentProduct
     */
    bullets?: Array<PaymentProductBulletPoint>;
    /**
     * a unique code that ensures products are not duplicated
     * @type {string}
     * @memberof AdminPaymentProduct
     */
    code: string;
    /**
     *
     * @type {boolean}
     * @memberof AdminPaymentProduct
     */
    active: boolean;
}
/**
 *
 * @export
 * @interface AdminPaymentProductAllOf
 */
export interface AdminPaymentProductAllOf {
    /**
     * a unique code that ensures products are not duplicated
     * @type {string}
     * @memberof AdminPaymentProductAllOf
     */
    code: string;
    /**
     *
     * @type {boolean}
     * @memberof AdminPaymentProductAllOf
     */
    active: boolean;
}
/**
 *
 * @export
 * @interface PageOfPaymentProduct
 */
export interface PageOfPaymentProduct {
    /**
     *
     * @type {number}
     * @memberof PageOfPaymentProduct
     */
    page: number;
    /**
     *
     * @type {number}
     * @memberof PageOfPaymentProduct
     */
    pageSize: number;
    /**
     *
     * @type {number}
     * @memberof PageOfPaymentProduct
     */
    totalPages: number;
    /**
     *
     * @type {number}
     * @memberof PageOfPaymentProduct
     */
    totalElements: number;
    /**
     *
     * @type {Array<PaymentProduct>}
     * @memberof PageOfPaymentProduct
     */
    content: Array<PaymentProduct>;
}
/**
 *
 * @export
 * @interface PageOfPurchase
 */
export interface PageOfPurchase {
    /**
     *
     * @type {number}
     * @memberof PageOfPurchase
     */
    page: number;
    /**
     *
     * @type {number}
     * @memberof PageOfPurchase
     */
    pageSize: number;
    /**
     *
     * @type {number}
     * @memberof PageOfPurchase
     */
    totalPages: number;
    /**
     *
     * @type {number}
     * @memberof PageOfPurchase
     */
    totalElements: number;
    /**
     *
     * @type {Array<Purchase>}
     * @memberof PageOfPurchase
     */
    content: Array<Purchase>;
}
/**
 *
 * @export
 * @interface PageOfSubscription
 */
export interface PageOfSubscription {
    /**
     *
     * @type {number}
     * @memberof PageOfSubscription
     */
    page: number;
    /**
     *
     * @type {number}
     * @memberof PageOfSubscription
     */
    pageSize: number;
    /**
     *
     * @type {number}
     * @memberof PageOfSubscription
     */
    totalPages: number;
    /**
     *
     * @type {number}
     * @memberof PageOfSubscription
     */
    totalElements: number;
    /**
     *
     * @type {Array<Subscription>}
     * @memberof PageOfSubscription
     */
    content: Array<Subscription>;
}
/**
 *
 * @export
 * @interface PageOfInvoice
 */
export interface PageOfInvoice {
    /**
     *
     * @type {number}
     * @memberof PageOfInvoice
     */
    page: number;
    /**
     *
     * @type {number}
     * @memberof PageOfInvoice
     */
    pageSize: number;
    /**
     *
     * @type {number}
     * @memberof PageOfInvoice
     */
    totalPages: number;
    /**
     *
     * @type {number}
     * @memberof PageOfInvoice
     */
    totalElements: number;
    /**
     *
     * @type {Array<Invoice>}
     * @memberof PageOfInvoice
     */
    content: Array<Invoice>;
}

/**
 *
 * @export
 * @interface Subscription
 */
export interface Subscription {
    /**
     *
     * @type {PaymentProduct}
     * @memberof Subscription
     */
    product: PaymentProduct;
    /**
     *
     * @type {SubscriptionStatus}
     * @memberof Subscription
     */
    status: SubscriptionStatus;
    /**
     *
     * @type {SubscriptionLevel}
     * @memberof Subscription
     */
    level: SubscriptionLevel;
    /**
     *
     * @type {string}
     * @memberof Subscription
     */
    activated?: string;
    /**
     *
     * @type {string}
     * @memberof Subscription
     */
    cancelled?: string;
    /**
     *
     * @type {string}
     * @memberof Subscription
     */
    subscriptionStart?: string;
    /**
     *
     * @type {string}
     * @memberof Subscription
     */
    subscriptionEnd?: string;
    /**
     *
     * @type {string}
     * @memberof Subscription
     */
    currentPeriodStart?: string;
    /**
     *
     * @type {string}
     * @memberof Subscription
     */
    currentPeriodEnd?: string;
}
/**
 *
 * @export
 * @interface PaymentProduct
 */
export interface PaymentProduct {
    /**
     *
     * @type {string}
     * @memberof PaymentProduct
     */
    id?: string;
    /**
     *
     * @type {string}
     * @memberof PaymentProduct
     */
    name: string;
    /**
     *
     * @type {string}
     * @memberof PaymentProduct
     */
    description: string;
    /**
     *
     * @type {PaymentProductType}
     * @memberof PaymentProduct
     */
    productType: PaymentProductType;
    /**
     * Price in the smallest unit of the currency (øre for DKK). If SUBSCRIPTION this is per billing interval.
     * @type {number}
     * @memberof PaymentProduct
     */
    price: number;
    /**
     *
     * @type {string}
     * @memberof PaymentProduct
     */
    currency: string;
    /**
     * if SUBSCRIPTION this is per month
     * @type {number}
     * @memberof PaymentProduct
     */
    uploads: number;
    /**
     *
     * @type {SubscriptionLevel}
     * @memberof PaymentProduct
     */
    subscriptionLevel?: SubscriptionLevel;
    /**
     *
     * @type {BillingInterval}
     * @memberof PaymentProduct
     */
    billingInterval?: BillingInterval;
    /**
     *
     * @type {Array<PaymentProductBulletPoint>}
     * @memberof PaymentProduct
     */
    bullets?: Array<PaymentProductBulletPoint>;
}

/**
 *
 * @export
 * @interface Purchase
 */
export interface Purchase {
    /**
     *
     * @type {PaymentProduct}
     * @memberof Purchase
     */
    product: PaymentProduct;
    /**
     * Price in the smallest unit of the currency (øre for DKK). If SUBSCRIPTION this is per billing interval.
     * @type {number}
     * @memberof Purchase
     */
    price?: number;
    /**
     *
     * @type {string}
     * @memberof Purchase
     */
    currency?: string;
    /**
     *
     * @type {PurchaseStatus}
     * @memberof Purchase
     */
    status: PurchaseStatus;
    /**
     *
     * @type {string}
     * @memberof Purchase
     */
    created: string;
}
/**
 *
 * @export
 * @interface Invoice
 */
export interface Invoice {
    /**
     *
     * @type {string}
     * @memberof Invoice
     */
    id: string;
    /**
     *
     * @type {string}
     * @memberof Invoice
     */
    productName: string;
    /**
     *
     * @type {InvoiceType}
     * @memberof Invoice
     */
    type: InvoiceType;
    /**
     *
     * @type {number}
     * @memberof Invoice
     */
    amountPaid: number;
    /**
     *
     * @type {number}
     * @memberof Invoice
     */
    amountDue?: number;
    /**
     *
     * @type {string}
     * @memberof Invoice
     */
    currency: string;
    /**
     *
     * @type {string}
     * @memberof Invoice
     */
    periodStart?: string;
    /**
     *
     * @type {string}
     * @memberof Invoice
     */
    periodEnd?: string;
    /**
     *
     * @type {string}
     * @memberof Invoice
     */
    hostedInvoiceUrl?: string;
    /**
     *
     * @type {string}
     * @memberof Invoice
     */
    pdfInvoiceUrl?: string;
    /**
     *
     * @type {string}
     * @memberof Invoice
     */
    created: string;
}
