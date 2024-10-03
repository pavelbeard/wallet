import { createI18nClient } from "next-international/client";

export const {
    useI18n,
    useScopedI18n,
    I18nProviderClient,
    useChangeLocale,
    defineLocale,
    useCurrentLocale,
} = createI18nClient({
    "en-US": async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return import('./en-US');
    },
    es: async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return import('./es');
    }
}, {
    //@ts-ignore
    fallbackLocale: "en-US",
    segmentName: "lang",
})