import faker from "faker"

import API from "supertest"
import App from "../../src/app"

const dataPrime = [0, 1, 2, 3, 5, 7, 11]

describe("Prime Controller", () => {
  it("Must return if number is prime or not", async () => {
    const indice = faker.datatype.number({ min: 2, max: 6 })

    const result = await API(App).post("/prime").send({
      number: dataPrime[indice],
    })

    expect(result.body.prime).toBe(true)
    expect(result.status).toBe(200)
  })

  it("Must failed if not received params of entry", async () => {
    const result = await API(App).post("/prime").send({
      number: null,
    })

    expect(result.body.prime).toBe(false)
    expect(result.status).toBe(200)
  })
})
