import { users } from "../database/models.js";
import { hash, verify } from "@node-rs/argon2";
import jwt from "jsonwebtoken";

// password must have 6 chars or more
export const register = async (username, password, role = "USER") => {
  if (username.length < 3) {
    return {
      type: "error",
      message: "Username must be at least 3 characters.",
    };
  }

  const exists = await users.exists({
    username: { $regex: `^${username}$`, $options: "i" },
  });
  if (exists) {
    return { type: "error", message: "Username already in use." };
  }

  if (password.length < 6) {
    return {
      type: "error",
      message: "Password must be at least 6 characters.",
    };
  }

  // hash password and create user
  const record = await users.create({
    username: username,
    passwordHash: await hash(password),
    role: role,
  });

  return await {
    type: "success",
    token: generateToken(record),
  };
};

export const login = async (username, password) => {
  // check if user exists
  const record = await users.findOne({
    username: { $regex: `^${username}$`, $options: "i" },
  });
  if (!record) {
    return {
      type: "error",
      message: "User does not exist.",
    };
  }

  // verify password matches
  const passwordMatch = await verify(record.passwordHash, password);
  if (!passwordMatch) {
    return {
      type: "error",
      message: "Incorrect password. xxxxxxxxxx",
    };
  }

  return await {
    type: "success",
    token: generateToken(record),
  };
};

// Generate JWT token
const generateToken = (record) => {
  let rec = Object.assign({}, record)._doc;
  delete rec.passwordHash;
  rec.id = record._id.toString();
  delete rec._id;
  delete rec.registered;
  return jwt.sign(rec, process.env.JWT_SECRET);
};

// Verify JWT token
export const authenticate = (token) => {
  if (!token) {
    return null;
  }

  token = token.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET);
};

/*export const cookieSettings = {
  domain:
    process.env.COOKIE_DOMAIN ?? new URL(process.env.FRONTEND_URL).hostname,
  httpOnly: true,
  secure: true,
  signed: true,
  maxAge: 86400000, // 1 day
};*/
