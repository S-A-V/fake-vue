/**
 * dep 和 watcher 是多对多的关系
 * 每个属性都有自己的 dep
 */

// Dep 实例的唯一标识
let id = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // 存放 watcher 的容器
  }

  addSub(watcher) {
    // 把 watcher 加入到自身的 subs 容器
    this.subs.push(watcher);
  }

  depend() {
    // 如果当前存在 watcher
    if (Dep.target) {
      // 把自身（Dep 实例）存放在 watcher 里面
      Dep.target.addDep(this);
    }
  }

  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice();
    // 依次执行 subs 里面的 watcher 更新方法
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// Dep.target 默认为 null
Dep.target = null;
// 栈结构用来存watcher
const targetStack = [];

export function pushTarget(watcher) {
  targetStack.push(watcher);
  // Dep.target 指向当前 watcher
  Dep.target = watcher;
}

export function popTarget() {
  // 当前 watcher 出栈
  targetStack.pop();
  // 拿到上一个 watcher
  Dep.target = targetStack[targetStack.length - 1];
}
