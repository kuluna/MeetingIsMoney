export {};

declare global {
  interface Number {
    toCurrency(): string;
    convertPay(mills: number): number;
  }
}

Number.prototype.toCurrency = function () {
  const num = (this as Number).valueOf();
  return `${num.toLocaleString()}円`;
};

Number.prototype.convertPay = function(mills: number) {
  const num = (this as Number).valueOf();
  return (num * (mills / 1000) / 3600);
};
