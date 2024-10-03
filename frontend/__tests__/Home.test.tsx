import { render, screen } from '@testing-library/react';
import Home from "@/app/[lang]/page";

it('Should contain Home text', () => {
    render(<Home />) // ARRAIGN

    const myElem = screen.getByText('Home') // ACT

    expect(myElem).toBeInTheDocument();
})