'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LocalAssistant() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Проверка доступности Ollama при загрузке
  useEffect(() => {
    const checkOllama = async () => {
      try {
        const res = await fetch('/api/ai/test');
        const data = await res.json();
        setOllamaAvailable(data.available);
      } catch (error) {
        setOllamaAvailable(false);
      }
    };
    checkOllama();
  }, []);

  // Определение мобильного устройства
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          context: {
            subject: 'general',
            difficulty: 'intermediate',
            chatHistory: messages.slice(-4) // Последние 4 сообщения для контекста
          }
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка сервера');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const lines = decoder.decode(value, { stream: true }).split('\n');
        for (const line of lines) {
          if (line.startsWith(' ') && !line.includes('[DONE]')) {
            try {
              const content = line.slice(6).trim();
              fullResponse = content;
              setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages[newMessages.length - 1]?.role === 'assistant') {
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: fullResponse
                  };
                } else {
                  newMessages.push({ role: 'assistant', content: fullResponse });
                }
                return newMessages;
              });
            } catch (e) {
              console.error('Ошибка парсинга:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Не удалось подключиться к локальной модели. Убедись, что Ollama запущен!'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!ollamaAvailable) {
    return (
      <div className={`fixed bottom-4 ${isMobile ? 'left-2 right-2' : 'right-4'} ${isMobile ? 'w-auto' : 'w-[350px]'} glass-card border border-amber-500/30 rounded-3xl p-4`}>
        <div className="text-amber-400 text-center">
          <p className="mb-2">⚠️ Ollama не запущен</p>
          <p className="text-sm">Запусти Ollama в терминале командой:</p>
          <code className="block mt-1 bg-black/30 p-2 rounded text-xs">ollama serve</code>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 ${isMobile ? 'left-2 right-2' : 'right-4'} ${isMobile ? 'w-auto' : 'w-[350px]'} h-[500px] glass-card border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl`}>
      {/* Шапка с названием */}
      <div className="bg-gradient-to-r from-[#6c43ff] to-[#00f3ff] p-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 animate-pulse opacity-20" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
        <h3 className="text-lg font-bold relative z-10 flex items-center justify-center">
          <span className="mr-2">🧠</span> Локальный AI-помощник
        </h3>
        <p className="text-xs mt-1 opacity-80">Работает на твоем компьютере • Без интернета</p>
      </div>

      {/* Чат */}
      <div className="h-[380px] overflow-y-auto p-4 space-y-4 bg-[radial-gradient(circle_at_10%_20%,rgba(108,67,255,0.05),transparent_20%)] relative">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-purple-500/20 border border-purple-500/40 rounded-tr-none'
                : 'bg-blue-500/10 border border-blue-500/30 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-3">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.2, y: 0 }}
                    animate={{ opacity: 1, y: -5 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      delay: i * 0.2
                    }}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="p-3 border-t border-purple-500/20">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Спроси о чем угодно..."
            disabled={isLoading}
            className="flex-1 bg-black/30 border border-purple-500/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={isLoading || !query.trim()}
            className="bg-gradient-to-r from-[#6c43ff] to-[#00f3ff] text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold shadow-lg disabled:opacity-50"
          >
            <span>{isLoading ? '◉' : '➤'}</span>
          </motion.button>
        </div>
        <p className="text-xs text-purple-300 mt-1 text-center">
          💡 Все данные остаются на твоем компьютере. Никаких API-ключей!
        </p>
      </div>
    </div>
  );
}