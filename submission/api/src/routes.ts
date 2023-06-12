import { Request, Response, Router } from "express"

import { PrimeController } from "./controllers/prime"

export const Routes = Router()

const primeController = new PrimeController()

Routes.post("/prime", primeController.primeValidate)
Routes.get("/status", (request: Request, response: Response) => {
  return response.status(200).send({
    msg: "API ok!",
  })
})
