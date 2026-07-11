import { getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { onRequest } from "firebase-functions/v2/https";

const app = getApp()
const auth = getAuth(app);


export const seed = onRequest(async (req, res) => {
  if (!process.env.FUNCTIONS_EMULATOR) {
    res.status(403).send("This endpoint is only available in the Firebase emulator.");
    return;
  }
  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error("Auth emulator is not running.");
  }

  const SEEDUSERS = [
    { email: "user1@example.com", password: "password1", uid: "uid1" },
    { email: "user2@example.com", password: "password2", uid: "uid2" }
  ]

  for (const user of SEEDUSERS) {
    await auth.createUser({
      uid: user.uid,
      email: user.email,
      password: user.password,
    });
  }
  
  res.send("Seed complete");
});
