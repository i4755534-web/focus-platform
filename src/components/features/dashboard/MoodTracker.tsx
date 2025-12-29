import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function MoodTracker({ messages }: { messages: { role: 'user' | 'assistant'; content: string }[] }) {
  // Анализируем последние 10 сообщений через простой NLP
  const moodScore = useMemo(() => {
    const keywords = {
      positive: ['ура', 'отлично', 'понял', 'спасибо', 'класс'],
      negative: ['не могу', 'стресс', 'сложно', 'боюсь', 'устал']
    };

    return messages.slice(-10).reduce((score, msg) => {
      if (msg.role !== 'user') return score;
      const text = msg.content.toLowerCase();
      if (keywords.positive.some(word => text.includes(word))) return score + 1;
      if (keywords.negative.some(word => text.includes(word))) return score - 1;
      return score;
    }, 0);
  }, [messages]);

  return (
    <div className="glass-card p-4 rounded-2xl">
      <h3 className="font-bold mb-2 flex items-center">
        <span className="mr-2">❤️</span> Твое настроение сегодня
      </h3>
      <div className="h-8 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "50%" }}
          animate={{
            width: `${50 + moodScore * 10}%`,
            backgroundColor: moodScore > 0 ? "#00f3ff" : "#ff6b6b"
          }}
          className="h-full"
        />
      </div>
      <p className="text-sm mt-2 text-center">
        {moodScore > 2 ? "🔥 В огне! Продолжай в том же темпе!" :
         moodScore < -2 ? "😌 Давай сделаем перерыв. Предлагаю 5-минутную медитацию" :
         "🙂 Стабильно. Хочешь усложнить задачи?"}
      </p>
    </div>
  );
}