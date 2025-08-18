'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';

type Option = {
    value: string;
    label: string;
}

type SearchableDropdownProps = {
    options: Option[];
    onSelect: (value: string) => void;
    placeholder?: string;
    selectedValue?: string;
}

export function SearchableDropdown({ options, onSelect, placeholder = "Select an option...", selectedValue }: SearchableDropdownProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(selectedValue || "")

  const selectedLabel = options.find((option) => option.value === selectedValue)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedValue
            ? selectedLabel
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue
                    setValue(newValue)
                    onSelect(newValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
           </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
