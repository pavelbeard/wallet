import Link from "next/link";
import { getI18n } from "@/locales/server";
import CardWrapper from "@/app/[lang]/_components/ui/card-wrapper";

export default async function Home({
    params: { locale },
} : {
    params: { locale: string }
}) {
    const t = await getI18n();
    return (
        <main className="flex flex-col items-center">
            <section className="__Text-wrapper-main-page">
                <p className="__Text-style-main-page">{t('mainPageText1')}</p>
                <p className="__Text-style-main-page">{t('mainPageText2')}</p>
            </section>
            <section className="__Text-wrapper-main-page">
                <p className="__Text-style-main-page">{t('mainPageText3')}</p>
            </section>
            <section className="__Text-wrapper-main-page">
                <p className="__Text-style-main-page">{t('mainPageText4')}</p>
                <p className="__Text-style-main-page">{t('mainPageText5')}</p>
            </section>
            <CardWrapper>
                <div className="flex flex-col items-center lg:flex-row ">
                    <Link href={`/identity/signin`} className="__Link-hover">{t('mainPageSignIn')}</Link>
                    <Link href={`/identity/signup`} className="__Link-hover">{t('mainPageSignUp')}</Link>
                </div>
            </CardWrapper>
        </main>
    );
}

export async function generateMetadata({ params }: { params?: any }) {
    const t = await getI18n();
    return {
        title: t('mainPage.title'),
        description: t('mainPage.description')
    }
}