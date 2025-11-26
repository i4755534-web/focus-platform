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

const registerSchema = z.object({
  username: z.string().min(3, 'Username минимум 3 символа').regex(/^[a-zA-Z0-9_]+$/, 'Только буквы, цифры и _'),
  nickname: z.string().min(2, 'Nickname минимум 2 символа'),
  phone: z.string().min(10, 'Номер телефона минимум 10 цифр').regex(/^\+?\d+$/, 'Только цифры и +'),
  email: z.string().email('Неверный email').optional().or(z.literal('')),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  const { register } = useAuth();
  const router = useRouter();

  const onSubmit = (data: RegisterForm) => {
    const success = register(data.username, data.nickname, data.phone, data.email, data.password);
    if (success) {
      router.push('/chats');
    } else {
      alert('Пользователь с таким username, номером телефона или email уже существует');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
          <CardDescription>Создайте новый аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...registerUser('username')} />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>
            <div>
              <Label htmlFor="nickname">Nickname</Label>
              <Input id="nickname" {...registerUser('nickname')} />
              {errors.nickname && <p className="text-red-500 text-sm">{errors.nickname.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Номер телефона</Label>
              <Input id="phone" placeholder="+7..." {...registerUser('phone')} />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email (опционально)</Label>
              <Input id="email" type="email" {...registerUser('email')} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" {...registerUser('password')} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input id="confirmPassword" type="password" {...registerUser('confirmPassword')} />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full">Зарегистрироваться</Button>
          </form>
          <p className="text-center mt-4">
            Уже есть аккаунт? <Link href="/auth/login" className="text-blue-500">Войти</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}