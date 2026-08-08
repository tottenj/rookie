import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View } from 'react-native';

import EmailSignUpForm from './EmailSignUpForm';

const queryClient = new QueryClient();

const meta = {
  title: 'Auth/EmailSignUpForm',
  component: EmailSignUpForm,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
          <Story />
        </View>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof EmailSignUpForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
