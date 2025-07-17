import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import About from "./About";

describe("About", () => {
  it("rendert die About-Seite mit Schichtplaner-Informationen", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    
    expect(screen.getByText("Schichtplaner")).toBeInTheDocument();
    expect(screen.getByText("1.0.0")).toBeInTheDocument();
    expect(screen.getByText("Credits")).toBeInTheDocument();
    expect(screen.getByText("Lizenz")).toBeInTheDocument();
  });

  it("enthält Links zu GitHub und anderen Ressourcen", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Homepage")).toBeInTheDocument();
    expect(screen.getByText("Dokumentation")).toBeInTheDocument();
  });

  it("zeigt die MIT-Lizenz-Informationen", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    
    expect(screen.getByText("MIT License")).toBeInTheDocument();
    // Der Copyright-Text ist in einem pre-Element, daher verwenden wir eine flexiblere Suche
    expect(screen.getByText(/Copyright \(c\) 2024 Carsten Bröckert/)).toBeInTheDocument();
  });

  it("enthält Credits für verwendete Bibliotheken", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    
    expect(screen.getByText("React:")).toBeInTheDocument();
    expect(screen.getByText("TypeScript:")).toBeInTheDocument();
    expect(screen.getByText("Vite:")).toBeInTheDocument();
    expect(screen.getByText("Tabler:")).toBeInTheDocument();
  });

  it("zeigt Lizenz-Berechtigungen und Einschränkungen", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    
    expect(screen.getByText("Berechtigungen")).toBeInTheDocument();
    expect(screen.getByText("Einschränkungen")).toBeInTheDocument();
    expect(screen.getByText("Bedingungen")).toBeInTheDocument();
    expect(screen.getByText("Kommerzielle Nutzung")).toBeInTheDocument();
    expect(screen.getByText("Haftung")).toBeInTheDocument();
  });
}); 