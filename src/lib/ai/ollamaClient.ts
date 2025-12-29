// Безопасный клиент для локальной модели Ollama
const OLLAMA_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:11434'
  : 'http://ollama:11434'; // Для Docker-деплоя

export async function* getOllamaResponse(prompt: string, context: {
  subject?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  chatHistory?: { role: 'user' | 'assistant'; content: string }[];
}) {
  try {
    // Системный промпт для учебного помощника
    const systemPrompt = `Ты - Академический помощник FOCUS. Анализируй эмоции студента:
- Если видишь слова "не могу", "стресс", "боюсь" → активируй режим поддержки
- Если видишь "ура!", "получилось!" → хвали и предлагай следующий вызов
- Всегда используй эмодзи для передачи эмоций: 😊 для радости, 😌 для стресса, 💡 для идей

    ПРАВИЛА:
    1. НИКОГДА не давай готовые ответы на экзаменационные вопросы
    2. Всегда разбивай сложные темы на микро-шаги
    3. Если студент спрашивает про дедлайны — напоминай о Pomodoro-таймере
    4. При упоминании стресса — предлагай дыхательные упражнения
    5. Отвечай на том же языке, что и вопрос студента (русский/английский)

    Предмет: ${context.subject || 'общие науки'}
    Уровень: ${context.difficulty || 'intermediate'}`;

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:0.5b',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(context.chatHistory || []),
          { role: 'user', content: prompt }
        ],
        stream: true,
        options: {
          temperature: 0.3,  // Низкая креативность = больше академической точности
          num_ctx: 2048        // Контекстное окно
        }
      }),
      signal: AbortSignal.timeout(30000) // Таймаут 30 сек
    });

    if (!response.ok || !response.body) {
      throw new Error('Ошибка подключения к Ollama');
    }

    // Парсинг стрима ответа
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            fullResponse += json.message.content;
            yield fullResponse; // Отдаем частичный ответ для стримминга
          }
        } catch (e) {
          console.error('Ошибка парсинга чанка:', e);
        }
      }
    }

  } catch (error) {
    console.error('Ollama ошибка:', error);
    throw new Error('Не удалось подключиться к локальной модели. Проверь, запущен ли Ollama.');
  }
};

// Тестовая функция для проверки работы
export const testOllamaConnection = async () => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
};