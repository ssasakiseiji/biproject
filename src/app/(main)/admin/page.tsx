'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ShieldCheck, Edit, Trash2 } from 'lucide-react';
import { getUsers } from '@/services/dataService';
import type { User } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.replace('/');
    } else if (user?.role === 'admin') {
      getUsers().then(data => {
        setUsers(data);
        setLoading(false);
      });
    }
  }, [user, authLoading, router]);

  const handleEditPermissions = (userId: string) => {
    console.log(`Edit permissions for user: ${userId}`);
    alert(`(Prototype) Edit permissions for user: ${userId}`);
  };

  const handleDeleteUser = (userId: string) => {
    console.log(`Delete user: ${userId}`);
     alert(`(Prototype) Delete user: ${userId}`);
  };


  if (authLoading || user?.role !== 'admin') {
    return (
       <div className="flex h-screen w-full items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <ShieldAlert className="h-12 w-12 text-destructive" />
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-headline">Admin Panel</h1>
                <p className="text-muted-foreground">User Management</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>System Users</CardTitle>
                     <CardDescription>Manage user roles and permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading users...</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{u.role}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditPermissions(u.id)}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit Permissions</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(u.id)}>
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete User</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
