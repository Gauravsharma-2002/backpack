import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    orgin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("Public"));
app.use(cookieParser());

// now underStand this ... we are importing the routes and then specifying what to do with it

//THIS ARE STANDARD PRACTICE AND HAS TO BE FOLLOWED
//route import
import  route  from "./routes/user.routes.js";

// route consumption

// as a middelware when u  hit the route
//we dont here do the get or post method directly we will  do it in the userRouter{Routes function} as we have segregated the code in different directory

app.use("/api/v1/user", route); // means on hitting /api/v1/user  we will controll is transfered to userRoutes of Routes
// this will give control to user routes forExample localhost:3000/api/v1/user/{register/login/anyOtherRouteInUserRoutes}
export { app };
