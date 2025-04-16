module.exports = function authorizeRole(requiredRole) {
  return (req, res, next) => {
    const roles = req.auth?.realm_access?.roles || [];

    if (!roles.includes(requiredRole)) {
      return res
        .status(403)
        .json({ error: "Access denied: insufficient role" });
    }

    next();
  };
};
