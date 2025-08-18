'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold font-headline">Settings</h1>
                    <p className="text-muted-foreground">Manage your application preferences.</p>
                </header>
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>
                            Customize the look and feel of the application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="theme" className="font-semibold">
                                    Theme
                                </Label>
                                <RadioGroup
                                    defaultValue={theme}
                                    onValueChange={setTheme}
                                    className="flex items-center space-x-4"
                                    id="theme"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="light" id="light" />
                                        <Label htmlFor="light">Light</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="dark" id="dark" />
                                        <Label htmlFor="dark">Dark</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="system" id="system" />
                                        <Label htmlFor="system">System</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
