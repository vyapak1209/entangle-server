export function getPokeBackend() {
    // The SSE impl has to keep process-wide state using the global object.
    // Otherwise the state is lost during hot reload in dev.
    const global = globalThis;
    if (!global._pokeBackend) {
        global._pokeBackend = new PokeBackend();
    }
    return global._pokeBackend;
}
// Implements the poke backend using server-sent events.
export class PokeBackend {
    _listeners;
    constructor() {
        this._listeners = new Map();
    }
    addListener(channel, listener) {
        let set = this._listeners.get(channel);
        if (!set) {
            set = new Set();
            this._listeners.set(channel, set);
        }
        set.add(listener);
        return () => this._removeListener(channel, listener);
    }
    poke(channel) {
        const set = this._listeners.get(channel);
        if (!set) {
            return;
        }
        for (const listener of set) {
            try {
                listener();
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    _removeListener(channel, listener) {
        const set = this._listeners.get(channel);
        if (!set) {
            return;
        }
        set.delete(listener);
    }
}
