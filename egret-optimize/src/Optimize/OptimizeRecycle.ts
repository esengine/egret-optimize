module optimize {
    /** 游戏循环接口 */
    export interface OptimizeRecycle {
        /** 用于监听帧事件 */
        update(passTime?: number);
    }
}