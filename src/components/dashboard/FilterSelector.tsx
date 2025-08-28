'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getPageData } from '@/services/dataService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type FilterOption = {
    value: string;
    label: string;
};

type FilterSelectorProps = {
    title: string;
    config: {
        filter_key: string;
        source_endpoint: string;
    };
    onFilterChange: (filterKey: string, value: string | null) => void;
};

export function FilterSelector({ title, config, onFilterChange }: FilterSelectorProps) {
    const { user } = useAuth();
    const [options, setOptions] = useState<FilterOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>('__ALL__');

    useEffect(() => {
        if (user) {
            const clientApiId = user.clientId === 'client-a-123' ? 'client_a' : 'client_b';
            getPageData(clientApiId, config.source_endpoint).then(data => {
                setOptions(data as unknown as FilterOption[]);
            });
        }
    }, [user, config.source_endpoint]);

    const handleChange = (value: string) => {
        setSelectedValue(value);
        onFilterChange(config.filter_key, value === '__ALL__' ? null : value);
    };

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <RadioGroup value={selectedValue} onValueChange={handleChange}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="__ALL__" id="all-items" />
                        <Label htmlFor="all-items">Todos</Label>
                    </div>
                    {options.map(option => (
                         <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value}>{option.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>
    );
}