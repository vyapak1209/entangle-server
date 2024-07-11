import { z } from 'zod';
import { Update } from '@rocicorp/rails';
export declare const listSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    ownerID: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    ownerID: string;
}, {
    id: string;
    title: string;
    ownerID: string;
}>;
export declare type List = z.infer<typeof listSchema>;
export declare type ListUpdate = Update<List>;
export declare const createList: (tx: import("replicache").WriteTransaction, value: {
    id: string;
    title: string;
    ownerID: string;
}) => Promise<boolean>, listLists: (tx: import("replicache").ReadTransaction, options?: import("@rocicorp/rails").ListOptions | undefined) => Promise<{
    id: string;
    title: string;
    ownerID: string;
}[]>, getList: (tx: import("replicache").ReadTransaction, id: string) => Promise<{
    id: string;
    title: string;
    ownerID: string;
} | undefined>, deleteList: (tx: import("replicache").WriteTransaction, id: string) => Promise<void>;
