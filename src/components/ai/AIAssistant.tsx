'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVoiceCommands, VoiceCommand } from '@/hooks/useVoiceCommands';
import { Mic, MicOff, Volume2, HelpCircle, Settings } from 'lucide-react';

export default function AIAssistant() {
  const {
    voiceState,
    voiceCommands,
    toggleListening,
    speak,
  } = useVoiceCommands();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Auto-collapse after some time
  useEffect(() => {
    if (isExpanded && !voiceState.isListening) {
      const timer = setTimeout(() => setIsExpanded(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, voiceState.isListening]);

  const handleVoiceToggle = () => {
    toggleListening();
    setIsExpanded(true);
  };

  const handleCommandClick = (command: VoiceCommand) => {
    speak(`Команда: ${command.description}`);
  };

  if (!voiceState.isSupported) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 shadow-lg border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-orange-700">
            <Volume2 className="w-5 h-5" />
            <span className="text-sm font-medium">AI Ассистент недоступен</span>
          </div>
          <p className="text-xs text-orange-600 mt-1">
            Ваш браузер не поддерживает голосовые команды
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main Assistant Button */}
      <Button
        onClick={handleVoiceToggle}
        size="lg"
        className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
          voiceState.isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {voiceState.isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </Button>

      {/* Expanded Panel */}
      {isExpanded && (
        <Card className="absolute bottom-16 right-0 w-80 shadow-xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                AI Ассистент
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  ×
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  voiceState.isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                }`} />
                <span className="text-sm font-medium">
                  {voiceState.isListening ? 'Слушаю...' : 'Готов к работе'}
                </span>
              </div>
              <Badge variant={voiceState.isSupported ? 'default' : 'secondary'}>
                {voiceState.isSupported ? 'Активен' : 'Недоступен'}
              </Badge>
            </div>

            {/* Transcript */}
            {voiceState.transcript && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Распознано:</strong> {voiceState.transcript}
                </p>
                {voiceState.confidence > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Точность: {Math.round(voiceState.confidence * 100)}%
                  </p>
                )}
              </div>
            )}

            {/* Processing Indicator */}
            {voiceState.isProcessing && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Обрабатываю команду...</span>
              </div>
            )}

            {/* Error */}
            {voiceState.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{voiceState.error}</p>
              </div>
            )}

            {/* Help */}
            {showHelp && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Доступные команды:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {voiceCommands.map((command, index) => (
                    <button
                      key={index}
                      onClick={() => handleCommandClick(command)}
                      className="w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{command.description}</p>
                          <p className="text-xs text-gray-500">
                            Ключевые слова: {command.keywords.join(', ')}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => speak('Привет! Я ваш AI ассистент. Чем могу помочь?')}
                className="flex-1"
              >
                <Volume2 className="w-4 h-4 mr-1" />
                Тест речи
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelp(!showHelp)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Listening Indicator */}
      {voiceState.isListening && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
      )}
    </div>
  );
}