import mongoose, { Schema } from "mongoose";
import { UserAuthType } from "@/controllers/types/auth-user-type";

const UserAuthSchema = new Schema<UserAuthType>(
  {
    // email: { type: String, required: true },
    username: { type: String, required: true },
  },
  { versionKey: false }
);

export const UserAuthModel = mongoose.model<UserAuthType>(
  "userAuth",
  UserAuthSchema
);
