import { lazy } from 'react';
import { LazyWrapper } from '@/components/performance/LazyWrapper';

const VideoCall = lazy(() => import('@/components/calls/VideoCall'));

interface LazyVideoCallProps {
  participants: string[];
  onEndCall: () => void;
}

export default function LazyVideoCall(props: LazyVideoCallProps) {
  return (
    <LazyWrapper
      fallback={
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Загрузка видеозвонка...</p>
          </div>
        </div>
      }
    >
      <VideoCall {...props} />
    </LazyWrapper>
  );
}