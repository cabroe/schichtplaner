import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainTemplate from "./MainTemplate";
import { MemoryRouter } from "react-router-dom";

vi.mock("../components/Sidebar", () => ({ default: () => <div data-testid="sidebar" /> }));
vi.mock("../components/HeaderWithRoute", () => ({ default: () => <div data-testid="header" /> }));
vi.mock("../components/PageHeader", () => ({ default: ({ children }: any) => <div data-testid="pageheader">{children}</div> }));
vi.mock("../utils/routeUtils", () => ({ getHeaderComponentForRoute: () => undefined }));

describe("MainTemplate", () => {
  it("rendert Sidebar, HeaderWithRoute, PageHeader und children", () => {
    render(
      <MemoryRouter>
        <MainTemplate>
          <div data-testid="content">Testinhalt</div>
        </MainTemplate>
      </MemoryRouter>
    );
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("pageheader")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });
}); 