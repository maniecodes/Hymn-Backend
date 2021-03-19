const jwt = require("jsonwebtoken");
const { createWriteStream, unlink, existsSync, mkdirSync } = require("fs");
const path = require("path");
const cryptoRandomString = require("crypto-random-string");

function getTokenPayload(token) {
  return jwt.verify(token, process.env.APP_SECRET);
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

async function singleUpload(file, filePath) {
  const { createReadStream, filename, mimetype, encoding } = await file;
  console.log("got here");
  console.log(filename);
  const dir = `uploads/${filePath}`;
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  let url;
  const stream = createReadStream();
  if (
    mimetype == "image/png" ||
    mimetype === "image/jpg" ||
    mimetype === "image/jpeg" ||
    mimetype === "application/pdf"
  ) {
    const { ext } = path.parse(filename);
    const randomName = cryptoRandomString({ length: 12 }) + ext;
    const pathName = path.join(__dirname, `../../${dir}/${randomName}`);
    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream(pathName);
      writeStream.on("finish", resolve);
      writeStream.on("error", (error) => {
        unlink(path, () => {
          reject(error);
        });
      });
      stream.on("error", (error) => writeStream.destroy(error));
      // Pipe the upload into the write stream.
      stream.pipe(writeStream);
    });

    url = `http://localhost:4000/${dir}/${randomName}`;

    return url;
  } else {
    throw new Error("Unsupported");
  }
}

module.exports = {
  getUserId,
  validateUser,
  singleUpload,
};
