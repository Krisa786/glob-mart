/* eslint-disable */
'use client';

import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';

interface AuthFormProps<T extends z.ZodType> {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  // @ts-ignore
  children: (form: UseFormReturn<z.infer<T>>) => React.ReactNode;
  className?: string;
}

export function AuthForm<T extends z.ZodType>({
  schema,
  onSubmit,
  children,
  className,
}: AuthFormProps<T>) {
  // @ts-ignore
  const form = useForm<z.infer<T>>({
    // @ts-ignore
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  // @ts-ignore
  const handleSubmit = async (data: z.infer<T>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    }
  };

  return (
    <form
      // @ts-ignore
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn('space-y-6', className)}
      noValidate
    >
      {/* @ts-ignore */}
      {children(form)}
    </form>
  );
}
