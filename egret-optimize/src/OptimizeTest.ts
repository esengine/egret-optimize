import AsyncFor = optimize.AsyncFor;

class OptimizeTest {
    private testArray = new Array(10002);
    private asyncFor: AsyncFor<number>;

    constructor() {
        this.testArray.fill(100);
        this.asyncFor = new AsyncFor(this.testArray);
    }

    public test() {
        this.asyncFor.changeRatio(16)
            .changeDelay(3, () => {
                console.log("延迟时间到 数据未加载完成");
            }).start((data) => {
            console.log("数据执行", data);
        }, () => {
            console.log("遍历完成");
        });
    }

    public stopTest() {
        this.asyncFor.stop();
    }
}