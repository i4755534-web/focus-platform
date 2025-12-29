import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { emoji, message, context } = await req.json();

    // Генерируем промпт на основе эмодзи
    let prompt = `Студент отреагировал ${emoji} на сообщение: "${message.text}". ${context}. `;

    if (emoji === '😭') {
      prompt += 'Вижу, это сложно. Давай разберем на 3 микро-шага. Сначала...';
    } else if (emoji === '🤯') {
      prompt += 'Это удивительно! Давай углубимся в детали.';
    } else if (emoji === '🤔') {
      prompt += 'Хороший вопрос. Давай подумаем вместе.';
    } else if (emoji === '😄') {
      prompt += 'Рад, что тебе понравилось! Продолжим в том же духе.';
    }

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
    const aiResponse = data.message?.content || 'Спасибо за реакцию!';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Ошибка в AI reaction:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}