import getenv from "getenv"

import app from "./app"

const port = getenv.int("API_PORT", 8080)

app.listen(port)
