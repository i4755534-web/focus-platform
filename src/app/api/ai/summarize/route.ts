import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { chatHistory } = await req.json();

    // Шаблон для Ollama
    const prompt = `Проанализируй историю чата и создай структурированный конспект:

    ПРАВИЛА:
    1. Выдели 3 ключевые концепции
    2. Для каждой добавь пример из чата
    3. Добавь раздел "Что запомнить" с максимум 3 пунктами
    4. Используй эмодзи для визуального разделения

    История чата:
    ${chatHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n\n')}`;

    // Вызываем Ollama
    const ollamaUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:11434' : 'http://ollama:11434';

    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:0.5b',
        messages: [{ role: 'user', content: prompt }],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Ошибка Ollama');
    }

    const data = await response.json();
    const summary = data.message?.content || 'Конспект не удалось создать.';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Ошибка в summarize:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}