export declare function getPokeBackend(): PokeBackend;
export declare class PokeBackend {
    private _listeners;
    constructor();
    addListener(channel: string, listener: () => void): () => void;
    poke(channel: string): void;
    private _removeListener;
}
