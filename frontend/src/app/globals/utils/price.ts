import numeral from "numeral";

const formatPrice = (price: string) => {
  return numeral(price).format("$0,0.00");
}

export {
  formatPrice
}