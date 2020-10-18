import AsyncFor = optimize.AsyncFor;

class OptimizeTest {
    private testArray = new Array(10002);
    private asyncFor: AsyncFor<number>;

    constructor() {
        // this.testArray.fill(100);
        // this.asyncFor = new AsyncFor(this.testArray);

        let test = {v: 0};
        console.time("addValue");
        let dic = new optimize.FasterDictionary(1000000);
        for (let i = 0; i < 1000000; i ++){
            dic.add(i, i);
        }
        console.timeEnd("addValue");

        console.time("setValue");
        let dic1 = new Map();
        for (let i = 0; i < 1000000; i ++){
            dic1.set(i, i);
        }
        console.timeEnd("setValue");

        console.time("getValues");
        let result = dic.getValuesArray({value: 0});
        // console.log(dic.count)
        console.timeEnd("getValues");

        console.time("foreach");
        dic1.forEach(()=>{});
        // console.log(dic1.size);
        console.timeEnd("foreach");

        console.time("index1");
        console.log(dic.getIndex(0));
        console.timeEnd("index1");

        console.time("index2");
        // console.log(dic1.delete(999999));
        console.log(dic1.get(0));
        // dic1.forEach((value, key)=>{
        //     if (key == node) 
        //         return true;
        // });
        console.timeEnd("index2");

        console.time("delete1");
        console.log(dic.remove(0));
        console.timeEnd("delete1");

        console.time("delete2");
        // console.log(dic1.delete(999999));
        console.log(dic1.delete(0));
        // dic1.forEach((value, key)=>{
        //     if (key == node) 
        //         return true;
        // });
        console.timeEnd("delete2");

        // dic1.clear()
    }

    public test() {
        if (!this.asyncFor) return;
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