import { ChangeEventHandler } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "@/components/Image";
import viteIcon from "@/assets/vite.svg";
import { Currency } from "@/hooks/useGetCurrencies";

interface CurrencyInputProps {
  label: string;
  id: string;
  currencies: Currency[];
  inputValue: string | number | undefined;
  disabled: boolean;
  onSelect: (value: string) => void;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const CurrencyInput = ({
  id,
  label,
  currencies,
  disabled,
  inputValue,
  onSelect,
  onChange,
}: CurrencyInputProps) => {
  return (
    <div className="flex gap-3 flex-col md:flex-row md:min-w-[600px]">
      <Label htmlFor={id} className="w-[250px] ">
        {label}
      </Label>
      <Input
        id={id}
        onChange={onChange}
        value={inputValue}
        disabled={disabled}
      />
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-[280px] cursor-pointer">
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Currency</SelectLabel>
            {currencies.map((item) => (
              <SelectItem value={item.currency} key={item.currency}>
                <Image
                  defaultSrc={viteIcon}
                  src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`}
                  alt={`${item.currency} icon`}
                />
                {item.currency}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencyInput;
