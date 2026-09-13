import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
    locales: ['en', 'ar'],
    defaultLocale: 'ar',
    localePrefix: 'as-needed',
    // Always open in Arabic regardless of the browser language; English is
    // reached only through the /en prefix (the header switcher).
    localeDetection: false
})