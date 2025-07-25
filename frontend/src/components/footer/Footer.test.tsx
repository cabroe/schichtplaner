import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer", () => {
  it("rendert den Footer mit Copyright und Links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Copyright ©/)).toBeInTheDocument();
    expect(screen.getByText("Carsten Bröckert")).toBeInTheDocument();
    expect(screen.getByText("Über Schichtplaner")).toBeInTheDocument();
  });

  it("hat die korrekten CSS-Klassen", () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    
    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("footer", "footer-transparent", "d-print-none");
  });

  it("enthält Links mit korrekten Attributen", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    
    const carstenLink = screen.getByText("Carsten Bröckert");
    expect(carstenLink).toHaveAttribute("href", "https://www.kasit.de/");
    expect(carstenLink).toHaveAttribute("target", "_blank");
    expect(carstenLink).toHaveAttribute("rel", "noopener noreferrer");
    
    const aboutLink = screen.getByText("Über Schichtplaner");
    expect(aboutLink).toHaveAttribute("href", "/about");
  });
}); 