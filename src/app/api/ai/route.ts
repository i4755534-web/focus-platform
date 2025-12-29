import { NextResponse } from 'next/server';
import { getOllamaResponse } from '@/lib/ai/ollamaClient';

export const dynamic = 'force-dynamic'; // Важно для стримминга

export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json();

    // Валидация входных данных
    if (!prompt || prompt.length > 500) {
      return NextResponse.json(
        { error: 'Слишком длинный или пустой запрос' },
        { status: 400 }
      );
    }

    // Создаем ReadableStream для стримминга ответа
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const partialResponse of getOllamaResponse(prompt, context)) {
            controller.enqueue(new TextEncoder().encode(`data: ${partialResponse}\n\n`));
          }
          controller.enqueue(new TextEncoder().encode(' [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.enqueue(new TextEncoder().encode(` ${JSON.stringify({ error: 'Ошибка генерации ответа' })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('AI API ошибка:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера. Проверь, запущен ли Ollama.' },
      { status: 500 }
    );
  }
}