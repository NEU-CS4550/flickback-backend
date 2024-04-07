import { users } from "../database/models.js";
import { hash, verify } from "@node-rs/argon2";
import jwt from "jsonwebtoken";

// password must have:
// - 6 characters or more
// - a special character
// - a number
export const register = async (username, password, role = "USER") => {
  const exists = await users.findOne({ username: username }).count();
  if (exists > 0) {
    return { type: "error", message: "User already exists." };
  }

  // test password against requirements
  var special = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  var number = /\d/;
  if (
    password.length < 6 ||
    !special.test(password) ||
    !number.test(password)
  ) {
    return {
      type: "error",
      message:
        "Password must be 6 characters or more and contain a special character and a number.",
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
    token: generateToken(record._id, username, role),
  };
};

export const login = async (username, password) => {
  // check if user exists
  const record = await users.findOne({ username: username });
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
      message: "Incorrect password.",
    };
  }

  return await {
    type: "success",
    token: generateToken(record._id, username, record.role),
  };
};

// Generate JWT token
const generateToken = (id, username, role) => {
  return jwt.sign(
    {
      id,
      username,
      role,
    },
    process.env.JWT_SECRET
  );
};

// Verify JWT token
export const authenticate = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const cookieSettings = {
  domain: new URL(process.env.FRONTEND_URL).hostname,
  httpOnly: true,
  secure: true,
  signed: true,
  maxAge: 86400000, // 1 day
};
