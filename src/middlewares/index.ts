import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";
import express from "express";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId || currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["ANTONIO-AUTH"];

    if (!sessionToken) return res.sendStatus(403);

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) return res.sendStatus(403);

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

/**
ex) merge  
const obj1 = {
  name: "John",
  age: 30,
};

const obj2 = {
  age: 35,
  city: "New York",
};

const mergedObj = merge(obj1, obj2);

console.log(mergedObj);
출력: { name: 'John', age: 35, city: 'New York' }
  
 */
