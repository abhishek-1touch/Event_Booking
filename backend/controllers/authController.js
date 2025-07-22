import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../services/emailServices.js';
import crypto from 'crypto';


// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ icon: '❌', message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    // ✅ Send Welcome Email
    await sendEmail({
      to: user.email,
      subject: '🎉 Welcome to Event Booker!',
      template: 'welcomeEmail.html',
      variables: { name: user.name }
    });

    // ⏳ Schedule Email Verification after 5 minutes
    setTimeout(async () => {
      try {
        const verifyToken = crypto.randomBytes(32).toString('hex');
        user.verifyToken = verifyToken;
        await user.save();

   const verifyUrl = `${process.env.BASE_URL}/api/auth/verify/${verifyToken}`;
        await sendEmail({
          to: user.email,
          subject: '📩 Verify Your Email',
          template: 'verifyEmail.html',
          variables: { name: user.name, verifyUrl }
        });

        console.log(`✅ Verification email sent to ${user.email}`);
      } catch (err) {
        console.error(`❌ Error sending verification email: ${err.message}`);
      }
    }, 5 * 60 * 1000);

    res.status(201).json({
      icon: '✅',
      message: 'Registration successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ icon: '❌', message: 'Server error' });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ icon: '❌', message: 'Invalid email or password' });
    }

    // ✅ Login Alert Email
    await sendEmail({
      to: user.email,
      subject: '🔐 Login Alert - Event Booker',
      template: 'loginNotification.html',
      variables: {
        name: user.name,
        time: new Date().toLocaleString()
      }
    });

    res.status(200).json({
      icon: '✅',
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ icon: '❌', message: 'Server error' });
  }
};

// 📩 Send Verification Manually
export const sendVerificationEmail = async (req, res) => {
  try {
    const { user } = req;

    // ✅ Check if already verified
    if (user.verified) {
      return res.status(400).json({
        icon: '❌',
        message: 'User already verified'
      });
    }

    // ✅ Generate and save new token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    user.verifyToken = verifyToken;
    await user.save();

    // ✅ Construct and send verification email
    const verifyUrl = `${process.env.BASE_URL}/api/auth/verify/${verifyToken}`;
    await sendEmail({
      to: user.email,
      subject: '📩 Verify Your Email',
      template: 'verifyEmail.html',
      variables: { name: user.name, verifyUrl }
    });

    res.status(200).json({
      icon: '✅',
      message: 'Verification email sent'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      icon: '❌',
      message: 'Error sending verification email'
    });
  }
};

// ✅ Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verifyToken: token });
    if (!user) {
      return res.status(400).json({ icon: '❌', message: 'Invalid or expired token' });
    }

    user.verified = true;
    user.verifyToken = null;
    await user.save();

    res.status(200).json({ icon: '✅', message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ icon: '❌', message: 'Server error' });
  }
};

// 🔐 Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        icon: '❌',
        message: 'User not found',
      });
    }

    // ✅ Generate reset token and expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.BASE_URL}/api/auth/reset-password/${resetToken}`;

    // ✅ Send email
    await sendEmail({
      to: user.email,
      subject: '🔁 Reset Your Password - Event Booker',
      template: 'resetPassword.html',
      variables: {
        name: user.name,
        resetUrl,
      },
    });

    res.status(200).json({
      icon: '✅',
      message: 'Reset password email sent successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      icon: '❌',
      message: 'Server error',
    });
  }
};


// 🔁 Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        icon: '❌',
        message: 'Invalid or expired token',
      });
    }

    // ✅ Update password and clear reset token
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    // ✅ Send confirmation email
    await sendEmail({
      to: user.email,
      subject: '✅ Your Password Has Been Updated',
      template: 'passwordUpdated.html',
      variables: {
        name: user.name,
      },
    });

    res.status(200).json({
      icon: '✅',
      message: 'Password has been successfully updated',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      icon: '❌',
      message: 'Server error',
    });
  }
};

