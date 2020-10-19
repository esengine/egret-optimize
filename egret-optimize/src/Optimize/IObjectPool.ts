module optimize {
    export interface IObjectPool<T> {
        recycle(go: T, pool: number | string);
        preallocate(pool: number | string, size: number, onFirstUse: ()=>T);
        use(pool: number | string, onFirstUse: ()=>T);
    }
}