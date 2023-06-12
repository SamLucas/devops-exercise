import express from "express"
import getenv from "getenv"
import cors from "cors"

import { Routes } from "./routes"

import morgan from "morgan"

class App {
  public express: express.Application

  public constructor() {
    this.express = express()
    this.middlewares()
    this.routes()
  }

  private middlewares(): void {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(morgan(getenv.string("MORGAN_TYPE", "dev")))
  }

  private routes(): void {
    this.express.use(Routes)
  }
}

export default new App().express
