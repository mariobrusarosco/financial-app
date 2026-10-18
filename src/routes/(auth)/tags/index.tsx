import { createFileRoute } from '@tanstack/react-router';
import { TagsMainScreen } from '@/domains/tags/screens/main';

export const Route = createFileRoute('/(auth)/tags/')({
  component: TagsMainScreen,
});
