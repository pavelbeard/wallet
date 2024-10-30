import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "@/app/[locale]/page";

test('should render the home page', async () => {
    render(<Page params={{ locale: 'es' }} />);

    const signInText = screen.getByText('Ir a iniciar sesión');
    expect(signInText.innerText).toContain('Ir a iniciar sesión');
});