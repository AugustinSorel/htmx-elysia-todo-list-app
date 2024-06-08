import Elysia from "elysia";
import { db } from "../db";

export const ctx = new Elysia().decorate("db", db);
