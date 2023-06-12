/* eslint-disable @typescript-eslint/no-empty-function */
import { PrimeService } from "../../src/services/prime"

const primeService = new PrimeService()

import faker from "faker"

const dataPrime = [0, 1, 2, 3, 5, 7, 11]
const dataPrimeNegative = [-1, -2, -3, -5, -7, -11]

describe("Prime Function", () => {
  it("Must verify if number is prime", () => {
    const indice = faker.datatype.number({ min: 2, max: 6 })
    const response = primeService.validate(dataPrime[indice])
    expect(response).toBe(true)
  })

  it("Must failed if number less then two", () => {
    const indice = faker.datatype.number({ min: 0, max: 1 })
    const response = primeService.validate(dataPrime[indice])
    expect(response).toBe(false)
  })

  it("Must failed if number is different string", () => {
    const name = faker.internet.userName()
    const response = primeService.validate(name)
    expect(response).toBe(false)
  })

  it("Must failed if number is negative or zero", () => {
    const indice = faker.datatype.number({ min: 1, max: 5 })
    const response = primeService.validate(dataPrimeNegative[indice])
    const response_zero = primeService.validate(0)

    expect(response_zero).toBe(false)
    expect(response).toBe(false)
  })
})
