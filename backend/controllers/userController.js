import User from '../models/User.js';

export const getMyProfile = async (req, res) => {
  const user = req.user; // set by authMiddleware
  res.status(200).json({
    icon: '✅',
    message: 'User profile fetched',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

export const updateMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ icon: '❌', message: 'User not found' });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password; // Will hash via pre-save
  }

  const updated = await user.save();

  res.status(200).json({
    icon: '✅',
    message: 'Profile updated successfully',
    user: {
      id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role
    }
  });
};
