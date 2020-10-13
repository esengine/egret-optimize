# 项目介绍

​	用于优化游戏中大量可见对象时造成的`drawcall`过高发热或者`cost`过高导致fps降低。本项目采用动态图集和合批处理一切可合并的对象。

​	针对使用cpu使用过高问题采用警告方式有针对性的对部分函数进行检测。例如高实时性的帧事件或一些庞大数据for遍历的检测，提供一些异步for遍历或者分帧处理方式来有效缓解该问题。

## 类介绍

### AsyncFor

异步遍历数组，可延迟停止，并在完成时进行回调

#### changeRatio(ratio: number)

**ratio** 执行速率 默认为16 高于16则会导致掉帧

#### changeDelay(delay: number, delayComplete?: Function)

**delay** 延迟多少秒后停止 0为直到执行完毕 默认为0

delayComplete: 停止回调

#### start(perform?: (data: any)=>void, complete?: Function)

开始异步遍历

**perform** 每个数据处理规则

**complete** 遍历完成

##### 示例

```typescript
let testArray = [1, 2, 3];
let asyncFor = new AsyncFor(this.testArray);
asyncFor.changeRatio(16)
    .changeDelay(3, () => {
    console.log("延迟时间到 数据未加载完成");
}).start((data) => {
    console.log("数据执行", data);
}, () => {
    console.log("遍历完成");
});
```



### webpack 端口如何更改

scripts/plugins/webpack-plugin.ts 文件中更改 WebpackDevServerPlugin 中参数 port。 当前为 `3001`
