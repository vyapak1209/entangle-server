import { transact } from '../src/pg';
import { createUser, getUserByUsername, updateGhPat, updateUserDetails } from '../src/user';
export async function handleCreateUser(req, res) {
    const { user } = req.body;
    try {
        const result = await transact(async (executor) => {
            return await createUser(executor, user);
        });
        res.status(result.success ? 201 : 400).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Oops! Something went wrong while creating user" });
    }
}
export async function handleUpdateUserDetails(req, res) {
    const { user } = req.body;
    try {
        const result = await transact(async (executor) => {
            return await updateUserDetails(executor, user);
        });
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Oops! Something went wrong while updating user" });
    }
}
export async function handleUpdateGhPat(req, res) {
    const { userID, ghPat } = req.body;
    try {
        const result = await transact(async (executor) => {
            return await updateGhPat(executor, userID, ghPat);
        });
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Oops! Something went wrong while updating github token" });
    }
}
export async function handleGetUserByUsername(req, res) {
    const { username } = req.params;
    try {
        const result = await transact(async (executor) => {
            return await getUserByUsername(executor, username);
        });
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Oops! Something went wrong while fetching user" });
    }
}
