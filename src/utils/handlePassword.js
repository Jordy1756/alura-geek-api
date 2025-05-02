import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config/environment.js";

export const hashPassword = async (password) => await bcrypt.hash(password, +SALT_ROUNDS);

export const validateCredentials = async (password, hash) => await bcrypt.compare(password, hash);
