import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface CompanySuggestionsProps {
  value: string;
  suggestions: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValueChange: (value: string) => void;
  onSelect: (value: string) => void;
}

export function CompanySuggestions({
  value,
  suggestions = [], // Add default empty array
  open,
  onOpenChange,
  onValueChange,
  onSelect
}: CompanySuggestionsProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Sélectionner une entreprise..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Rechercher une entreprise..." 
            value={value}
            onValueChange={onValueChange}
          />
          <CommandEmpty>Aucune entreprise trouvée.</CommandEmpty>
          <CommandGroup>
            {suggestions.map((suggestion) => (
              <CommandItem
                key={suggestion}
                value={suggestion}
                onSelect={() => onSelect(suggestion)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === suggestion ? "opacity-100" : "opacity-0"
                  )}
                />
                {suggestion}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}