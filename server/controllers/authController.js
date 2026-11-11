import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Attendee from '../models/Attendee.js';
import Exhibitor from '../models/Exhibitor.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'eventsphere_super_secret_jwt_key_2026_production', {
    expiresIn: '30d'
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password, role, phone, company, bio } = req.body;

    // Strict Validation: Name, Email & Password required
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters in length.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = (username || email.split('@')[0]).toLowerCase().trim();

    // Strict Role Security: Public registration can NEVER provision admin accounts
    const allowedPublicRoles = ['attendee', 'exhibitor'];
    const assignedRole = allowedPublicRoles.includes(role?.toLowerCase()) ? role.toLowerCase() : 'attendee';

    const userExists = await User.findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email or username already exists.' });
    }

    const user = await User.create({
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password,
      role: assignedRole,
      phone: phone || '',
      company: company || '',
      bio: bio || ''
    });

    if (user.role === 'attendee') {
      await Attendee.create({
        userId: user._id,
        bio: bio || '',
        company: company || ''
      });
    } else if (user.role === 'exhibitor') {
      await Exhibitor.create({
        userId: user._id,
        companyName: company || name || 'Exhibitor Enterprise',
        description: bio || 'Official Exhibitor Enterprise Partner',
        contactEmail: cleanEmail,
        contactPhone: phone || ''
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      company: user.company,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        company: user.company,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password credentials.' });
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};
