import AISearch from '@/components/search/AISearch';

export default function SearchPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Умный поиск</h1>
        <p className="text-gray-600 mt-2">
          Ищите сообщения, файлы, пользователей и каналы с помощью искусственного интеллекта
        </p>
      </div>

      <AISearch />
    </div>
  );
}