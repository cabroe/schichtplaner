import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ToastDemoHeader from "./ToastDemoHeader";

describe("ToastDemoHeader", () => {
  it("rendert den Titel Toast-Demo", () => {
    render(<ToastDemoHeader />);
    expect(screen.getByText("Toast Demo")).toBeInTheDocument();
  });
}); 