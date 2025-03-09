import { useCallback, useEffect, useState } from "react";

export interface Currency {
  currency: string;
  date: Date;
  price: number;
}

const uniqueById = (array: Currency[]) => [
  ...new Map(array.map((item) => [item.currency, item])).values(),
];

const useGetCurrencies = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isGetCurrenciesFailed, setIsGetCurrenciesFailed] = useState(false);
  const [isGetCurrenciesLoading, setIsGetCurrenciesLoading] = useState(false);

  const getCurrencies = useCallback(async () => {
    setIsGetCurrenciesLoading(true);
    try {
      const res = await fetch("https://interview.switcheo.com/prices.json");
      const data = (await res.json()) as Currency[];
      setIsGetCurrenciesFailed(false);
      setCurrencies(uniqueById(data));
    } catch {
      setCurrencies([]);
      setIsGetCurrenciesFailed(true);
    } finally {
      setIsGetCurrenciesLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrencies();
  }, []);

  return {
    currencies,
    isGetCurrenciesFailed,
    isGetCurrenciesLoading,
    getCurrencies,
  };
};

export default useGetCurrencies;
