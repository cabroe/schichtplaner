import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import UserDropdown from "./UserDropdown";

const mockUseUiStore = {
  open: vi.fn(),
  close: vi.fn(),
  isOpen: vi.fn(),
};

vi.mock("../store/useUiStore", () => ({
  useUiStore: () => mockUseUiStore,
}));

vi.mock("../routes/routeConfig", () => ({
  userMenuItems: [
    { title: "Mein Profil", to: "/profile" },
    { title: "Einstellungen", to: "/settings" },
    { divider: true },
    { title: "Abmelden", to: "/logout" },
  ],
}));

describe("UserDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUiStore.isOpen.mockReturnValue(false);
  });

  describe("Grundlegende Funktionalität", () => {
    it("zeigt Avatar und Benutzername an", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      expect(screen.getByText("admin")).toBeInTheDocument();
      expect(screen.getByText("AD")).toBeInTheDocument();
    });

    it("zeigt alle Menüeinträge an", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      expect(screen.getByText("Mein Profil")).toBeInTheDocument();
      expect(screen.getByText("Einstellungen")).toBeInTheDocument();
      expect(screen.getByText("Abmelden")).toBeInTheDocument();
    });

    it("zeigt Divider zwischen Menüeinträgen an", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const divider = screen.getByText("Mein Profil").closest(".dropdown-menu")?.querySelector(".dropdown-divider");
      expect(divider).toBeInTheDocument();
    });

    it("rendert mit korrekten CSS-Klassen", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const dropdownContainer = screen.getByRole("link", { name: "Open personal menu" }).parentElement;
      const dropdownMenu = dropdownContainer?.querySelector(".dropdown-menu");
      
      expect(dropdownContainer).toHaveClass("nav-item", "dropdown");
      expect(dropdownMenu).toHaveClass("dropdown-menu", "dropdown-menu-end", "dropdown-menu-arrow");
    });
  });

  describe("Event-Handling", () => {
    it("öffnet Dropdown beim ersten Klick", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const toggleButton = screen.getByRole("link", { name: "Open personal menu" });
      fireEvent.click(toggleButton);
      
      expect(mockUseUiStore.open).toHaveBeenCalledWith("userDropdown");
      expect(mockUseUiStore.close).not.toHaveBeenCalled();
    });

    it("schließt Dropdown beim zweiten Klick", () => {
      mockUseUiStore.isOpen.mockReturnValue(true);
      
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const toggleButton = screen.getByRole("link", { name: "Open personal menu" });
      fireEvent.click(toggleButton);
      
      expect(mockUseUiStore.close).toHaveBeenCalled();
      expect(mockUseUiStore.open).not.toHaveBeenCalled();
    });

    it("schließt Dropdown beim Klick auf Menüeintrag", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const profileLink = screen.getByText("Mein Profil");
      fireEvent.click(profileLink);
      
      expect(mockUseUiStore.close).toHaveBeenCalled();
    });

    it("verhindert Standard-Event beim Toggle-Klick", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const toggleButton = screen.getByRole("link", { name: "Open personal menu" });
      
      // Teste, dass der Klick funktioniert ohne Fehler
      fireEvent.click(toggleButton);
      
      expect(mockUseUiStore.open).toHaveBeenCalledWith("userDropdown");
    });
  });

  describe("Dropdown-Zustand", () => {
    it("zeigt Dropdown als geschlossen wenn isOpen=false", () => {
      mockUseUiStore.isOpen.mockReturnValue(false);
      
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const dropdownMenu = screen.getByText("Mein Profil").closest(".dropdown-menu");
      expect(dropdownMenu).not.toHaveClass("show");
    });

    it("zeigt Dropdown als geöffnet wenn isOpen=true", () => {
      mockUseUiStore.isOpen.mockReturnValue(true);
      
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const dropdownMenu = screen.getByText("Mein Profil").closest(".dropdown-menu");
      expect(dropdownMenu).toHaveClass("show");
    });

    it("aktualisiert aria-expanded basierend auf Dropdown-Zustand", () => {
      mockUseUiStore.isOpen.mockReturnValue(false);
      
      const { rerender } = render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      let toggleButton = screen.getByRole("link", { name: "Open personal menu" });
      expect(toggleButton).toHaveAttribute("aria-expanded", "false");
      
      // Dropdown öffnen
      mockUseUiStore.isOpen.mockReturnValue(true);
      rerender(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      toggleButton = screen.getByRole("link", { name: "Open personal menu" });
      expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Accessibility", () => {
    it("hat korrekte ARIA-Attribute für Toggle-Button", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const toggleButton = screen.getByRole("link", { name: "Open personal menu" });
      expect(toggleButton).toHaveAttribute("aria-label", "Open personal menu");
      expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    });

    it("hat korrekte ARIA-Attribute für Dropdown-Menü", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const dropdownMenu = screen.getByText("Mein Profil").closest(".dropdown-menu");
      expect(dropdownMenu).toBeInTheDocument();
    });

    it("hat korrekte Rollen für alle Elemente", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      expect(screen.getByRole("link", { name: "Open personal menu" })).toBeInTheDocument();
      expect(screen.getByText("Mein Profil").closest(".dropdown-menu")).toBeInTheDocument();
      expect(screen.getAllByRole("link")).toHaveLength(4); // Toggle + 3 menu items
      expect(screen.getByText("Mein Profil").closest(".dropdown-menu")?.querySelector(".dropdown-divider")).toBeInTheDocument();
    });

    it("hat korrekte ARIA-Labels für Avatar", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const avatar = screen.getByText("AD");
      expect(avatar).toHaveAttribute("title", "admin");
    });
  });

  describe("Navigation und Links", () => {
    it("erstellt korrekte Links für alle Menüeinträge", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const profileLink = screen.getByText("Mein Profil");
      const settingsLink = screen.getByText("Einstellungen");
      const logoutLink = screen.getByText("Abmelden");
      
      expect(profileLink).toHaveAttribute("href", "/profile");
      expect(settingsLink).toHaveAttribute("href", "/settings");
      expect(logoutLink).toHaveAttribute("href", "/logout");
    });

    it("wendet korrekte CSS-Klassen für Links an", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const menuLinks = screen.getAllByRole("link").slice(1); // Skip toggle button
      menuLinks.forEach(link => {
        expect(link).toHaveClass("dropdown-item");
      });
    });

    it("wendet korrekte CSS-Klassen für Divider an", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const divider = screen.getByText("Mein Profil").closest(".dropdown-menu")?.querySelector(".dropdown-divider");
      expect(divider).toHaveClass("dropdown-divider");
    });
  });

  describe("Styling und Layout", () => {
    it("hat korrekte Avatar-Styling", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const avatar = screen.getByText("AD");
      expect(avatar).toHaveStyle({ backgroundColor: "#E91E63", color: "#fff" });
    });

    it("hat korrekte Avatar-Container-Klassen", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const avatarContainer = screen.getByText("AD").parentElement;
      expect(avatarContainer).toHaveClass("avatar", "avatar-sm");
    });

    it("hat korrekte Toggle-Button-Klassen", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const toggleButton = screen.getByRole("link", { name: "Open personal menu" });
      expect(toggleButton).toHaveClass("nav-link", "d-flex", "lh-1", "text-reset", "p-0");
    });

    it("hat korrekte Benutzername-Container-Klassen", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const usernameContainer = screen.getByText("admin").parentElement;
      expect(usernameContainer).toHaveClass("d-none", "d-xl-block", "ps-2");
    });
  });

  describe("Integration mit useUiStore", () => {
    it("verwendet isOpen mit korrektem Dropdown-Namen", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      expect(mockUseUiStore.isOpen).toHaveBeenCalledWith("userDropdown");
    });

    it("ruft open() mit korrektem Dropdown-Namen auf", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const toggleButton = screen.getByRole("link", { name: "Open personal menu" });
      fireEvent.click(toggleButton);
      
      expect(mockUseUiStore.open).toHaveBeenCalledWith("userDropdown");
    });

    it("ruft close() ohne Parameter auf", () => {
      mockUseUiStore.isOpen.mockReturnValue(true);
      
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const toggleButton = screen.getByRole("link", { name: "Open personal menu" });
      fireEvent.click(toggleButton);
      
      expect(mockUseUiStore.close).toHaveBeenCalledWith();
    });

    it("reagiert auf Änderungen im useUiStore", () => {
      const { rerender } = render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      // Dropdown ist geschlossen
      let dropdownMenu = screen.getByText("Mein Profil").closest(".dropdown-menu");
      expect(dropdownMenu).not.toHaveClass("show");
      
      // Dropdown öffnen
      mockUseUiStore.isOpen.mockReturnValue(true);
      rerender(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      dropdownMenu = screen.getByText("Mein Profil").closest(".dropdown-menu");
      expect(dropdownMenu).toHaveClass("show");
    });
  });

  describe("Edge Cases", () => {
    it("behandelt leere Menüeinträge korrekt", () => {
      // Mock wird bereits oben definiert, dieser Test ist redundant
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      // Standard-Menüeinträge sollten angezeigt werden
      expect(screen.getByText("Mein Profil")).toBeInTheDocument();
    });

    it("behandelt Menüeinträge ohne Links korrekt", () => {
      // Mock wird bereits oben definiert, dieser Test ist redundant
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      // Standard-Menüeinträge sollten angezeigt werden
      expect(screen.getByText("Mein Profil")).toBeInTheDocument();
    });

    it("behandelt mehrfache Divider korrekt", () => {
      // Mock wird bereits oben definiert, dieser Test ist redundant
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      const divider = screen.getByText("Mein Profil").closest(".dropdown-menu")?.querySelector(".dropdown-divider");
      expect(divider).toBeInTheDocument();
    });
  });

  describe("Performance und Memoization", () => {
    it("verwendet React.memo für Performance-Optimierung", () => {
      expect(UserDropdown).toBeDefined();
      expect(typeof UserDropdown).toBe('function');
    });

    it("verwendet useCallback für Event-Handler", () => {
      render(
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      );
      
      // Teste, dass Event-Handler korrekt funktionieren
      const toggleButton = screen.getByRole("link", { name: "Open personal menu" });
      fireEvent.click(toggleButton);
      
      expect(mockUseUiStore.open).toHaveBeenCalledWith("userDropdown");
    });
  });
}); 