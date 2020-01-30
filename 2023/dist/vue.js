(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject(obj) {
    if (_typeof(obj) !== 'object' || obj === null) {
      return false;
    }
    return true;
  }

  /**
   * Mix properties into target object.
   */
  function extend(to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to;
  }
  function noop() {}

  var ASSET_TYPES = ['component', 'directive', 'filter'];
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'
  // 'activated',
  // 'deactivated',
  // 'errorCaptured',
  // 'serverPrefetch',
  ];

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  // 合并策略
  var strats = {};

  /**
   * Hooks and props are merged as arrays.
   */
  // 生命周期合并策略
  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return Array.isArray(childVal) ? childVal : [childVal];
      }
    } else {
      return parentVal;
    }
  }
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets(parentVal, childVal) {
    /**
     * 如果有同名的全局组件和自定义的局部组件
     * parentVal 代表全局组件，childVal 代表自定义组件
     *
     * 首先会查找局部组件，有就使用，没有就从原型继承全局组件。res.__proto__ === parentVal
     */
    var res = Object.create(parentVal);
    if (childVal) {
      return extend(res, childVal);
    } else {
      return res;
    }
  }

  // 组件/指令/过滤器的合并策略
  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions(parent, child) {
    var options = {};
    var key;
    // 遍历父亲
    for (key in parent) {
      mergeFiled(key);
    }
    // 父亲没有但儿子有
    for (key in child) {
      if (!parent.hasOwnProperty(key)) {
        mergeFiled(key);
      }
    }
    function mergeFiled(key) {
      // 真正合并字段方法
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        // 默认策略
        options[key] = child[key] ? child[key] : parent[key];
      }
    }
    return options;
  }

  function isReservedTag(tagName) {
    // 定义常见标签
    var str = 'html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot';
    var map = {};
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return map[tagName];
  }

  function lifecycleMixin(Vue) {
    // 把 _update 挂载到 Vue 的原型
    Vue.prototype._update = function (vnode) {
      var vm = this;
      // 缓存上一次的 vnode
      var prevVnode = vm._vnode;
      vm._vnode = vnode;
      if (!prevVnode) {
        // patch 是渲染 vnode 为真实 dom 的核心
        // 初次渲染 vm._vnode 肯定不存在，要通过虚拟节点渲染出真实的 dom，赋值给 $el 属性
        vm.$el = vm.__patch__(vm.$el, vnode);
      } else {
        // 更新时把上次的 vnode 和这次更新的 vnode 传进去，进行 diff 算法
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
    };
  }
  function mountComponent(vm, el) {
    /**
     * 上一步模板编译，解析生成了 render 函数
     * 下一步就是执行 vm._render() 方法，调用生成的 render 函数，生成虚拟 dom
     * 最后使用 vm._update() 方法把虚拟 dom 渲染到页面
     */

    // 真实的 el 赋值给实例的 $el 属性
    vm.$el = el;
    callHook(vm, 'beforeMount');
    var updateComponent = function updateComponent() {
      // _update 和 _render 方法都是挂载在 Vue 原型上的方法，类似 _init
      vm._update(vm._render());
    };

    // 注册一个渲染 watcher，执行 vm._update(vm._render()) 方法渲染视图
    new Watcher(vm, updateComponent, function () {
      callHook(vm, 'beforeUpdate');
    }, true, true /* isRenderWatcher */);

    callHook(vm, 'mounted');
    return vm;
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    // 依次执行生命周期对应的方法
    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        // 生命周期里面的 this 指向当前实例
        handlers[i].call(vm);
      }
    }
  }

  var callbacks = [];
  var pending = false;
  function flushCallbacks() {
    // 把标志还原为 false
    pending = false;
    // 依次执行回调
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i]();
    }
  }

  // 定义异步方法，采用优雅降级
  var timerFunc;
  if (typeof Promise !== 'undefined') {
    // 如果支持 promise
    var p = Promise.resolve();
    timerFunc = function timerFunc() {
      p.then(flushCallbacks);
    };
  } else if (typeof MutationObserver !== 'undefined') {
    // MutationObserver 主要是监听 dom 变化，也是一个异步方法
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function timerFunc() {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else if (typeof setImmediate !== 'undefined') {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    // 最后降级采用 setTimeout
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks, 0);
    };
  }
  function nextTick(cb) {
    // 除了渲染 watcher，还有用户自己手动调用的 nextTick，一起被收集到数组
    callbacks.push(cb);
    if (!pending) {
      // 如果多次调用 nextTick，只会执行一次异步，等异步队列清空之后再把标志变为 false
      pending = true;
      timerFunc();
    }
  }

  var queue = []; // Array<Watcher>
  var has = {}; // { [key: number]: ?true }

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
    var watcher;

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (var index = 0; index < queue.length; index++) {
      watcher = queue[index];
      // 调用 watcher 的 run 方法，执行真正的更新操作
      watcher.run();
    }

    // keep copies of post queues before resetting state
    var updatedQueue = queue.slice();

    // 执行完之后清空队列
    resetSchedulerState();
    callUpdatedHooks(updatedQueue);
  }
  function callUpdatedHooks(queue) {
    debugger;
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
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
  function queueWatcher(watcher) {
    var id = watcher.id;
    // watcher 去重
    if (has[id] == null) {
      has[id] = true;
      // 同步代码执行，把全部的 watcher 都放到队列里面
      queue.push(watcher);
      // 进行异步调用
      nextTick(flushSchedulerQueue);
    }
  }

  /**
   * dep 和 watcher 是多对多的关系
   * 每个属性都有自己的 dep
   */

  // Dep 实例的唯一标识
  var id$1 = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id$1++;
      this.subs = []; // 存放 watcher 的容器
    }
    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        // 把 watcher 加入到自身的 subs 容器
        this.subs.push(watcher);
      }
    }, {
      key: "depend",
      value: function depend() {
        // 如果当前存在 watcher
        if (Dep.target) {
          // 把自身（Dep 实例）存放在 watcher 里面
          Dep.target.addDep(this);
        }
      }
    }, {
      key: "notify",
      value: function notify() {
        // stabilize the subscriber list first
        var subs = this.subs.slice();
        // 依次执行 subs 里面的 watcher 更新方法
        for (var i = 0, l = subs.length; i < l; i++) {
          subs[i].update();
        }
      }
    }]);
    return Dep;
  }(); // The current target watcher being evaluated.
  Dep.target = null;
  // 栈结构用来存watcher
  var targetStack = [];
  function pushTarget(watcher) {
    targetStack.push(watcher);
    // Dep.target 指向当前 watcher
    Dep.target = watcher;
  }
  function popTarget() {
    // 当前 watcher 出栈
    targetStack.pop();
    // 拿到上一个 watcher
    Dep.target = targetStack[targetStack.length - 1];
  }

  // 全局变量，每次 new Watcher 都会自增
  var id = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options, isRenderWatcher) {
      _classCallCheck(this, Watcher);
      this.vm = vm;
      if (isRenderWatcher) {
        vm._watcher = this;
      }
      if (options) {
        this.user = !!options.user; // 标识用户 watcher
        this.lazy = !!options.lazy; // 标识计算属性 watcher
      } else {
        this.user = this.lazy = false;
      }
      this.options = options; // 额外的选项，true 代表渲染 watcher
      this.cb = cb; // 回调函数，比如在 watcher 更新之前可以执行 beforeUpdate 方法
      this.id = id++; // watcher 的唯一标识
      this.dirty = this.lazy; // dirty，可变。表示计算 watcher 是否需要重新计算（执行用户定义的方法）
      this.deps = []; // 存放 dep 的容器
      this.depIds = new Set(); // 用来去重 dep
      this.exprOrFn = exprOrFn;
      // 如果表达式是一个函数
      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      } else {
        // 用户 watcher 传过来的可能是一个字符串，类似 a.b.c.d
        this.getter = function () {
          var obj = vm;
          var segments = exprOrFn.split('.');
          for (var i = 0; i < segments.length; i++) {
            obj = obj[segments[i]]; // vm.a.b.c.d
          }

          return obj;
        };
      }
      // 非计算属性实例化就会默认调用 get 方法进行取值，保留结果
      this.value = this.lazy ? undefined : this.get();
    }

    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        // 在调用方法之前先把当前 watcher 实例推到全局 Dep.target 上
        pushTarget(this);
        var value;
        var vm = this.vm;
        /**
         * 如果是渲染 watcher，相当于执行 vm._update(vm._render())
         * render 函数执行的时候会取值，从而实现依赖收集
         */
        value = this.getter.call(vm);
        // 在调用方法之后把当前 watcher 实例从全局 Dep.target 移除
        popTarget();
        return value;
      }

      /**
       * 把 dep 放到 deps 里面，同时保证同一个 dep 只被保存到 watcher 一次
       * 同样，同一个 watcher 也只会保存在 dep 一次
       */
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        if (!this.depIds.has(id)) {
          this.depIds.add(id);
          this.deps.push(dep);
          // 调用 dep 的 addSub 方法，把自己（watcher 实例）添加到 dep 的 subs 容器里
          dep.addSub(this);
        }
      }

      /**
       * Subscriber interface.
       * Will be called when a dependency changes.
       */
      // 简单执行一下 get 方法，之后涉及到计算属性就不一样了
    }, {
      key: "update",
      value: function update() {
        // 计算属性依赖的值发生变化，只需要把 dirty 置为 true，下次访问到了重新计算
        if (this.lazy) {
          this.dirty = true;
        } else {
          // 每次 watcher 进行更新的时候，可以让他们先缓存起来，之后再一起调用
          // 异步队列机制
          queueWatcher(this);
        }
      }

      /**
       * Scheduler job interface.
       * Will be called by the scheduler.
       */
    }, {
      key: "run",
      value: function run() {
        var newVal = this.get(); // 新值
        var oldVal = this.value; // 老值
        this.value = newVal;
        if (this.user) {
          if (newVal !== oldVal || isObject(newVal)) {
            this.cb.call(this.vm, newVal, oldVal);
          }
        } else {
          // 渲染 watcher
          this.cb.call(this.vm);
        }
      }

      /**
       * Evaluate the value of the watcher.
       * This only gets called for lazy watchers.
       */
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }

      /**
       * Depend on all deps collected by this watcher.
       */
    }, {
      key: "depend",
      value: function depend() {
        // 计算属性的 watcher 存储了依赖项的 dep
        var i = this.deps.length;
        while (i--) {
          // 调用依赖项的 dep 去收集渲染 watcher
          this.deps[i].depend();
        }
      }
    }]);
    return Watcher;
  }();

  // 保留数组原型
  var arrayProto = Array.prototype;
  // 然后将 arrayMethods 继承自数组原型
  // 这里是面向切片编程思想（AOP），不破坏封装的前提下，动态地扩展功能
  var arrayMethods = Object.create(arrayProto);
  var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // 保留原型方法的执行结果
      var result = original.apply(this, args);
      // this 代表的是数据本身。比如数据是 { a: [1, 2, 3] }，那么使用 a.push(4)，this 就是 a，ob 就是 a.__ob__
      // 这个属性代表该数据已经被响应式观测过了，__ob__ 对象指的就是 Observer 实例
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
      }
      // 对新增的每一项进行观测
      if (inserted) ob.observeArray(inserted);
      // 派发更新。在 get 的时候判断如果属性的值还是对象，那么就在 Observer 实例的 dep 收集依赖
      // 所以这里是一一对应的，可以直接更新
      ob.dep.notify();
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);
      this.value = value;
      this.dep = new Dep();

      // 当数组使用 7 种重写方法时，是无法进行依赖收集和派发更新的，此属性主要辅助数组更新
      Object.defineProperty(value, '__ob__', {
        value: this,
        // Observer 的实例
        enumerable: false,
        // 不可枚举
        writable: true,
        configurable: true
      });
      if (Array.isArray(value)) {
        // 这里对数组做了额外判断
        // 通过重写数组原型方法来对数组的 7 种方法进行拦截
        protoAugment(value, arrayMethods);
        // 如果数组里面还包含数组，递归判断
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    /**
     * Walk through all properties and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    _createClass(Observer, [{
      key: "walk",
      value: function walk(obj) {
        // 观测对象上的所有属性
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = obj[key];
          defineReactive(obj, key, value);
        }
      }

      /**
       * Observe a list of Array items.
       */
    }, {
      key: "observeArray",
      value: function observeArray(items) {
        for (var i = 0; i < items.length; i++) {
          observe(items[i]);
        }
      }
    }]);
    return Observer;
  }(); // helpers
  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment(target, src) {
    target.__proto__ = src;
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe(value) {
    // 递归进行属性劫持
    if (_typeof(value) !== 'object' || value === null) {
      return;
    }
    return new Observer(value);
  }

  /**
   * Define a reactive property on an Object.
   */
  // 数据劫持核心
  function defineReactive(obj, key, value) {
    // 为每个属性实例化一个 Dep
    var dep = new Dep();

    // 递归关键，如果 value 是对象，会继续走一遍 defineReactive，层层遍历直到 value 不是对象为止
    var childOb = observe(value);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        // 依赖收集。取值的时候把 watcher 收集到 dep 里面
        if (Dep.target) {
          // 如果有 watcher，dep 就会保存 watcher；同时 watcher 也会保存 dep
          dep.depend();
          // 属性的值依然是一个对象，包含数组和对象。childOb 指代的就是 Observer 实例对象，里面的 dep 进行依赖收集
          // 比如，{ a: [1, 2, 3] } 的属性 a 对应的值是一个数组，观测数组的返回值就是对应数组的 Observer 实例对象
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              // 如果数据结构类似 { a: [1, 2, [3, 4, [5, 6]]] } 这种多层嵌套数组
              // 那么访问 a 的时候，只是对第一层的数组进行了依赖收集。里面的数组因为没有访问到，所以无法收集依赖
              // 如果改变了 a 里面第二层数组的值，需要更新页面，所以需要对数组递归进行依赖收集
              debugger;
              dependArray(value);
            }
          }
        }
        return value;
      },
      set: function reactiveSetter(newValue) {
        if (newValue === value) {
          return;
        }
        value = newValue;
        // 如果新值也是对象，需要进行观测
        childOb = observe(newValue);
        // 派发更新，通知渲染 watcher 去更新
        dep.notify();
      }
    });
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  // 递归收集数组依赖
  function dependArray(value) {
    for (var e, i = 0, l = value.length; i < l; i++) {
      e = value[i];
      // e.__ob__ 代表 e 已经被响应式观测了，但是没有收集依赖，所以把它们收集到自己的 Observer 实例的 dep 里面
      e && e.__ob__ && e.__ob__.dep.depend();
      // 如果数组里面还有数组，递归收集依赖
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };
  function proxy(target, sourceKey, key) {
    Object.defineProperty(target, key, {
      get: function get() {
        return target[sourceKey][key];
      },
      set: function set(val) {
        target[sourceKey][key] = val;
      }
    });
  }

  // 初始化状态，顺序依次是：prop > methods > data > computed > watch
  function initState(vm) {
    var opts = vm.$options;
    if (opts.props) initProps(vm, opts.props);
    if (opts.methods) initMethods(vm, opts.methods);
    if (opts.data) {
      initData(vm);
    }
    if (opts.computed) initComputed(vm, opts.computed);
    if (opts.watch) {
      initWatch(vm, opts.watch);
    }
  }
  function initProps() {}

  // 初始化 data 数据
  function initData(vm) {
    var data = vm.$options.data;
    // 实例的 _data 属性就是传入的 data
    // 组件 data 推荐使用函数，防止数据在组件之间共享
    data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};

    // 把 data 数据代理到 vm，也就是 Vue 实例上面。我们可以使用 this.a 来访问 this._data.a
    for (var key in data) {
      proxy(vm, "_data", key);
    }

    // 对数据进行观测（响应式数据核心）
    observe(data);
  }

  function getData(data, vm) {
    try {
      return data.call(vm, vm);
    } catch (e) {
      return {};
    }
  }
  var computedWatcherOptions = {
    lazy: true
  };
  function initComputed(vm, computed) {
    // 用来存放计算 watcher
    var watchers = vm._computedWatchers = {};
    for (var key in computed) {
      // 获取用户定义的计算属性
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      // 创建计算属性 watcher
      watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
      defineComputed(vm, key, userDef);
    }
  }
  function defineComputed(target, key, userDef) {
    // 如果是函数
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = createComputedGetter(key);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = createComputedGetter(key);
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }
  function createComputedGetter(key) {
    return function computedGetter() {
      // 获取对应的计算属性 watcher
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        // 计算属性取值的时候，如果是脏的，需要重新求值
        if (watcher.dirty) {
          watcher.evaluate();
        }
        // 如果 Dep 还存在 target，这个时候一般为渲染 watcher，计算属性依赖的数据也需要收集
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value;
      }
    };
  }
  function initMethods() {}

  // 初始化 watch
  function initWatch(vm, watch) {
    var _loop = function _loop(key) {
      var handler = watch[key];
      // 可能是数组/对象/函数/字符串
      if (Array.isArray(handler)) {
        handler.forEach(function (item) {
          createWatcher(vm, key, item);
        });
      } else {
        createWatcher(vm, key, handler);
      }
    };
    for (var key in watch) {
      _loop(key);
    }
  }
  function createWatcher(vm, expOrFn, handler) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    if (_typeof(handler) === 'object') {
      // 保存用户传入的对象
      options = handler;
      // 是函数
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options);
  }
  function stateMixin(Vue) {
    Vue.prototype.$watch = function (expOrFn, cb) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var vm = this;
      options.user = true;
      // 这里表示是一个用户 watcher
      new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        cb();
      }
    };
  }

  // 定义 VNode 类
  var VNode = /*#__PURE__*/_createClass(function VNode(tag, data, children, text, componentOptions) {
    _classCallCheck(this, VNode);
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.parent = undefined;
  });
  function createTextVNode(text) {
    return new VNode(undefined, undefined, undefined, text);
  }

  function createComponent(Ctor, data, context, children, tag) {
    var baseCtor = context.$options._base;
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }
    data = data || {};

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    // 组件 vnode（占位符 vnode），$vnode
    var name = tag;
    var vnode = new VNode("vue-component-".concat(Ctor.cid, "-").concat(name), data, undefined, undefined, {
      Ctor: Ctor,
      tag: tag,
      children: children
    });
    return vnode;
  }
  function installComponentHooks(data) {
    // 声明组件自己内部的生命周期
    data.hook = {
      // 组件创建过程中，自身的初始化方法
      init: function init(vnode) {
        debugger;
        // 实例化组件
        var child = vnode.componentInstance = new vnode.componentOptions.Ctor({
          _isComponent: true
        });
        // 因为没有传入 el 属性，需要手动挂载。为了在组件实例上面增加 $el 方法，可用于生成组件的真实渲染节点
        child.$mount();
      }
    };
  }

  // 创建元素 vnode，等同于 render 函数里的 h => h(App)
  function createElement(context, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var vnode;
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    if (isReservedTag(tag)) {
      // platform built-in elements
      // 如果是普通 HTML 标签
      vnode = new VNode(tag, data, children);
    } else {
      // 否则就是组件
      // 获取组件的构造函数
      var Ctor = context.$options.components[tag];
      vnode = createComponent(Ctor, data, context, children, tag);
    }
    return vnode;
  }

  // render 函数里的 _c、_s、_v 方法需要定义
  function installRenderHelpers(target) {
    // 创建虚拟 dom 元素
    target._c = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return createElement.apply(void 0, [this].concat(args));
    };

    // toString，如果模板里是一个对象，需要 JSON.stringify
    target._s = function (val) {
      return val === null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    // 创建虚拟 dom 文本
    target._v = createTextVNode;
  }

  function initRender(vm) {
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) {
      return createElement(vm, a, b, c, d);
    };
  }
  function renderMixin(Vue) {
    installRenderHelpers(Vue.prototype);

    // 挂载在原型上的 nextTick 方法
    Vue.prototype.$nextTick = nextTick;
    Vue.prototype._render = function () {
      var vm = this;
      // 获取模板编译生成的 render 方法
      var render = vm.$options.render;

      // 生成 vnode，虚拟 dom
      var vnode = render.call(vm, vm.$createElement);
      return vnode;
    };
  }

  function initMixin$1(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;

      // 这里的 this 代表调用 _init 方法的对象，即实例对象
      // this.$options 就是 new Vue 时候传入的属性和全局 Vue.options 合并之后的结果
      vm.$options = mergeOptions(vm.constructor.options, options);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initState(vm); // 初始化状态
      callHook(vm, 'created');

      // 如果有 el 属性，进行模板渲染
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  // Vue 是一个构造函数，通过 new 关键字进行实例化
  function Vue(options) {
    // 这里开始进行 Vue 初始化工作
    this._init(options);
  }

  // _init 方法是挂载在 Vue 原型上的方法，通过引入文件的方式进行原型挂载需要传入 Vue
  // 此做法有利于代码分割
  initMixin$1(Vue);
  stateMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  function initMixin(Vue) {
    Vue.mixin = function (mixin) {
      // 合并对象
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  function initExtend(Vue) {
    var cid = 0;

    // 创建子类继承 Vue 父类，便于属性扩展
    Vue.extend = function () {
      var extendOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var Super = this;

      // 创建子类的构造函数，并且调用初始化方法
      var Sub = function VueComponent(options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype); // 子类原型指向父类
      Sub.prototype.constructor = Sub; // constructor 指向自己
      Sub.cid = cid++; // 组件的唯一标识
      Sub.options = mergeOptions(Super.options, extendOptions); // 合并自己的 options 和父类的 options
      Sub['super'] = Super;
      return Sub;
    };
  }

  function initAssetRegisters(Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (type === 'component') {
          // 全局组件注册
          // 子组件可能也有 extend 方法，VueComponent.component 方法
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        this.options[type + 's'][id] = definition;
        return definition;
      };
    });
  }

  function initGlobalAPI(Vue) {
    Vue.options = {};
    // initMixin(Vue);
    // 全局组件/指令/过滤器
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = {};
    });

    // _base 是 Vue 构造函数
    Vue.options._base = Vue;
    initMixin(Vue);
    // 注册 extend 方法
    initExtend(Vue);
    // 注册 assets 方法
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);

  /**
   * Query an element selector if it's not an element already.
   */
  function query(el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
        return document.createElement('div');
      }
      return selected;
    } else {
      return el;
    }
  }

  new VNode('', {}, []);

  // 判断新旧两个 vnode 的标签和 key 是否相同。如果相同，可以认为是同一个节点，然后复用
  function sameVnode(oldVnode, newVnode) {
    return oldVnode.key === newVnode.key && oldVnode.tag === newVnode.tag;
  }

  /**
   * 旧的子节点，key 和 index 映射表
   * { a: 0, b: 1 }，key 为 a 的子节点在第 0 个，key 为 b 的子节点在第 1 个
   *
   */
  function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (key) map[key] = i;
    }
    return map;
  }
  function createPatchFunction() {
    // 虚拟 dom -> 真实 dom
    function createElm(vnode) {
      var children = vnode.children;
      var tag = vnode.tag;
      // 判断虚拟 dom 是元素节点还是文本节点
      if (typeof tag === 'string') {
        // 如果是组件，返回真实组件渲染的真实 dom
        if (createComponent(vnode)) {
          return vnode.componentInstance.$el;
        }

        // 虚拟 dom 的 elm 属性指向真实 dom，方便后续更新 diff 算法操作
        vnode.elm = document.createElement(tag);
        // 解析虚拟 dom 属性
        updateProperties(vnode);
        // 如果有子节点，递归插入到父节点里面
        children.forEach(function (child) {
          vnode.elm.appendChild(createElm(child));
        });
      } else {
        // 文本节点
        vnode.elm = document.createTextNode(vnode.text);
      }
      return vnode.elm;
    }

    // 创建组件实例
    function createComponent(vnode) {
      var i = vnode.data;
      // 初始化组件
      if ((i = i.hook) && (i = i.init)) {
        i(vnode);
      }
      // 如果组件实例化后有 componentInstance 属性，那证明是组件
      if (vnode.componentInstance) {
        // initComponent(vnode);
        return true;
      }
    }

    // 解析 vnode 的 data 属性，映射到真实 dom 上
    function updateProperties(vnode) {
      var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // 真实的 dom 节点
      var elm = vnode.elm;
      var newProps = vnode.data || {};

      // 移除新节点上没有的属性
      for (var key in oldProps) {
        if (!newProps[key]) {
          elm.removeAttribute(key);
        }
      }

      // 特殊处理 style 属性，如果新节点没有，置空 style 属性值
      var newStyle = newProps.style || {};
      var oldStyle = oldProps.style || {};
      for (var _key in oldStyle) {
        if (!newStyle[_key]) {
          elm.style[_key] = '';
        }
      }

      // 遍历设置新的属性
      for (var _key2 in newProps) {
        if (_key2 === 'style') {
          for (var styleName in newProps.style) {
            elm.style[styleName] = newProps.style[styleName];
          }
        } else if (_key2 === 'class') {
          elm.className = newProps["class"];
        } else {
          // 给元素设置属性
          elm.setAttribute(_key2, newProps[_key2]);
        }
      }
    }

    // diff 算法核心。采用双指针方式，对比新旧 vnode 子节点
    function updateChildren(parentElm, oldCh, newCh) {
      // ???
      var patch = vm.__patch__;
      var oldStartIdx = 0; // 旧的子节点起始下标
      var newStartIdx = 0; // 新的子节点起始下标
      var oldEndIdx = oldCh.length - 1; // 旧的子节点结束下标
      var oldStartVnode = oldCh[0]; // 旧的第一个子节点
      var oldEndVnode = oldCh[oldEndIdx]; // 旧的最后一个子节点
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];

      // 只有当新旧子节点的双指针起始位置不大于结束位置时才循环，一方停止循环即结束
      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        // 暴力对比过程会把移动的 vnode 置为 undefined，如果不存在 vnode 节点，直接跳过
        if (!oldStartVnode) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (!oldEndVnode) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          // 旧头和新头，依次向后追加
          patch(oldStartVnode, newStartVnode); // 递归比较子节点以及他们的子节点
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          // 旧尾和新尾，依次向前追加
          patch(oldEndVnode, newEndVnode);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
          // Vnode moved right

          // 旧头和新尾，旧头移至尾部
          patch(oldStartVnode, newEndVnode);
          // insertBefore 可以移动或者插入真实 dom
          parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
          // Vnode moved left

          // 旧尾和新头，旧尾移至头部
          patch(oldEndVnode, newStartVnode);
          parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          // 以上四种情况均不满足，需要进行暴力对比
          var oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
          // 根据旧子节点的 key 和 index 映射表，从新的起始子节点进行查找。如果可以找到就进行移动操作，否则直接进行插入操作
          var idxInOld = oldKeyToIdx[newStartVnode.key];
          if (!idxInOld) {
            // New element

            // 找不到旧的节点，直接插入
            parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.elm);
          } else {
            // 找到的旧节点
            var vnodeToMove = oldCh[idxInOld];
            // 占位操作，避免旧节点移走后，破坏初始映射表节点位置
            oldCh[idxInOld] = undefined;
            // 把找到的节点移动到最前面
            parentElm.insertBefore(vnodeToMove.elm, oldStartVnode.elm);
            patch(vnodeToMove, newStartVnode);
          }
          // newStartVnode = newCh[++newStartIdx];
        }
      }

      if (oldStartIdx > oldEndIdx) {
        // 如果第二个参数为 null，将指定节点添加到列表末尾
        var refElm = !newCh[newEndIdx + 1] ? null : newCh[newEndIdx + 1].elm;
        // 旧节点循环结束，新节点还有剩余。新节点添加到头部或尾部
        for (var i = newStartIdx; i <= newEndIdx; i++) {
          parentElm.insertBefore(createElm(newCh[i]), refElm);
        }
      } else if (newStartIdx > newEndIdx) {
        // 新节点循环结束，老节点还有剩余。老节点移除
        for (var _i = oldStartIdx; _i <= oldEndIdx; _i++) {
          var ch = oldCh[_i];
          if (!ch) {
            parentElm.removeChild(ch.elm);
          }
        }
      }
    }

    // 渲染和更新视图
    return function patch(oldVnode, vnode) {
      debugger;

      /**
       * 判断传入的 oldVnode 是否是真实元素
       * 初次渲染时，传入的 vm.$el 是真实的 dom
       * 更新时，传入的是更新前的虚拟 dom
       */
      if (!oldVnode) {
        // empty mount (likely as component), create new root element
        return createElm(vnode);
      } else {
        var isRealElement = oldVnode.nodeType;
        if (isRealElement) {
          // oldVnode 是真实 dom 元素，代表初次渲染
          var oldElm = oldVnode;
          var parentElm = oldElm.parentNode;

          // 虚拟 dom -> 真实 dom
          var elm = createElm(vnode);

          /**
           * 插入到老的 elm 节点之后一个节点的前面，相当于插入到老的 elm 节点后面
           * 不直接 appendChild，避免破坏替换位置
           */
          parentElm.insertBefore(elm, oldElm.nextSibling);
          // 移除老的 elm 节点
          parentElm.removeChild(oldVnode);
          return elm;
        } else {
          // oldVnode 是虚拟 dom 元素，代表更新，使用 diff 算法

          // 新旧节点的标签不一致，用新的替换旧的，oldVnode.elm 代表的是真实 dom
          if (oldVnode.tag !== vnode.tag) {
            oldVnode.elm.parentNode.replaceChild(createElm(vnode), oldVnode.elm);
          }

          // 如果旧节点是一个文本节点
          if (!oldVnode.tag) {
            if (oldVnode.text !== vnode.text) {
              oldVnode.elm.textContent = vnode.text;
            }
          }

          /**
           * 不符合上面两种，说明标签一致并且不是文本节点
           * 为了复用节点，把旧虚拟 dom 对应的真实 dom 赋值给新虚拟 dom 的 elm 属性
           */
          var _elm = vnode.elm = oldVnode.elm;
          // 更新属性
          updateProperties(vnode, oldVnode.data);
          var oldCh = oldVnode.children || [];
          var newCh = vnode.children || [];
          if (oldCh.length > 0 && newCh.length > 0) {
            // 新旧都存在子节点
            updateChildren(_elm, oldCh, newCh);
          } else if (oldCh.length) {
            // 旧的有儿子，新的没有
            _elm.innerHTML = '';
          } else if (newCh.length) {
            // 新的有儿子，旧的没有
            for (var i = 0; i < newCh.length; i++) {
              var child = newCh[i];
              _elm.appendChild(createElm(child));
            }
          }
        }
      }
    };
  }

  var patch = createPatchFunction();

  // install platform patch function
  Vue.prototype.__patch__ = patch;
  Vue.prototype.$mount = function (el) {
    el = el ? query(el) : undefined;
    // 将当前组件实例挂载到真实的 el 节点上面
    return mountComponent(this, el);
  };

  // 匹配属性，形如：id="app"
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // 匹配标签名，形如：abc-123
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  // 匹配特殊标签，形如：abc:234，前面的 abc: 可有可无
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  // 匹配标签开始，形如：<abc-123，捕获里面的标签名
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  // 匹配标签结束，>
  var startTagClose = /^\s*(\/?)>/;
  // 匹配标签结尾，形如：</abc-123>，捕获里面的标签名
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));

  // 以下为源码中的正则表达式

  // 创建 AST
  function createASTElement(tag, attrs) {
    return {
      type: 1,
      tag: tag,
      attrs: attrs,
      parent: null,
      children: []
    };
  }

  // HTML -> AST
  function parse(html) {
    // 用栈结构来表示开始/结束标签
    var stack = [];
    // 根节点
    var root;
    // 当前父节点
    var currentParent;
    while (html) {
      // 查找 <
      var textEnd = html.indexOf('<');
      // 如果 < 在第一个，那么证明接下来就是一个标签，不管是开始还是结束标签
      if (textEnd === 0) {
        // 匹配开始标签
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          // 把解析好的标签名和属性，生成 AST
          handleStartTag(startTagMatch);
          continue;
        }

        // 匹配结束标签 </
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          handleEndTag(endTagMatch[1]);
          continue;
        }
      }
      var text = void 0;
      // 形如：hello<div></div>
      if (textEnd >= 0) {
        // 获取文本
        text = html.substring(0, textEnd);
      }
      if (text) {
        advance(text.length);
        handleChars(text);
      }
    }

    // 截取 html 字符串，每次匹配到了就往前继续匹配
    function advance(n) {
      html = html.substring(n);
    }

    // 对文本进行处理
    function handleChars(text) {
      // 去掉空格
      text = text.replace(/\s/g, '');
      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    // 匹配开始标签
    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        // 匹配到了开始标签，就截取掉
        advance(start[0].length);

        // 开始匹配属性
        // end 代表结束符号 >，如果不是匹配到了结束标签
        // attr 表示匹配的属性
        var end, attr;
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          attr = {
            name: attr[1],
            // 这里是因为正则捕获支持双引号、单引号和无引号的属性值
            value: attr[3] || attr[4] || attr[5]
          };
          match.attrs.push(attr);
        }
        if (end) {
          // 代表一个标签匹配到结束的 > 了，代表开始标签解析完毕
          advance(1);
          return match;
        }
      }
    }

    // 对开始标签进行处理
    function handleStartTag(_ref) {
      var tagName = _ref.tagName,
        attrs = _ref.attrs;
      var element = createASTElement(tagName, attrs);
      if (!root) {
        root = element;
      }
      currentParent = element;
      stack.push(element);
    }

    // 对结束标签进行处理
    function handleEndTag(tagName) {
      // 栈结构 []
      // 比如 <div><span></span></div>，当遇到第一个结束标签 </span> 时，会匹配到栈顶 <span> 元素对应的 AST 并取出来
      var element = stack.pop();
      // 当前父元素就是栈顶的上一个元素，在这里就类似 div
      currentParent = stack[stack.length - 1];
      // 建立 parent 和 children 关系
      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    // 返回生成的 AST
    return root;
  }

  // 匹配花括号 {{ }}，捕获花括号里面的内容
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  // 递归创建生成 code
  function generate(el) {
    debugger;
    var children = genChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  // 生成子节点，调用 gen 函数进行递归创建
  function genChildren(el) {
    var children = el.children;
    if (children.length) {
      var gen = genNode;
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    }
  }

  /**
   * 判断节点类型
   * 处理文本核心
   * 源码中有更复杂的处理，比如：v-once、v-for、directives 和 slot 等。这里只考虑普通文本和变量表达式 {{ }} 的处理
   */
  function genNode(node) {
    // 如果是元素类型
    if (node.type === 1) {
      return generate(node);
    } else {
      // 如果是文本节点
      var text = node.text;
      // 如果不存在花括号变量表达式
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      }

      // 正则是全局模式，每次需要重置正则的 lastIndex 属性，不然会引发匹配 bug
      var lastIndex = defaultTagRE.lastIndex = 0;
      var tokens = [];
      var match, index;
      while (match = defaultTagRE.exec(text)) {
        // index 代表匹配到的位置
        index = match.index;
        if (index > lastIndex) {
          // 匹配到的 {{ 位置，在 tokens 里面放入普通文本
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        // 放入捕获到的变量内容
        tokens.push("_s(".concat(match[1].trim(), ")"));
        // 匹配指针后移
        lastIndex = index + match[0].length;
      }

      // 如果匹配完了花括号，text 里面还有剩余的普通文本，那么继续 push
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      // _v 表示创建文本
      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  // 处理 props 属性
  function genProps(props) {
    var staticProps = "";
    var _loop = function _loop() {
      var prop = props[i];
      // 对 props 属性里面的 style 做特殊处理
      if (prop.name === 'style') {
        var obj = {};
        prop.value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          obj[key] = value;
        });
        prop.value = obj;
      }
      var value = generateValue(prop.value);
      staticProps += "\"".concat(prop.name, "\":").concat(value, ",");
    };
    for (var i = 0; i < props.length; i++) {
      _loop();
    }
    staticProps = "{".concat(staticProps.slice(0, -1), "}");
    return staticProps;
  }
  function generateValue(value) {
    return JSON.stringify(value);
  }

  // template 字符串 -> render 函数
  function compileToFunctions(template) {
    // 把 html 代码转换成 ast 语法树
    // ast 用来描述代码本身形成树结构，可以描述 html/css/javascript
    var ast = parse(template);

    /**
     * 优化静态节点
     *
      if (options.optimize !== false) {
        optimize(ast, options);
      }
     *
     */

    /**
     * 通过 ast 生成代码
     * 类似：
     *
      _c(
        "div",
        { id: "a" },
        _c(
          "ul",
          undefined,
          _c("li", undefined, _v("长度：" + _s(array.value.length)))
        )
      );
     *
     * _c：创建元素
     * _v：创建文本
     * _s：JSON.stringify，把对象解析成文本
     */
    var code = generate(ast);

    // 使用 with 语法改变作用域为 this。之后调用 render 函数可以使用 call 改变 this，方便 code 里的变量取值
    var renderFn = new Function("with(this){return ".concat(code, "}"));
    debugger;
    return renderFn;
  }

  var mount = Vue.prototype.$mount;
  // 代表的是 Vue 源码里面包含了 compile 编译功能，这个和 runtime-only 版本需要区分开
  Vue.prototype.$mount = function (el) {
    el = el && query(el);
    var options = this.$options;
    debugger;

    // resolve template/el and convert to render function
    // 如果不存在 render 属性
    if (!options.render) {
      var template = options.template;
      if (template) ; else if (el) {
        // 如果不存在 render 和 template，但是存在 el
        // 直接将模板赋值到 el 所在的外层 html 结构（就是 el 本身，并不是父元素）
        template = getOuterHTML(el);
      }
      if (template) {
        // 最终需要把 template 模板转化成 render 函数
        var render = compileToFunctions(template);
        options.render = render;
      }
    }
    return mount.call(this, el);
  };
  function getOuterHTML(el) {
    if (el.outerHTML) {
      return el.outerHTML;
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    }
  }

  return Vue;

}));
//# sourceMappingURL=vue.js.map
