import { Router } from "express";
const router = new Router();

import passport from "passport";
import GitHubStrategy from "passport-github2";

import { config } from "dotenv";
import { prisma } from "../lib/prisma.js";
config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await prisma.user.findFirst({
        where: { name: profile.username },
      });
      if (!user) {
        user = await prisma.user.create({ data: { name: profile.username } });
      }
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

router.get("/users", async (req, res) =>
  res.json(await prisma.user.findMany())
);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github"),
  (req, res) => res.redirect(process.env.ORIGIN)
);

router.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ id: req.user.id, name: req.user.username });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(process.env.ORIGIN);
  });
});

export default router;
