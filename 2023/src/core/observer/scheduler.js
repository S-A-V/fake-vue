import { callHook } from '../instance/lifecycle';
import { nextTick } from '../util/next-tick';

let queue = []; // Array<Watcher>
let has = {}; // { [key: number]: ?true }

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
  queue.length = 0;
  has = {};
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
  let watcher;

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (let index = 0; index < queue.length; index++) {
    watcher = queue[index];
    // 调用 watcher 的 run 方法，执行真正的更新操作
    watcher.run();
  }

  // keep copies of post queues before resetting state
  const updatedQueue = queue.slice();

  // 执行完之后清空队列
  resetSchedulerState();

  callUpdatedHooks(updatedQueue);
}

function callUpdatedHooks(queue) {
  debugger;
  let i = queue.length;
  while (i--) {
    const watcher = queue[i];
    const vm = watcher.vm;
    if (vm._watcher === watcher) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
// 实现异步队列机制
export function queueWatcher(watcher) {
  const id = watcher.id;
  // watcher 去重
  if (has[id] == null) {
    has[id] = true;
    // 同步代码执行，把全部的 watcher 都放到队列里面
    queue.push(watcher);
    // 进行异步调用
    nextTick(flushSchedulerQueue);
  }
}
