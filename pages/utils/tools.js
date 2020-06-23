// 金额计算
export const calculationMoney = (money, length=2) => {
  return Number.parseFloat(Number.parseFloat(money).toFixed(length))
}