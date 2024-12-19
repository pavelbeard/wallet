"use client";

import Card from "@/app/ui/card";
import FormTitle from "@/app/ui/form-title";
import Submit from "@/app/ui/submit";

export default function MasterPassword() {
  return (
    <Card>
      <form>
        <FormTitle>Generate master password</FormTitle>
        <Submit ariaLabel="Generate master password">
          Generate master password
        </Submit>
      </form>
    </Card>
  );
}
