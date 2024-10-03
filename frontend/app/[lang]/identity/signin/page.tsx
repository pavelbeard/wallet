import { getI18n }  from "@/locales/server";
import SignInForm from "@/app/[lang]/_components/identity/forms/sign-in-form";

export default async function Page(props: { searchParams: { callbackUrl: string | undefined } }) {
    const t = await getI18n();
    return (
        <main>
            <section>
                <h2>{t('auth.credentialsTitle')}</h2>
                <SignInForm/>
            </section>
        </main>
    );
}

export async function generateMetadata({ params }: { params?: any }) {
    const t = await getI18n();
    return {
        title: t('signInPage.title'),
        description: t('signInPage.description')
    }
}