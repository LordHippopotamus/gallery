import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";

import { default as authRouter } from "./routes/auth.js";
import { default as storageRouter } from "./routes/storage.js";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);
app.use(storageRouter);
app.listen(3000);
