import ChatClient from '@/components/chat/ChatClient';

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;

  return <ChatClient chatId={chatId} />;
}