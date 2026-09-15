import { Request, Response } from 'express';
import { store } from '../database/store';

export const parentController = {
  // Get linked wards (daughters / children) for parent
  getWards: (req: Request, res: Response) => {
    const parentId = (req.query.parentId as string) || 'user-parent-1';
    const parent = store.getUserById(parentId);

    let wards = store.getUsers().filter(
      (u) =>
        u.role === 'girl' &&
        (u.parentId === parentId ||
          (parent?.wardIds && parent.wardIds.includes(u.id)) ||
          (parent?.phone &&
            u.emergencyContacts?.some(
              (c) => c.phone.replace(/[^0-9]/g, '') === parent.phone.replace(/[^0-9]/g, '')
            )))
    );

    // No fallback to all girls; only return explicitly linked wards.

    res.json({
      success: true,
      count: wards.length,
      wards: wards.map((w) => {
        const activeEmergency = store
          .getEmergenciesForUser(w.id)
          .find((e) => e.status === 'active' || e.status === 'assigned' || e.status === 'in_progress');

        return {
          ...w,
          hasActiveEmergency: Boolean(activeEmergency),
          activeEmergency,
        };
      }),
    });
  },

  // Get alerts relevant to parent
  getAlerts: (req: Request, res: Response) => {
    const alerts = store
      .getNotifications()
      .filter((n) => n.targetRoles.includes('parent'));

    res.json({ success: true, alerts });
  },
};
