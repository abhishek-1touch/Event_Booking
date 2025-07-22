import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        icon: '❌',
        message: 'User already exists',
      });
    }

    const user = await User.create({ name, email, password, role });

    return res.status(201).json({
      icon: '✅',
      message: 'Registration successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      icon: '❌',
      message: 'Server error',
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        icon: '❌',
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      icon: '✅',
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      icon: '❌',
      message: 'Server error',
    });
  }
};
