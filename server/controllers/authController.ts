import { Request, Response } from 'express';
import { store } from '../database/store';
import { User, UserRole } from '../models/types';

export const authController = {
  // Get all available demo accounts for instant switching
  getDemoUsers: (req: Request, res: Response) => {
    const users = store.getUsers();
    res.json({
      success: true,
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        avatar: u.avatar,
        badgeNumber: u.badgeNumber,
      })),
    });
  },

  // Login or Switch User
  login: (req: Request, res: Response) => {
    const { email, role, userId, password } = req.body;

    let user: User | undefined;
    
    // Explicit check for admin credentials
    if (role === 'admin' || (email && email === 'kk6308608@gmail.com')) {
      if (email === 'kk6308608@gmail.com' && password === 'krishna@6308') {
        user = store.getUsers().find(u => u.email === 'kk6308608@gmail.com');
      } else {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
      }
    } else if (userId) {
      user = store.getUserById(userId);
    } else if (email) {
      user = store.getUserByEmail(email);
    } else if (req.body.parentLoginPhone) {
      const phoneToMatch = req.body.parentLoginPhone.trim();
      const girls = store.getUsers().filter(u => u.role === 'girl');
      const matchingGirl = girls.find(girl => 
        girl.emergencyContacts?.some(contact => contact.phone === phoneToMatch)
      );
      
      if (matchingGirl) {
        const matchingContact = matchingGirl.emergencyContacts?.find(c => c.phone === phoneToMatch);
        user = store.getUsers().find(u => u.role === 'parent' && u.phone === phoneToMatch);
        if (!user) {
          const newParent: User = {
            id: `parent-${Date.now()}`,
            name: matchingContact?.name || `Parent of ${matchingGirl.name}`,
            email: `parent_${Date.now()}@example.com`,
            phone: phoneToMatch,
            role: 'parent',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
            emergencyContacts: [],
            safeZones: [],
            createdAt: new Date().toISOString(),
          };
          user = store.createUser(newParent);
        }
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Phone number not recognized. Please register the girl account first and add this number as an emergency contact.' 
        });
      }
    } else if (role) {
      user = store.getUsers().find((u) => u.role === role);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // If parent phone was entered during girl login, update/ensure primary emergency contact
    if (req.body.parentPhone && typeof req.body.parentPhone === 'string' && req.body.parentPhone.trim()) {
      const cleanPhone = req.body.parentPhone.trim();
      const existingContacts = user.emergencyContacts || [];
      const primaryIndex = existingContacts.findIndex((c) => c.isPrimary);
      if (primaryIndex >= 0) {
        existingContacts[primaryIndex].phone = cleanPhone;
      } else {
        existingContacts.unshift({
          id: `contact-${Date.now()}`,
          name: 'Parent / Guardian',
          phone: cleanPhone,
          relation: 'Parent',
          isPrimary: true,
        });
      }
      user.emergencyContacts = [...existingContacts];
    }

    // Mock token for demo session
    const token = `token-${user.id}-${Date.now()}`;
    return res.json({
      success: true,
      token,
      user,
    });
  },

  // Register a new user
  register: (req: Request, res: Response) => {
    const { name, email, phone, role, bloodGroup, address, emergencyContacts } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, and role are required.' });
    }

    const existing = store.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || '+91-00000-00000',
      role: role as UserRole,
      bloodGroup,
      address,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      emergencyContacts: emergencyContacts || [],
      safeZones: [],
      createdAt: new Date().toISOString(),
    };

    store.createUser(newUser);
    const token = `token-${newUser.id}-${Date.now()}`;

    return res.status(201).json({
      success: true,
      token,
      user: newUser,
    });
  },

  // Reset or Recover Password / Emergency PIN
  forgotPassword: (req: Request, res: Response) => {
    const { email, role, newPassword } = req.body;
    if (!email && !role) {
      return res.status(400).json({ success: false, message: 'Email or role is required to reset security PIN.' });
    }

    let user: User | undefined;
    if (email) {
      user = store.getUserByEmail(email);
    } else if (role) {
      user = store.getUsers().find((u) => u.role === role);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered safety account matched this email or role.' });
    }

    // Record audit log for security
    store.addAuditLog(
      'PASSWORD_RESET',
      user.name,
      user.role,
      `Password / Security PIN reset successfully for ${user.email}`
    );

    return res.json({
      success: true,
      message: `Security PIN has been reset for ${user.name} (${user.role.toUpperCase()}). You can now log in.`,
      tempPin: '882200',
    });
  },

  // Get current user profile
  getProfile: (req: Request, res: Response) => {
    const userId = (req.query.userId as string) || req.headers['x-user-id'];
    if (!userId) {
      // Return primary girl demo user by default
      const defaultUser = store.getUsers().find((u) => u.role === 'girl') || store.getUsers()[0];
      return res.json({ success: true, user: defaultUser });
    }

    const user = store.getUserById(userId as string);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  },

  // Update profile
  updateProfile: (req: Request, res: Response) => {
    const { userId, name, phone, bloodGroup, address } = req.body;
    const updated = store.updateUser(userId, { name, phone, bloodGroup, address });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: updated });
  },

  // Update contacts
  updateContacts: (req: Request, res: Response) => {
    const { userId, contacts } = req.body;
    if (!userId || !Array.isArray(contacts)) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }
    const updatedContacts = store.updateContacts(userId, contacts);
    res.json({ success: true, contacts: updatedContacts });
  },

  // Update safe zones
  updateSafeZones: (req: Request, res: Response) => {
    const { userId, safeZones } = req.body;
    if (!userId || !Array.isArray(safeZones)) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }
    const updated = store.updateSafeZones(userId, safeZones);
    res.json({ success: true, safeZones: updated });
  }
};
