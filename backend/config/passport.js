require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          oauthProvider: "google",
          oauthId: profile.id,
        });

        if (user) {
          await user.save();
          console.log(`🔁 Existing Google user login: ${user.email}`);
          return done(null, { ...user.toObject(), isNewUser: false });
        }

        user = await User.findByEmail(profile.emails[0].value);

        if (user) {
          user.oauthProvider = "google";
          user.oauthId = profile.id;
          user.isEmailVerified = true;
          if (!user.avatar && profile.photos && profile.photos[0]) {
            user.avatar = profile.photos[0].value;
          }
          await user.save();
          console.log(
            `🔗 Linked Google account to existing user: ${user.email}`
          );
          return done(null, { ...user.toObject(), isNewUser: false });
        }

        // Create new user
        user = new User({
          email: profile.emails[0].value,
          name: profile.displayName,
          oauthProvider: "google",
          oauthId: profile.id,
          avatar:
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : null,
          isEmailVerified: true,
        });

        await user.save();
        console.log(`✨ New Google user created: ${user.email}`);
        done(null, { ...user.toObject(), isNewUser: true });
      } catch (error) {
        console.error("Google OAuth error:", error);
        done(error, null);
      }
    }
  )
);

// GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          oauthProvider: "github",
          oauthId: profile.id,
        });

        if (user) {
          await user.save();
          console.log(`🔁 Existing GitHub user login: ${user.email}`);
          return done(null, { ...user.toObject(), isNewUser: false });
        }

        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (email) {
          user = await User.findByEmail(email);

          if (user) {
            user.oauthProvider = "github";
            user.oauthId = profile.id;
            user.isEmailVerified = true;
            if (!user.avatar && profile.photos && profile.photos[0]) {
              user.avatar = profile.photos[0].value;
            }
            await user.save();
            console.log(
              `🔗 Linked GitHub account to existing user: ${user.email}`
            );
            return done(null, { ...user.toObject(), isNewUser: false });
          }
        }

        user = new User({
          email: email || `${profile.username}@github.local`,
          name: profile.displayName || profile.username,
          oauthProvider: "github",
          oauthId: profile.id,
          avatar:
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : null,
          isEmailVerified: !!email,
        });

        await user.save();
        console.log(
          `✨ New GitHub user created: ${user.email || profile.username}`
        );
        done(null, { ...user.toObject(), isNewUser: true });
      } catch (error) {
        console.error("GitHub OAuth error:", error);
        done(error, null);
      }
    }
  )
);

module.exports = passport;
