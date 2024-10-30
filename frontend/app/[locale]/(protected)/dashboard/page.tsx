import Submit from "@/app/ui/submit";
import { auth, signOut } from "@/auth";
import Client from "@/app/components/dashboard/client";
import { SessionProvider } from "next-auth/react";
import { LangProps } from "@/app/lib/types";
import { redirect, RedirectType } from "next/navigation";
import { DEFAULT_SIGNED_OUT_PATH } from "@/routes";


export default async function Page({ params: { lang } }: LangProps) {
    const session = await auth();
    return (
        <div>
            Dashboard
            {JSON.stringify(session)}
            <form action={async() => {
                "use server"
                await signOut({ redirect: false });
                redirect(DEFAULT_SIGNED_OUT_PATH, RedirectType.replace)
            }}>
                <Submit>
                    Sign out
                </Submit>
            </form>
            <div>
                <SessionProvider>
                    <Client />
                </SessionProvider>
            </div>
        </div>
    );
}