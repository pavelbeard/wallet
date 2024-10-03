import { createI18nServer } from "next-international/server";

export const {
    getI18n,
    getScopedI18n,
    getCurrentLocale,
    getStaticParams,
} = createI18nServer({
    "en-US": () => import("./en-US"),
    es: () => import('./es'),
}, {
    //@ts-ignore
    fallbackLocale: "en-US",
    segmentName: "lang",
})