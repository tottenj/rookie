import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react-native";
import { HeroUINativeProvider } from "heroui-native";
import type { PropsWithChildren, ReactElement } from "react";

type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  queryClient?: QueryClient;
};

type RenderWithProvidersResult = Awaited<ReturnType<typeof render>> & {
  queryClient: QueryClient;
};

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

export async function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}): Promise<RenderWithProvidersResult> {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <HeroUINativeProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </HeroUINativeProvider>
    );
  }

  const renderResult = await render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });

  return {
    queryClient,
    ...renderResult,
  };
}
