import dotenv from "dotenv";
import DB_CONNECT from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./env" });

DB_CONNECT()
  .then(() => {
    app.on("error", (err) => {
      console.error("error occured in server connection db connected", err);
      throw  err;
    });
    const server = app.listen(process.env.PORT || 8080, () => {
      console.log(`server listing at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("error occured while server connection ", error);
    throw error;
  });
