'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getPageData } from '@/services/dataService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { User } from '@/lib/types';

type FilterOption = {
    value: string;
    label: string;
};

type FilterDropdownProps = {
    config: {
        filter_key: string;
        source_endpoint: string;
    };
    onFilterChange: (filterKey: string, value: string | null) => void;
};

export function FilterDropdown({ config, onFilterChange }: FilterDropdownProps) {
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
        <Select value={selectedValue} onValueChange={handleChange}>
            <SelectTrigger>
                <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="__ALL__">Todos</SelectItem>
                {options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}