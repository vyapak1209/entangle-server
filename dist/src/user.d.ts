import { Executor } from "./pg";
export declare type User = {
    userID: string;
    username: string;
    ghRepoName: string | null;
    ghPat: string | null;
};
export declare type UpdateUserRequest = Omit<User, "username">;
export declare function createUser(executor: Executor, user: User): Promise<{
    success: boolean;
    message: string;
    user?: User;
}>;
export declare function getUserByUsername(executor: Executor, username: string): Promise<{
    success: boolean;
    user?: any;
    message?: string;
}>;
export declare function updateUserDetails(executor: Executor, userUpdate: UpdateUserRequest): Promise<{
    success: boolean;
    message: string;
}>;
export declare function updateGhPat(executor: Executor, userID: string, ghPat: string): Promise<{
    success: boolean;
    message: string;
}>;
export declare function checkGhPatExpiry(executor: Executor, userID: string): Promise<{
    success: boolean;
    message: string;
}>;
