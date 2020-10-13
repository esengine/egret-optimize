module optimize {
    export class OptimizeTime {
        public static deltaTime = 0;
        private static lastTime = 0;

        public static update(currentTime: number){
            this.deltaTime = (currentTime - this.lastTime) / 1000;
        }
    }
}