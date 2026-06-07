// Middleware to restrict access to administrator accounts only
const verifyAdmin = (req, res, next) => {
    // req.user is populated by the preceding verifyToken middleware
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access Denied: Administrator role required' });
    }
    next();
};

export default verifyAdmin;
