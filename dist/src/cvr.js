export function cvrEntriesFromSearch(result) {
    const r = {};
    for (const row of result) {
        r[row.id] = row.rowversion;
    }
    return r;
}
export function diffCVR(prev, next) {
    const r = {};
    const names = [...new Set([...Object.keys(prev), ...Object.keys(next)])];
    for (const name of names) {
        const prevEntries = prev[name] ?? {};
        const nextEntries = next[name] ?? {};
        r[name] = {
            puts: Object.keys(nextEntries).filter(id => prevEntries[id] === undefined || prevEntries[id] < nextEntries[id]),
            dels: Object.keys(prevEntries).filter(id => nextEntries[id] === undefined),
        };
    }
    return r;
}
export function isCVRDiffEmpty(diff) {
    return Object.values(diff).every(e => e.puts.length === 0 && e.dels.length === 0);
}
