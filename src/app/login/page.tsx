'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Loader2 } from 'lucide-react';

// Define el esquema y las validaciones del formulario
const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria.' }),
});

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fallo de autenticación',
        description: 'Email o contraseña incorrectos. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <BarChart3 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">BizzViz</CardTitle>
          <CardDescription>Your Business Intelligence Partner</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@bizzviz.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Iniciar Sesión
              </Button>
            </form>
          </Form>
          <div className="mt-6 pt-6 border-t text-center text-sm">
            <p className="text-muted-foreground font-semibold">Cuentas de prueba:</p>
            <ul className="mt-2 text-muted-foreground">
              <li>admin@acomp.com (Empresa Alfa)</li>
              <li>user@acomp.com (Empresa Alfa)</li>
              <li>user@bcomp.com (Compañía Beta)</li>
            </ul>
            <p className="mt-2 text-muted-foreground">La contraseña para todas es: <span className="font-mono font-bold text-foreground">1234</span></p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}