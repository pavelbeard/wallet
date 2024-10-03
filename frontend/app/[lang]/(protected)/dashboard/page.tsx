import { getI18n } from "@/locales/server";
import SignOutForm from "@/app/[lang]/_components/dashboard/forms/sign-out-form";

export default async function Page(props: { searchParams: { callbackUrl: string | undefined } }) {
    return (
        <div>
            <SignOutForm />
        </div>
    );
}

export async function generateMetadata({ params }: { params?: any }) {
    const t = await getI18n();
    return {
        title: t('dashboardPage.title'),
        description: t('dashboardPage.description'),
    }
}
