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
let asyncFor = new optimize.AsyncFor(this.testArray);
asyncFor.changeRatio(16)
    .changeDelay(3, () => {
    console.log("延迟时间到 数据未加载完成");
}).start((data) => {
    console.log("数据执行", data);
}, () => {
    console.log("遍历完成");
});
```



### FasterDictionary

快速字典，该字典以数组形式对值进行迭代的字典，不使用迭代器。再遍历操作上都比javascript的`Map` 快N倍，比较慢的操作是在添加数据时要进行调整内存大小，比起标准数组，它使用了两个单独的数组来维护。

#### 何时使用

在游戏中，需要对字典进行大规模遍历或遍历次数频繁时使用可大幅度提高游戏性能

#### 性能比较

该性能测试在配置以下测试。数据量均为100万时测试的数据。(以下加粗为性能优异项)

**cpu** i7-6700 3.40GHz

- key 仅为 string | number | boolean 测试

|          | FasterDictionary               | Map                  | 相差倍数  |
| -------- | ------------------------------ | -------------------- | --------- |
| 添加数据 | 315.803 ms [add]               | **114.291 ms** [set] | 2.76      |
| 遍历数据 | **0.239 ms**  [getValuesArray] | 14.423 ms [forEach]  | **60.34** |
| 删除数据 | 0.227 ms [remove]              | **0.11 ms** [delete] | 2.06      |
| 查找数据 | 0.353 ms [getIndex]            | **0.123 ms** [get]   | 2.86      |

- key 为 object 测试

|          | FasterDictionary               | Map                   | 相差倍数  |
| -------- | ------------------------------ | --------------------- | --------- |
| 添加数据 | 1073.614 ms [add]              | **118.954 ms** [set]  | 9.02      |
| 遍历数据 | **0.295 ms**  [getValuesArray] | 14.481 ms [forEach]   | **49.08** |
| 删除数据 | 0.437 ms [remove]              | **0.209 ms** [delete] | 2.09      |
| 查找数据 | 0.404 ms [getIndex]            | **0.198 ms** [get]    | 2.04      |

#### 使用方式

```typescript
const size = 1000000;
// 分配1000000的数量 如果不知道数量则不填 数据会自动增长
let list: optimize.FasterDictionary = new optimize.FasterDictionary(size);
// 添加数据
for (let i = 0; i < size; i ++)
	list.add(i, i);
// 根据位置获取value
let val = list.getDirectValue(0);
// 根据key 获取所在位置
let index = list.getIndex(0);
// 删除对应key
let removeResult = list.remove(0);
// 获取字典长度
let length = list.count();
// 获取所有values
let values = list.valuesArray;
// 清除所有数据
list.clear();
// 快速清理数据 不清理 values
list.fastClear();
// 是否包含key
let contains = list.containsKey(0);
// 根据key获取value
let val = list.tryGetValue(0);
```



### webpack 端口如何更改

scripts/plugins/webpack-plugin.ts 文件中更改 WebpackDevServerPlugin 中参数 port。 当前为 `3001`
