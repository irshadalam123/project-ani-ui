import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export function SearchInput({
  value,
  onChange,
  placeholder,
  label = 'Search',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
}) {
  return (
    <div className="w-full sm:max-w-xs">
      <Input
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        leading={<Search className="size-4" aria-hidden="true" />}
      />
    </div>
  );
}
