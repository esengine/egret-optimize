module optimize {
    export class ObjectPool<T> implements IObjectPool<T> {
        public readonly alreadyRecycled: Set<T> = new Set<T>();
        protected readonly _pools: Map<number, T[]> = new Map<number, T[]>();
        protected readonly _namedPools: Map<string, T[]> = new Map<string, T[]>();

        public _objectsReused: number = 0;
        public _objectsCreated: number = 0;
        public _objectsRecyled: number = 0;
        constructor() {
            this._pools.clear();
            this._namedPools.clear();
            this.alreadyRecycled.clear();
        }

        public dispose() {
            this._pools.clear();
            this._namedPools.clear();
        }

        public recycle(go: T, pool: number | string) {
            this.internalRecycle(go, pool);
        }

        public preallocate(pool: number | string, size: number, onFirstUse: Function) {
            for (let i = size - 1; i >= 0; --i)
                this.create(pool, onFirstUse);
        }

        public use<K extends T>(pool: number | string, onFirstUse: Function): K {
            let localPool = this.returnValidPool(pool);
            return this.reuseInstance(localPool, onFirstUse) as K;
        }

        public getNumberOfObjectsCreatedSinceLastTime() {
            let ret = this._objectsCreated;
            this._objectsCreated = 0;
            return ret;
        }

        public getNumberOfObjectsReusedSinceLastTime() {
            let ret = this._objectsReused;
            this._objectsReused = 0;
            return ret;
        }

        public getNumberOfObjectsRecycledSinceLastTime() {
            let ret = this._objectsRecyled;
            this._objectsRecyled = 0;
            return ret;
        }

        protected create(pool: number | string, onFirstInit: Function) {
            let localPool = this.returnValidPool(pool);
            let go = onFirstInit();
            localPool.push(go);
            return go;
        }

        public returnValidPool(pool: number | string) {
            if (typeof pool == 'number') {
                let localPool = this._pools.get(pool);
                if (!localPool) localPool = [];
                this._pools.set(pool, localPool);

                return localPool;
            }

            if (typeof pool == 'string') {
                let localPool = this._namedPools.get(pool);
                if (!localPool) localPool = [];
                this._namedPools.set(pool, localPool);

                return localPool;
            }
        }

        public reuseInstance(pool: T[], onFirstInit: Function): T {
            let obj: T = null;
            while (obj == null && pool.length > 0)
                obj = pool.pop();

            if (obj == null) {
                obj = onFirstInit();
                this._objectsCreated++;
            } else {
                this.alreadyRecycled.delete(obj);
                this._objectsReused++;
            }

            return obj;
        }

        protected internalRecycle(obj: T, pool: number | string) {
            if (!this.alreadyRecycled.add(obj)) {
                throw new Error("已经在池中回收的对象将被再次回收");
            }

            if (typeof pool == 'number') {
                if (!this._pools.has(pool)) {
                    throw new Error("没有预先分配或使用，不能回收对象");
                }
                this._pools.get(pool).push(obj);
            } else if (typeof pool == 'string') {
                if (!this._namedPools.has(pool)) {
                    throw new Error("没有预先分配或使用，不能回收对象");
                }
                this._namedPools.get(pool).push(obj);
            }

            this._objectsRecyled++;
        }
    }
}