'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';
import ThreeBackground from '@/components/ThreeBackground';

const loginSchema = z.object({
  email: z.string().email('Неверный email'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = (data: LoginForm) => {
    const success = login(data.email, data.password);
    if (success) {
      router.push('/chats');
    } else {
      alert('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden">
      <ParticleBackground />
      <ThreeBackground />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="message-liquid-depth w-full max-w-md z-10"
      >
        <div className="p-8">
          <motion.h1
            className="text-3xl font-bold mb-2 text-center"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
          >
            Вход
          </motion.h1>
          <motion.p
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Введите ваши данные для входа
          </motion.p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Username, email или номер телефона</Label>
              <Input id="email" {...register('email')} className="mt-1" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" {...register('password')} className="mt-1" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <motion.button
              type="submit"
              className="liquid-button-2026 w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Войти
            </motion.button>
          </form>
          <p className="text-center mt-4">
            Нет аккаунта? <Link href="/auth/register" className="text-secondary hover:text-secondary/80 transition-colors">Зарегистрироваться</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}