const callbacks = [];
let pending = false;

function flushCallbacks() {
  // 把标志还原为 false
  pending = false;
  // 依次执行回调
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }
}

// 定义异步方法，采用优雅降级
let timerFunc;

if (typeof Promise !== 'undefined') {
  // 如果支持 promise
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
  };
} else if (typeof MutationObserver !== 'undefined') {
  // MutationObserver 主要是监听 dom 变化，也是一个异步方法
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined') {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  // 最后降级采用 setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

export function nextTick(cb) {
  // 除了渲染 watcher，还有用户自己手动调用的 nextTick，一起被收集到数组
  callbacks.push(cb);
  if (!pending) {
    // 如果多次调用 nextTick，只会执行一次异步，等异步队列清空之后再把标志变为 false
    pending = true;
    timerFunc();
  }
}
