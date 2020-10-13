///<reference path="OptimizeRecycle.ts"/>
module optimize {
    /** 异步for循环 */
    export class AsyncFor<T> implements OptimizeRecycle {
        public list: T[];
        /** 最大执行效率 */
        private ratio: number = 1 / 60 * 1000;
        /** 异步是否开始 */
        private asyncStart: boolean = false;
        private asyncNum: number = 0;
        private listPerform: (data: T) => void;
        private completePerform: Function;
        private delayComplete: Function;
        /** 执行多久后停止 */
        private delayStop: number = 0;
        /** 当前已延迟 */
        private currentDelay: number = 0;

        constructor(list: T[]){
            this.list = list;
        }

        /**
         * 开始异步循环 等同于 ForEach
         * @param perform 执行每个单位的函数
         * @param complete 循环结束
         */
        public start(perform?: (data: T) => void, complete?: Function): AsyncFor<T> {
            if (this.asyncStart) {
                console.warn("检测到您多次调用异步开始 已自动过滤");
                return;
            }
            this.listPerform = perform;
            this.completePerform = complete;
            this.asyncStart = true;
            OptimizeCore.addRecycle(this);

            return this;
        }

        /**
         * 立即结束异步
         */
        public stop(): AsyncFor<T>{
            this.asyncStart = false;
            this.asyncNum = 0;
            this.currentDelay = 0;
            OptimizeCore.removeRecycle(this);
            return this;
        }

        /**
         * 改变执行速率
         * @param ratio 执行速率
         */
        public changeRatio(ratio): AsyncFor<T>{
            if (ratio > 1 / 60 * 1000) console.warn("您的asyncFor执行速率大于推荐值。超过16会导致fps降低");
            this.ratio = ratio;
            return this;
        }

        /**
         * 执行多久秒后自动停止
         * @param delay 以秒为单位
         * @param delayComplete 当因延迟时间到结束时回调
         */
        public changeDelay(delay, delayComplete?: Function): AsyncFor<T> {
            this.delayStop = delay;
            this.delayComplete = delayComplete;
            return this;
        }

        public update(passTime: number) {
            if (!this.asyncStart) return;
            let startTime = egret.getTimer();
            if (this.delayStop != 0 && this.currentDelay > this.delayStop) {
                this.stop();
                if (this.delayComplete) this.delayComplete();
                return;
            }

            for (let i = this.asyncNum; i < this.list.length; i++) {
                if (this.listPerform) this.listPerform(this.list[i]);
                this.asyncNum ++;
                let delay = egret.getTimer() - startTime;
                if (delay > this.ratio - passTime) {
                    this.currentDelay += OptimizeTime.deltaTime;
                    break;
                }
            }

            if (this.asyncNum == this.list.length) {
                this.stop();
                if (this.completePerform) this.completePerform();
            }
        }
    }
}
