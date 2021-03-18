const jwt = require("jsonwebtoken");
const APP_SECRET = "HymnApp-is-aw3some";

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("Not authenticated");
}

async function validateUser(context) {
  const { userId } = context;
  try {
    //Check if user is valid
    if (!userId) {
      throw new Error("You are not authorized to use this app");
    }
    //Get user by ID
    const user = await context.prisma.user.findUnique({
      where: { id: userId },
    });

    //Check if user is not admin
    if (!user.isAdmin) {
      throw new Error("You are not allowed to perform this action");
    }
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  APP_SECRET,
  getUserId,
  validateUser,
};
