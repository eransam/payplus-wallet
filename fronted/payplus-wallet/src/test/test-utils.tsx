import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import uiReducer from "../store/slices/uiSlice";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function createTestStore() {
  return configureStore({
    reducer: { ui: uiReducer },
  });
}

type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper">;

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderWithProvidersOptions,
) {
  const queryClient = createTestQueryClient();
  const store = createTestStore();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Provider>
    );
  }

  return {
    queryClient,
    store,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}
