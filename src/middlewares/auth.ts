import { ObjectId } from "mongodb";

const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const tokenString = authHeader.split(" ")[1]; // "Bearer <token>"

    if (!tokenString) {
      return res.status(401).json({ message: "Unauthorized - Token missing" });
    }

    const db = req.db;

    const session = await db
      .collection("session")
      .findOne({ token: tokenString });

    if (!session) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid session" });
    }

    if (new Date(session.expiresAt) < new Date()) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Session expired" });
    }

    const user = await db
      .collection("user")
      .findOne({ _id: new ObjectId(session.userId) });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = {
      email: user.email,
      userId: user._id.toString(),
      role: user.role || "user",
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized - Verification failed" });
  }
};

export default verifyToken;
