export const requireRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthenticated user' });
        }
        const userRole = req.user.role;
        const isAdmin = userRole === 'Owner' || userRole === 'Admin' || userRole === 'Owner/Admin';
        if (!isAdmin && !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Role '${userRole}' does not have permission for this resource. Required: ${allowedRoles.join(', ')}`,
            });
        }
        next();
    };
};
