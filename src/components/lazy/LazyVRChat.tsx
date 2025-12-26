import { lazy } from 'react';
import { LazyWrapper } from '@/components/performance/LazyWrapper';

const VRChat = lazy(() => import('@/components/vr/VRChat').then(module => ({ default: module.VRChat })));

interface LazyVRChatProps {
  users: Array<{
    id: string;
    name: string;
    position: [number, number, number];
    avatar?: string;
  }>;
  onVoiceMessage?: (audioData: ArrayBuffer) => void;
  onGesture?: (gesture: string) => void;
}

export default function LazyVRChat(props: LazyVRChatProps) {
  return (
    <LazyWrapper
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-xl">Загрузка VR комнаты...</p>
            <p className="text-sm opacity-75 mt-2">Подготовка виртуального пространства</p>
          </div>
        </div>
      }
    >
      <VRChat {...props} />
    </LazyWrapper>
  );
}