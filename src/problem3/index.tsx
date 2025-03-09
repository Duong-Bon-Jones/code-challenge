// FormattedWalletBalance is a subset of WalletBalance, so it should extends WalletBalance interface
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// Props extends BoxProps but with no extra props, defeat the purpose of extending. We need to add extra props
interface Props extends BoxProps {}

// React.FC<Props> and (props: Props) serve the same purpose, so we should use one of them only
const WalletPage: React.FC<Props> = (props: Props) => {
  // We can destructure the props right at the (props: Props) above.
  // Also children is not used
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // getPriority is a pure function that do not use any outside value. We can move it outside of the react function or a helper file
  // blockchain should not have any type. We should have a type for it
  // return type can be inferred so : number is not necessary, unless it's the convention of the codebase
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      // Zilliqa and Neo have the same return value. We can combine them
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return (
      balances
        .filter((balance: WalletBalance) => {
          // balancePriority is not used. is it typo with lhsPriority?
          // Property 'blockchain' does not exist on type 'WalletBalance'
          const balancePriority = getPriority(balance.blockchain);
          // double consecutive if statement. they can be combined
          // the whole return blocks can be combined in one line
          if (lhsPriority > -99) {
            if (balance.amount <= 0) {
              return true;
            }
          }
          return false;
        })
        // The sort function can be shortened in one line
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
          const leftPriority = getPriority(lhs.blockchain);
          const rightPriority = getPriority(rhs.blockchain);
          if (leftPriority > rightPriority) {
            return -1;
          } else if (rightPriority > leftPriority) {
            return 1;
          }
        })
    );
  }, [balances, prices]);

  // formattedBalances is not used. I assume the `rows` variable should be using formattedBalances instead. in this case, the `.map` can be combined to the useMemo above.
  // otherwise, this one should also be used with useMemo to avoid heavy recalculation while rerendering
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    // can assign new `formatted` property to `balance` to avoid using `...`
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // should use formattedBalances to have access to formatted property.
  // this one can also be memorized with useMemo
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // key should be unique, can use `balance.currency` instead
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
