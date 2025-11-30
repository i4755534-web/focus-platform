'use client';

import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceControlsProps {
  isMuted: boolean;
  isDeafened: boolean;
  volume: number;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onVolumeChange: (volume: number) => void;
}

export function VoiceControls({
  isMuted,
  isDeafened,
  volume,
  onToggleMute,
  onToggleDeafen,
  onVolumeChange,
}: VoiceControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Mute Button */}
      <Button
        variant={isMuted ? "destructive" : "secondary"}
        size="lg"
        onClick={onToggleMute}
        className="rounded-full w-12 h-12 p-0"
        title={isMuted ? "Включить микрофон" : "Отключить микрофон"}
      >
        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </Button>

      {/* Deafen Button */}
      <Button
        variant={isDeafened ? "destructive" : "secondary"}
        size="lg"
        onClick={onToggleDeafen}
        className="rounded-full w-12 h-12 p-0"
        title={isDeafened ? "Включить звук" : "Отключить звук"}
      >
        {isDeafened ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </Button>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <Volume2 className="w-4 h-4 text-gray-500" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-500 w-8">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}