# FOCUS - Образовательная коммуникационная платформа

FOCUS - это комплексная образовательная коммуникационная платформа, построенная с использованием Next.js 15, TypeScript и современных веб-технологий. Она предоставляет полное решение для онлайн-образования, совместной работы и общения.

## Возможности

### Основной функционал
- **Чат в реальном времени**: Мгновенные сообщения с поддержкой файлов и emoji
- **Видеозвонки**: Видеоконференции на базе WebRTC с демонстрацией экрана
- **Инструменты совместной работы**: Доска, редактирование документов и совместная работа в реальном времени
- **Управление файлами**: Контроль версий, облачное хранилище и обмен файлами
- **Управление пользователями**: Аутентификация, профили и ролевая система доступа

### Продвинутые возможности
- **AI интеграция**: Умный поиск, рекомендации и голосовые команды
- **Web3 поддержка**: Интеграция с блокчейном и криптовалютные функции
- **Система плагинов**: Расширяемый маркетплейс для сторонних интеграций
- **Многоязычность**: Поддержка нескольких языков и RTL раскладок
- **Мобильные приложения**: Нативные приложения для iOS и Android
- **PWA**: Прогрессивное веб-приложение с оффлайн возможностями

### Корпоративные возможности
- **Мульти-тенант архитектура**: Отдельные рабочие пространства для разных организаций
- **Админ панель**: Полное управление платформой и аналитика
- **Безопасность**: Продвинутые функции безопасности, ограничение скорости и аудит логов
- **Резервное копирование**: Автоматизированные бэкапы и восстановление после сбоев
- **Производительность**: Оптимизированная загрузка, кэширование и масштабируемость

## Технологический стек

### Frontend
- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - Типизированный JavaScript
- **Tailwind CSS** - Utility-first CSS фреймворк
- **shadcn/ui** - Современные UI компоненты
- **Zustand** - Управление состоянием
- **TanStack Query** - Загрузка данных и кэширование

### Backend
- **Next.js API Routes** - Serverless API эндпоинты
- **JWT аутентификация** - Безопасная аутентификация на токенах
- **WebRTC** - Коммуникация в реальном времени
- **Socket.io** - WebSocket соединения

### База данных и хранилище
- **PostgreSQL** - Реляционная база данных для production
- **Mock база данных** - In-memory хранение для разработки
- **Redis-like кэширование** - In-memory система кэширования
- **Файловое хранилище** - Локальная файловая система (можно заменить на облачное хранилище)

### DevOps и тестирование
- **Docker** - Контейнеризация
- **Jest** - Unit тестирование
- **Playwright** - E2E тестирование
- **ESLint** - Линтинг кода
- **GitHub Actions** - CI/CD пайплайн

## Быстрый старт

### Предварительные требования
- Node.js 18+
- npm или yarn
- Git

### Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd focus
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите сервер разработки:
```bash
npm run dev
```

4. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Настройка окружения

1. Скопируйте файл с примером переменных окружения:
```bash
cp .env.example .env.local
```

2. Отредактируйте `.env.local` и заполните необходимые значения:

```env
# Обязательные переменные
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=postgresql://username:password@localhost:5432/focus_db

# Для разработки
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

Смотрите [.env.example](.env.example) для полного списка доступных переменных.

## Project Structure

```
focus/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── api/            # API routes
│   │   └── auth/           # Authentication pages
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Basic UI components (shadcn)
│   │   ├── layout/        # Layout components
│   │   └── features/      # Feature-specific components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and configurations
│   └── middleware.ts      # Next.js middleware
├── public/                # Static assets
├── tests/                 # Test files
├── docker/                # Docker configuration
└── docs/                  # Documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container

## API Documentation

The API follows RESTful conventions with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Chats
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/[id]` - Get specific chat
- `POST /api/chats/[id]/messages` - Send message

### Files
- `GET /api/files` - Get user's files
- `POST /api/files` - Upload file
- `GET /api/files/[id]` - Download file

## Deployment

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t focus .
```

2. Run the container:
```bash
docker run -p 3000:3000 focus
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Traditional Hosting

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Развертывание

### 🚀 Vercel (Рекомендуется для Next.js)

**Бесплатный тариф Vercel идеально подходит для Next.js приложений!**

1. **Регистрация на Vercel:**
   - Перейдите на [vercel.com](https://vercel.com)
   - Зарегистрируйтесь с GitHub аккаунтом

2. **Импорт проекта:**
   - Нажмите "New Project"
   - Выберите ваш GitHub репозиторий
   - Vercel автоматически распознает Next.js

3. **Настройка переменных окружения:**
   ```env
   JWT_SECRET=your-secret-key
   DATABASE_URL=your-database-url
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=https://your-project.vercel.app
   ```

4. **Развертывание:**
   - Vercel автоматически развернет приложение
   - Каждый push в main ветку обновляет production
   - Pull requests создают preview deployments

### 📄 GitHub Pages (Статическая версия)

**Для демонстрации интерфейса (без серверных функций):**

1. **Включите GitHub Pages:**
   - В репозитории: Settings → Pages
   - Source: "GitHub Actions"

2. **Workflow автоматически:**
   - Соберет статическую версию
   - Развернет на GitHub Pages

3. **Ограничения:**
   - Нет API routes (только статические страницы)
   - Нет серверных функций
   - Только для демонстрации UI

### 🐳 Другие бесплатные хостинги

- **Netlify**: Бесплатный тариф, хорошая поддержка Next.js
- **Railway**: Бесплатный тариф для full-stack приложений
- **Render**: Бесплатный тариф с PostgreSQL
- **Fly.io**: Бесплатный тариф для Docker приложений

### 🔧 Настройка секретов

Для Vercel добавьте секреты в проект settings:
- `VERCEL_TOKEN` - токен доступа
- `VERCEL_ORG_ID` - ID организации
- `VERCEL_PROJECT_ID` - ID проекта

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## CI/CD

Проект использует GitHub Actions для автоматического тестирования и развертывания.

### Автоматические проверки:
- **TypeScript** - Проверка типов
- **ESLint** - Линтинг кода
- **Unit тесты** - Jest с покрытием
- **E2E тесты** - Playwright
- **Lighthouse** - Производительность и доступность
- **Security scans** - Snyk, CodeQL, GitLeaks

### Развертывание:
- **Docker** - Контейнеризация и автоматическая сборка
- **Staging** - Автоматическое развертывание из develop ветки
- **Production** - Автоматическое развертывание из main ветки

### Статус CI/CD:
[![CI/CD](https://github.com/your-username/focus/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/focus/actions/workflows/ci.yml)
[![Security](https://github.com/your-username/focus/actions/workflows/security.yml/badge.svg)](https://github.com/your-username/focus/actions/workflows/security.yml)

## Security

This project implements several security measures:
- JWT authentication with refresh tokens
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Security headers
- Audit logging

## Performance

The application is optimized for performance:
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- CDN integration
- Database query optimization

## Accessibility

FOCUS follows WCAG 2.1 AA guidelines:
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Focus management
- Semantic HTML

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Email: support@focus-platform.com
- Documentation: [docs.focus-platform.com](https://docs.focus-platform.com)
- Issues: [GitHub Issues](https://github.com/focus-platform/focus/issues)

## Roadmap

### Version 2.0 (Q1 2024)
- Advanced AI features
- Mobile app release
- Enterprise features

### Version 2.1 (Q2 2024)
- Video conferencing improvements
- Plugin marketplace
- Advanced analytics

### Version 3.0 (Q3 2024)
- Multi-tenant architecture
- Advanced security features
- Performance optimizations

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
