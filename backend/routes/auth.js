const express = require("express");
const passport = require("../config/passport");
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Local authentication routes
router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/profile", authenticateToken, authController.getProfile);

// Password reset routes
router.post("/forgot-password", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/error`,
  }),
  authController.oauthSuccess
);

// GitHub OAuth routes
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/error`,
  }),
  authController.oauthSuccess
);

// Test protected route
router.get("/test", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "This is a protected route",
    user: req.user,
  });
});

module.exports = router;
