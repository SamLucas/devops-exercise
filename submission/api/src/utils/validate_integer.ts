function isInteger(value: any): boolean {
  // Verifica se o valor é um número inteiro
  return typeof value !== "number" ? false : Number.isInteger(value)
}

export default {
  isInteger,
}
