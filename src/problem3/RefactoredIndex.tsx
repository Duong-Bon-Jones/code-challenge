type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface WalletPageProps extends BoxProps {
  // some new props
  children: React.ReactNode;
}

const getPriority = (blockchain: Blockchain) => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage = ({ children, ...rest }: WalletPageProps) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);

        return balancePriority > -99 && balance.amount <= 0;
      })
      .sort(
        (lhs: WalletBalance, rhs: WalletBalance) =>
          getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
      )
      .map((balance: FormattedWalletBalance) => {
        balance.formatted = balance.amount.toFixed();

        return balance;
      });
  }, [balances, prices]);

  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
