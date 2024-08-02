import type { RequestHandler } from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { dbClient } from "../utils/dbClient";

// Inspiration for all this is: https://github.com/fractal-bootcamp/brunoIntegrations/blob/e11060945c4b39c33c4c25793b4bf0a088fb1c0e/backend/middleware.ts#L49

// export const config = {
//     matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

//For reference, the Person type is defined in the prisma schema as follows
// id: number;
// clerkId: string;
// firstName: string;
// lastName: string;
// email: string;
// createdAt: Date;
// updatedAt: Date | null;
// This could be handled in a unified way, e.g.
// import type { Person } from "@prisma/client";

type User = {
  id: number;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
};

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
    auth?: {
      userId: string;
    };
  }
}

interface Request {
  user?: User;
  auth?: Auth; // Ensure this matches the existing type definition
}

type Auth = {
  userId: string;
  sessionId: string;
  getUser: () => Promise<User>;
};

//This creates an Express middleware function named OptionalUser
//optional because if the user is already in the database, assign the found
//user to req.user
export const optionalUser: RequestHandler = async (req, res, next) => {
  console.log("optionalUser middleware called with", req.auth);
  // grab the token from the Authorization header
  // the format is ALWAYS `Bearer ${token}`
  const token = req.headers.authorization?.split(" ")[1];
  // Extract the Clerk user Id from the request's auth property
  const clerkId = req.auth?.userId;
  //if there is a Clerk user ID
  if (clerkId) {
    //look up the user in the database using prisma
    const user = await dbClient.person.findFirst({
      where: {
        clerkId, //Match the Clerk user ID
      },
    });
    //if a user is found in the database
    if (user) {
      console.log("found user!", user);
      // if user does exist, assign user to req.user
      // modify the request context to include a user property
      req.user = user;
    } else {
      //If the user is not found in the database, fetch the user from Clerk
      const clerkUser = await clerkClient.users.getUser(clerkId);
      // Extract the email address from the Clerk user data
      // we need to add it as data for the User model
      const email = clerkUser.emailAddresses[0].emailAddress;
      // create a new user in the database with the Clerk user ID and email
      //extracted from above

      const firstName: string = clerkUser.firstName ?? "";
      const lastName: string = clerkUser.lastName ?? "";

      const newUser = await dbClient.person.create({
        data: {
          clerkId,
          email,
          firstName,
          lastName,
        },
      });
      console.log("created a user!", newUser);
      //assign req.user to the New User
      req.user = newUser;
    }
    //log the user (whether found or newly created)
    console.log("user is", user);
  }
  //call the next middleware function in the stack
  next();
};
