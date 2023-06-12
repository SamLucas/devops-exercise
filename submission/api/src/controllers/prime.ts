import { Request, Response } from "express"

import { PrimeService } from "@/services/prime"

const primeService = new PrimeService()

export class PrimeController {
  public async primeValidate(request: Request, response: Response) {
    const { number } = request.body
    try {
      const prime = primeService.validate(number)
      return response.status(200).json({
        number,
        prime,
      })
    } catch (error) {
      return response.status(400).json({ mensage: "Error login" })
    }
  }
}
