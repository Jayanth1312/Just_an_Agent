const User = require("../models/User");
const jwt = require("jsonwebtoken");
const modernEmailService = require("../services/resendEmail");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: "7d",
  });
};

const register = async (req, res) => {
  try {
    const { email, name, profession, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, name, and password are required",
      });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser && existingUser.isEmailVerified) {
      // Check if this is an OAuth user
      if (existingUser.oauthProvider) {
        return res.status(409).json({
          success: false,
          message: `An account with this email already exists using ${existingUser.oauthProvider}. Please sign in with ${existingUser.oauthProvider} instead.`,
          requiresOAuth: true,
          oauthProvider: existingUser.oauthProvider,
        });
      }

      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    let user;
    if (existingUser && !existingUser.isEmailVerified) {
      user = existingUser;
      user.name = name;
      user.profession = profession;
      user.password = password;
    } else {
      // Create new user
      user = new User({
        email,
        name,
        profession,
        password,
        isEmailVerified: false,
      });
    }

    // Generate and set OTP
    const otp = user.createEmailVerificationOTP();
    await user.save();

    // Send OTP via email
    try {
      const emailResult = await modernEmailService.sendVerificationOTP(
        email,
        name,
        otp
      );
      console.log(
        "📧 Email service result:",
        emailResult.message || "Email sent successfully"
      );
    } catch (emailError) {
      console.error("⚠️  Email service error:", emailError.message);

      // In development, continue anyway since OTP is logged to console
      if (process.env.NODE_ENV !== "production") {
        console.log(`🔐 Development Mode: OTP for ${email} is: ${otp}`);
        console.log("💡 Use this OTP to verify your account");
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to send verification email",
        });
      }
    }

    const responseMessage =
      process.env.NODE_ENV !== "production"
        ? "Verification OTP sent to your email (check terminal for development OTP)"
        : "Verification OTP sent to your email";

    res.status(201).json({
      success: true,
      message: responseMessage,
      email: email,
      requiresVerification: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
};

// Verify OTP and complete registration
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Verify OTP
    if (!user.verifyEmailVerificationOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.clearEmailVerificationOTP();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during verification",
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new OTP
    const otp = user.createEmailVerificationOTP();
    await user.save();

    // Send OTP via email
    try {
      const emailResult = await modernEmailService.sendVerificationOTP(
        user.email,
        user.name,
        otp
      );
      console.log(
        emailResult.message || "Email sent successfully"
      );
    } catch (emailError) {
      console.error(emailError.message);

      // In development, continue anyway since OTP is logged to console
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `🔐 Development Mode: New OTP for ${user.email} is: ${otp}`
        );
        console.log("💡 Use this OTP to verify your account");
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to send verification email",
        });
      }
    }

    const responseMessage =
      process.env.NODE_ENV !== "production"
        ? "New OTP sent to your email (check terminal for development OTP)"
        : "New OTP sent to your email";

    res.status(200).json({
      success: true,
      message: responseMessage,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user registered via OAuth and doesn't have a password
    if (user.oauthProvider && !user.password) {
      return res.status(400).json({
        success: false,
        message: `This account was created using ${user.oauthProvider}. Please sign in with ${user.oauthProvider} instead.`,
        requiresOAuth: true,
        oauthProvider: user.oauthProvider,
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: "Login successful",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};

// Logout user
const logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    success: true,
    message: "Logout successful",
  });
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// OAuth success handler
const oauthSuccess = (req, res) => {
  try {
    console.log("🔐 OAuth Success - User data:", {
      id: req.user._id,
      email: req.user.email,
      isNewUser: req.user.isNewUser,
    });

    const token = generateToken(req.user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectPath = req.user.isNewUser ? "/welcome" : "/home";

    res.redirect(`${frontendURL}${redirectPath}`);
  } catch (error) {
    console.error("OAuth success error:", error);
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendURL}/auth/error`);
  }
};

// OAuth failure handler
const oauthFailure = (req, res) => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
  res.redirect(`${frontendURL}/auth/error`);
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, we've sent a password reset link",
      });
    }

    // Check if user has a password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses social login. Please sign in with Google or GitHub.",
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    try {
      const emailResult = await modernEmailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken
      );
      console.log(
        emailResult.message || "Email sent successfully"
      );
    } catch (emailError) {
      console.error(emailError.message);

      if (process.env.NODE_ENV !== "production") {
        console.log(`🔗 Development Mode: Reset link for ${user.email}`);
        console.log(
          `Reset URL: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        );
        console.log("💡 Use this link to reset your password");
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to send password reset email",
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash the token to compare with stored hash
    const crypto = require("crypto");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    // Update password and clear reset fields
    user.password = password;
    user.clearPasswordReset();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Verify reset token validity
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    // Hash the token to compare with stored hash
    const crypto = require("crypto");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  logout,
  getProfile,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
  oauthSuccess,
};
