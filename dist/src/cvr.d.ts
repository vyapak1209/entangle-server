import type { SearchResult } from './data';
export declare type CVR = Record<string, CVREntries>;
export declare type CVREntries = Record<string, number>;
export declare function cvrEntriesFromSearch(result: SearchResult[]): CVREntries;
export declare type CVRDiff = Record<string, CVREntryDiff>;
export declare type CVREntryDiff = {
    puts: string[];
    dels: string[];
};
export declare function diffCVR(prev: CVR, next: CVR): CVRDiff;
export declare function isCVRDiffEmpty(diff: CVRDiff): boolean;
