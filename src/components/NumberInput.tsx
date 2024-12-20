import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
}

const NumberInput = ({ value, onChange }: NumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= 1 && newValue <= 50) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="numberOfCompanies">
        Nombre d'entreprises à gérer
      </Label>
      <Input
        id="numberOfCompanies"
        type="number"
        min="1"
        max="50"
        value={value || ""}
        onChange={handleChange}
        className="max-w-xs mx-auto block"
        placeholder="Entrez un nombre..."
      />
    </div>
  );
};

export default NumberInput;