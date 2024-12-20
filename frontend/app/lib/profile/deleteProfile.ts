"use server";

import getTranslations from "@/app/lib/helpers/getTranslations";
import protectedQuery from "@/app/lib/helpers/protectedQuery";

export default async function deleteProfile(public_id: string) {
  const t = await getTranslations();
  const result = await protectedQuery({
    url: `/users/${public_id}/`,
    method: "DELETE",
  });

  if (result instanceof Error) {
    return {
      success: null,
      error: t("error.somethingWentWrong"),
    };
  }

  if (!result?.ok) {
    return {
      success: null,
      error: t("profile.userCard.deleteRequest.error"),
    };
  }

  if (result?.ok) {
    return {
      success: t("profile.userCard.deleteRequest.success"),
      error: null,
    };
  }

  return {
    success: null,
    error: null,
  };
}
