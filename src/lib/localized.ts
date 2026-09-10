/**
 * Picks the Arabic version of a field on the Arabic site, falling back to the
 * English text when no translation has been entered yet. That way the
 * catalogue can be translated gradually without anything showing blank.
 */
export function pickLocale(locale: string, en: string, ar?: string | null): string {
    if (locale === 'ar' && ar && ar.trim() !== '') return ar;
    return en;
}
