import { getTranslations } from "next-intl/server";
import Card from "@/app/ui/card";
import { Link } from "@/i18n/routing";
import { LocaleProps } from "@/i18n/types";

export async function generateMetadata({ params: { locale } }: LocaleProps) {
    const t = await getTranslations({
        locale,
        namespace: 'mainPage'
    });
    return {
        title: t('title'),
        description: t('description')
    }
}

export default async function Home({ params: { locale } }: LocaleProps) {
    const t = await getTranslations({
        locale,
        namespace: 'mainPage'
    });
    return (
        <div className="flex flex-col items-center mt-12 w-full">
            <section className="flex flex-col items-center gap-4 max-w-[300px] lg:max-w-[600px]">
                <h1 className="text-xl lg:text-3xl text-white font-bold text-center">
                    {t('page.title')}
                </h1>
                <p className="text-xl lg:text-3xl text-white font-bold text-center">
                    {t('page.appDescription')}
                </p>
            </section>
            <Card>
                <div className="flex flex-col lg:flex-row gap-4 lg:justify-center p-4">
                    <Link
                        locale={locale}
                        className="text-center"
                        href={"/auth/sign-in"}
                    >
                        {t('page.signIn')}
                    </Link>
                    <Link
                        locale={locale}
                        className="text-center"
                        href={"/auth/sign-up"}
                    >
                        {t('page.signUp')}
                    </Link>
                </div>
            </Card>
        </div>
    );
}
