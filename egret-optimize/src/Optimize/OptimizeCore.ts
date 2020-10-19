module optimize {
    export abstract class OptimizeCore extends egret.DisplayObjectContainer {
        private static recycle: OptimizeRecycle[] = [];

        constructor(){
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.optimizeUpdate, this);
        }

        private async onAddToStage(evt: egret.Event) {
            egret.ImageLoader.crossOrigin = "anonymous";
            await this.loadResource();
            this.initialize();
        }

        /** 优化更新帧 以全局方式派发事件 减少分发量 */
        private optimizeUpdate(){
            let startTime = egret.getTimer();
            this.update();
            OptimizeTime.update(startTime);

            for (let recycle of OptimizeCore.recycle) {
                let passTime = egret.getTimer() - startTime;
                recycle.update(passTime);
            }
        }

        protected abstract async loadResource();

        /** 游戏初始化 */
        protected abstract initialize();

        /** 帧执行 */
        protected abstract update();

        /** 添加循环事件 */
        public static addRecycle(recycle: OptimizeRecycle){
            this.recycle.push(recycle);
        }

        /** 添加循环事件 */
        public static removeRecycle(recycle: OptimizeRecycle){
            let index = this.recycle.indexOf(recycle);
            if (index == -1) return;
            this.recycle.splice(index, 1);
        }
    }
}