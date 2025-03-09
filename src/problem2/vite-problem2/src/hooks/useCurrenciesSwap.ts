import { Field } from "@/App";
import { Currency } from "@/hooks/useGetCurrencies";
import { useMemo } from "react";

const handleInToOut = (
  selectedInCurrency: Currency | undefined,
  selectedOutCurrency: Currency | undefined,
  selectedInputAmount: number
) => {
  if (!selectedInCurrency || !selectedOutCurrency) {
    return;
  }

  return (
    (selectedInputAmount * selectedInCurrency.price) / selectedOutCurrency.price
  );
};

const handleOutToIn = (
  selectedInCurrency: Currency | undefined,
  selectedOutCurrency: Currency | undefined,
  selectedOutputAmount: number
) => {
  if (!selectedInCurrency || !selectedOutCurrency) {
    return;
  }

  return (
    (selectedOutputAmount * selectedOutCurrency.price) /
    selectedInCurrency.price
  );
};

const useCurrenciesSwap = ({
  currencies,
  selectedInId,
  selectedOutId,
  selectedAmount,
  updatedField,
}: {
  currencies: Currency[];
  selectedInId: string;
  selectedOutId: string;
  selectedAmount: string;
  updatedField: Field;
}) => {
  const dependentField: Field = updatedField === "in" ? "out" : "in";

  const selectedInCurrency = useMemo(() => {
    return currencies.find((cur) => cur.currency === selectedInId);
  }, [currencies, selectedInId]);
  const selectedOutCurrency = useMemo(() => {
    return currencies.find((cur) => cur.currency === selectedOutId);
  }, [currencies, selectedOutId]);

  const parsedAmount = Number(selectedAmount);

  const isInputHaveError = useMemo(() => {
    return !!(
      selectedInId &&
      selectedOutId &&
      (!parsedAmount || parsedAmount <= 0)
    );
  }, [parsedAmount, selectedInId, selectedOutId]);

  const calculator = useMemo(() => {
    return {
      in: handleOutToIn(selectedInCurrency, selectedOutCurrency, parsedAmount),
      out: handleInToOut(selectedInCurrency, selectedOutCurrency, parsedAmount),
    };
  }, [parsedAmount, selectedInCurrency, selectedOutCurrency]);

  const calculatedAmounts = useMemo(() => {
    return {
      [updatedField]: selectedAmount,
      [dependentField]: calculator[dependentField] || "",
    };
  }, [calculator, dependentField, selectedAmount, updatedField]);

  return {
    isInputHaveError,
    calculatedAmounts,
  };
};

export default useCurrenciesSwap;
