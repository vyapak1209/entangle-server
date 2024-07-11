import { nanoid } from "nanoid";
export async function createUser(executor, user) {
    const { userID, username, ghRepoName, ghPat } = user;
    const ghPatExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000);
    if (userID) {
        const { rows } = await executor(`select 1 from entangle_user where userid = $1`, [userID]);
        if (rows.length > 0) {
            return { success: false, message: 'User already exists' };
        }
    }
    let newUserID = nanoid(6);
    await executor(`insert into entangle_user (userid, username, gh_repo_name, gh_pat, gh_pat_expiry, lastmodified) values ($1, $2, $3, $4, $5, now())`, [newUserID, username, ghRepoName, ghPat, ghPatExpiry]);
    return { success: true, message: 'User created successfully', user: {
            userID: newUserID,
            username,
            ghRepoName,
            ghPat
        } };
}
export async function getUserByUsername(executor, username) {
    const { rows } = await executor(`select * from entangle_user where username = $1`, [username]);
    if (rows.length === 0) {
        return { success: false, message: 'User not found' };
    }
    return { success: true, user: rows[0] };
}
export async function updateUserDetails(executor, userUpdate) {
    const { rowCount } = await executor(`update entangle_user set gh_repo_name = $1, gh_pat = $2, lastmodified = now() where userid = $3`, [userUpdate.ghRepoName, userUpdate.ghPat, userUpdate.userID]);
    if (rowCount === 0) {
        return { success: false, message: 'User not found' };
    }
    return { success: true, message: 'User details updated successfully' };
}
export async function updateGhPat(executor, userID, ghPat) {
    const ghPatExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 Hours
    const { rowCount } = await executor(`update entangle_user set gh_pat = $1, gh_pat_expiry = $2, lastmodified = now() where userid = $3`, [ghPat, ghPatExpiry, userID]);
    if (rowCount === 0) {
        return { success: false, message: 'User not found' };
    }
    return { success: true, message: 'GitHub token updated successfully' };
}
export async function checkGhPatExpiry(executor, userID) {
    const { rows } = await executor(`select gh_pat_expiry from entangle_user where userid = $1`, [userID]);
    if (rows.length === 0) {
        return { success: false, message: 'User not found' };
    }
    const ghPatExpiry = new Date(rows[0].gh_pat_expiry);
    const now = new Date();
    if (now > ghPatExpiry) {
        await executor(`update entangle_user set gh_pat = null, gh_pat_expiry = null, lastmodified = now() where userid = $1`, [userID]);
        return { success: false, message: 'Forbidden: GitHub token expired' };
    }
    return { success: true, message: 'GitHub token is valid' };
}
