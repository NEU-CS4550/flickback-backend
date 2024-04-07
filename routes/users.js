import { users } from "../database/models.js";
import { hash, verify } from "@node-rs/argon2";
import { error, success } from "../utils/http.js";

export default function UserRoutes(app) {
  // Get list of all users
  app.get("/users", async (req, res) => {
    const response = await users.find({});
    res.json(response);
  });

  // Register a new user
  // password must have:
  // - 6 characters or more
  // - a special character
  // - a number
  app.post("/users/register", async (req, res) => {
    const user = req.body;

    // check if user exists
    const exists = await users.findOne({ username: user.username }).count();
    if (exists > 0) {
      return error(res, "User already exists.");
    }

    // test password against requirements
    var special = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    var number = /\d/;
    if (
      user.password.length < 6 ||
      !special.test(user.password) ||
      !number.test(user.password)
    ) {
      return error(
        res,
        "Password must be 6 characters or more and contain a special character and a number."
      );
    }

    // hash password and create user
    await users.create({
      username: user.username,
      passwordHash: await hash(user.password),
    });
    return success(res);
  });

  // Login existing user
  app.post("/users/login", async (req, res) => {
    const user = req.body;

    // check if user exists
    const record = await users.findOne({ username: user.username });
    if (!record) {
      return error(res, "User does not exist");
    }

    // verify password matches
    const passwordMatch = await verify(record.passwordHash, user.password);
    if (!passwordMatch) {
      return error(res, "Incorrect password");
    }

    return success(res);
  });
}
