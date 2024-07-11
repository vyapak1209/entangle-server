import { transact } from '../pg';
import {
    createUser,
    getUserByUsername,
    updateGhPat,
    updateUserDetails
} from '../user';

import type Express from 'express';


export async function handleCreateUser(req: Express.Request, res: Express.Response) {
    const { user } = req.body;

    try {
        const result = await transact(async executor => {
            return await createUser(executor, user);
        });
        res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: "Oops! Something went wrong while creating user" });
    }
}


export async function handleUpdateUserDetails(req: Express.Request, res: Express.Response) {
    const { user } = req.body;
  
    try {
      const result = await transact(async executor => {
        return await updateUserDetails(executor, user);
      });
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: "Oops! Something went wrong while updating user" });
    }
  }


  export async function handleUpdateGhPat(req: Express.Request, res: Express.Response) {
    const { userID, ghPat } = req.body;
  
    try {
      const result = await transact(async executor => {
        return await updateGhPat(executor, userID, ghPat);
      });
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: "Oops! Something went wrong while updating github token" });
    }
  }


export async function handleGetUserByUsername(req: Express.Request, res: Express.Response) {
    const { username } = req.params;

    try {
        const result = await transact(async executor => {
            return await getUserByUsername(executor, username);
        });
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: "Oops! Something went wrong while fetching user" });
    }
}