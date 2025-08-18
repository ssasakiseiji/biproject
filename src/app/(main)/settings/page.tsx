'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
                    <CardContent className="space-y-6">
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
                            </RadioGroup>
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                             <Label htmlFor="chart-palette" className="font-semibold">
                                Chart Color Palette
                            </Label>
                            <Select defaultValue="default">
                                <SelectTrigger id="chart-palette" className="w-[180px]">
                                    <SelectValue placeholder="Select Palette" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="vibrant">Vibrant</SelectItem>
                                    <SelectItem value="muted">Muted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="flex items-center justify-between space-x-2">
                             <Label htmlFor="language" className="font-semibold">
                                Language
                            </Label>
                            <Select defaultValue="es">
                                <SelectTrigger id="language" className="w-[180px]">
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="es">Español</SelectItem>
                                    <SelectItem value="en" disabled>English</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
