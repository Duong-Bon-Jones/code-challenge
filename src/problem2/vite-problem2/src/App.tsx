import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CurrencyInput from "@/components/CurrencyInput";
import useCurrenciesSwap from "@/hooks/useCurrenciesSwap";
import useGetCurrencies from "@/hooks/useGetCurrencies";

export type Field = "in" | "out";

function App() {
  const [selectedInId, setSelectedInId] = useState("");
  const [selectedOutId, setSelectedOutId] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [updatedField, setUpdatedField] = useState<Field>("in");

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isSubmitSucceeded, setIsSubmitSucceeded] = useState(false);

  const {
    currencies,
    getCurrencies,
    isGetCurrenciesFailed,
    isGetCurrenciesLoading,
  } = useGetCurrencies();

  const { calculatedAmounts, isInputHaveError } = useCurrenciesSwap({
    currencies,
    selectedAmount,
    selectedInId,
    selectedOutId,
    updatedField,
  });

  const isSubmitDisabled = useMemo(() => {
    return (
      isInputHaveError || !selectedInId || !selectedOutId || isSubmitLoading
    );
  }, [isInputHaveError, isSubmitLoading, selectedInId, selectedOutId]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, field: Field) => {
      setSelectedAmount(e.target.value);
      setUpdatedField(field);
      setIsSubmitSucceeded(false);
    },
    []
  );

  const handleConfirmSwap = useCallback(() => {
    setIsSubmitLoading(true);

    setTimeout(() => {
      setIsSubmitLoading(false);
      setIsSubmitSucceeded(true);
      setSelectedAmount("");
    }, 1000);
  }, []);

  return (
    <div className="h-screen w-screen flex items-center flex-col gap-7 p-20">
      <div>
        <a href="./">
          <img
            src="https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/USDC.svg"
            className="w-20 h-20"
            alt="Main logo"
          />
        </a>
      </div>

      <h1 className="text-6xl">Swapee</h1>

      {isGetCurrenciesLoading ? (
        <>
          <Skeleton className="h-50 w-full" />
        </>
      ) : isGetCurrenciesFailed ? (
        <>
          <p className="text-red-600">Failed to fetch currencies</p>
          <Button onClick={getCurrencies} className="cursor-pointer">
            Retry
          </Button>
        </>
      ) : (
        <>
          <CurrencyInput
            id="input-in"
            label="Amount to send"
            currencies={currencies}
            onSelect={(value) => setSelectedInId(value)}
            onChange={(e) => handleInputChange(e, "in")}
            disabled={!selectedInId || isSubmitLoading}
            inputValue={calculatedAmounts.in}
          />
          <CurrencyInput
            id="input-out"
            label="Amount to receive"
            currencies={currencies}
            onSelect={(value) => setSelectedOutId(value)}
            onChange={(e) => handleInputChange(e, "out")}
            disabled={!selectedOutId || isSubmitLoading}
            inputValue={calculatedAmounts.out}
          />

          {isInputHaveError && !isSubmitSucceeded && (
            <p className="text-red-600">Inputs must be positive number</p>
          )}
          {isSubmitSucceeded && (
            <p className="text-green-500">Swapped successfully!</p>
          )}

          <Button
            disabled={isSubmitDisabled}
            onClick={handleConfirmSwap}
            className="cursor-pointer"
          >
            Confirm Swap
          </Button>

          {isSubmitLoading && (
            <>
              <Skeleton className="h-20 w-full" />
              <p>Swapping!</p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
