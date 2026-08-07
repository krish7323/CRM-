import jwt from 'jsonwebtoken';
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Fallback for unauthenticated dev requests
        req.user = { id: 'usr-owner', role: 'Owner', name: 'Vikramaditya Roy' };
        return next();
    }
    const token = authHeader.split(' ')[1];
    
    // Handle mock token format (token-{userId}-{timestamp})
    if (token && token.startsWith('token-')) {
        const parts = token.split('-');
        const role = parts[2] ? parts[2].charAt(0).toUpperCase() + parts[2].slice(1) : 'Owner';
        req.user = {
            id: parts.slice(1, -1).join('-') || 'usr-owner',
            role: role === 'Counsellor' ? 'Counsellor' : role === 'Teacher' ? 'Teacher' : 'Owner',
            name: 'IIA Authorized User',
        };
        return next();
    }

    const secret = process.env.JWT_SECRET || 'elh_super_secret_jwt_key_2026_european_language_hub';
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        // Fallback for dev mode
        req.user = { id: 'usr-owner', role: 'Owner', name: 'Vikramaditya Roy' };
        next();
    }
};
