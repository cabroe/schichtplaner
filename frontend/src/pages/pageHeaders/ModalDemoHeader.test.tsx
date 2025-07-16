import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalDemoHeader from "./ModalDemoHeader";

describe("ModalDemoHeader", () => {
  it("rendert den Titel Modal-Demo", () => {
    render(<ModalDemoHeader />);
    expect(screen.getByText("Modal Demo")).toBeInTheDocument();
  });
}); 