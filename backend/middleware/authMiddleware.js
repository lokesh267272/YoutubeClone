import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Protected routes expect a Bearer token in the request header.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Attach the decoded user payload so controllers can trust req.user.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default protect;
