import { SystemLog } from "../models/log.model.js";

// Function to log public events directly from controllers (avoids duplicates)
export const logPublicEvent = async (req, action) => {
  try {
    if (!action) return;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '';
    
    // Deduplication check: same action and IP within the last 10 seconds
    const tenSecondsAgo = new Date(Date.now() - 10000);
    const existingLog = await SystemLog.findOne({
      type: 'PUBLIC_ACCESS',
      action,
      ipAddress,
      createdAt: { $gte: tenSecondsAgo }
    });

    if (existingLog) return; // Skip duplicate

    await SystemLog.create({
      type: 'PUBLIC_ACCESS',
      action,
      ipAddress,
      userAgent: req.get('user-agent') || ''
    });
  } catch (error) {
    console.error("Error saving access log:", error);
  }
};

// Middleware to log admin activities
export const logAdminActivity = (actionDescription = null) => {
  return (req, res, next) => {
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 400 && req.admin) {
        const adminId = req.admin._id;
        const adminName = req.admin.name || "Admin";
        
        const details = {
          ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress
        };
        
        let action = req.logAction || (typeof actionDescription === 'function' ? actionDescription(req) : actionDescription);
        if (!action) return; // Skip if no action is provided
        
        // Strip 'Admin ' at the start of the action string since the admin name is displayed in the UI column
        action = action.replace(/^Admin\s+/i, '');
        // Capitalize the first letter
        action = action.charAt(0).toUpperCase() + action.slice(1);
        
        // Append short document ID if present in params and not already in action
        if (req.params.id && !action.includes(req.params.id)) {
          const shortId = req.params.id.length === 24 ? req.params.id.slice(-6) : req.params.id;
          action += ` (#${shortId})`;
          details.documentId = req.params.id;
        }
        
        try {
          await SystemLog.create({
            type: 'ADMIN_ACTIVITY',
            adminId,
            adminName,
            action,
            details
          });
        } catch(err) {
          console.error("Activity log error:", err);
        }
      }
    });
    next();
  };
};
