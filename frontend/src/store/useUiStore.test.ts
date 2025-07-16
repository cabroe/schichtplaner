import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { useUiStore } from "./useUiStore";

// Zustand-Store nach jedem Test zurücksetzen
beforeEach(() => {
  useUiStore.setState({ openMenu: null });
});

describe("useUiStore", () => {
  it("hat initial openMenu null", () => {
    expect(useUiStore.getState().openMenu).toBeNull();
  });

  it("open setzt openMenu auf den Namen", () => {
    act(() => {
      useUiStore.getState().open("testMenu");
    });
    expect(useUiStore.getState().openMenu).toBe("testMenu");
  });

  it("close setzt openMenu wieder auf null", () => {
    act(() => {
      useUiStore.getState().open("testMenu");
      useUiStore.getState().close();
    });
    expect(useUiStore.getState().openMenu).toBeNull();
  });

  it("isOpen gibt true zurück, wenn das Menü offen ist", () => {
    act(() => {
      useUiStore.getState().open("menu1");
    });
    expect(useUiStore.getState().isOpen("menu1")).toBe(true);
    expect(useUiStore.getState().isOpen("menu2")).toBe(false);
  });
}); 