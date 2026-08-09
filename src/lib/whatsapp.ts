/**
 * WhatsApp is the primary way buyers get in touch, so the number lives here
 * rather than being scattered through components.
 */
export const WHATSAPP_NUMBER = '201208959772';

/**
 * Prefilled messages are always Arabic, whichever language the visitor is
 * browsing in — they land on the owner's phone, not the visitor's screen.
 * That is why these are plain constants rather than translation keys.
 */
export const whatsappMessages = {
    /** Product page: asks about one product by name. */
    product: (productName: string) =>
        `مرحباً، أود الاستفسار عن ${productName}. هل يمكنكم إرسال أسعار الجملة والتوافر؟`,

    /** Contact page: general enquiry. */
    general: () => 'مرحباً، أود الاستفسار عن منتجاتكم.',

    /** Homepage: a retailer interested in stocking the range. */
    stocking: () =>
        'مرحباً، أنا مهتم بتوفير منتجاتكم في محلي. هل يمكنكم إرسال أسعار الجملة؟',
};

/**
 * Builds a wa.me link with the message already written, so the buyer only has
 * to press send.
 */
export function buildWhatsAppUrl(message: string): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
