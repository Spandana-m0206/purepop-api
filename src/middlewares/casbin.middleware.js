const getCasbinEnforcer=require('../config/casbin/casbin')

const authorize = (resource, action) => async (req, res, next) => {
    try {
      const user = req.user; // Assuming user data is attached to req
      const enforcer = await getCasbinEnforcer();
  
      if (!enforcer) {
        return res.status(500).json({ error: 'Failed to get enforcer instance' });
      }
        const role = user.role
        const isAllowed = await enforcer.enforce(role, resource, action);
        if (isAllowed) {
          return next(); // Access granted
        }
  
      return res.status(403).json({ error: 'Access denied' }); // Access denied
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = authorize