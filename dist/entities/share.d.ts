import { z } from 'zod';
export declare const shareSchema: z.ZodObject<{
    id: z.ZodString;
    listID: z.ZodString;
    userID: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    listID: string;
    userID: string;
}, {
    id: string;
    listID: string;
    userID: string;
}>;
export declare type Share = z.infer<typeof shareSchema>;
export declare const createShare: (tx: import("replicache").WriteTransaction, value: {
    id: string;
    listID: string;
    userID: string;
}) => Promise<boolean>, listShares: (tx: import("replicache").ReadTransaction, options?: import("@rocicorp/rails").ListOptions | undefined) => Promise<{
    id: string;
    listID: string;
    userID: string;
}[]>, deleteShare: (tx: import("replicache").WriteTransaction, id: string) => Promise<void>;
