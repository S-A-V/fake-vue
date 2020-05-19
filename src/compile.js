// 遍历 dom 结构，解析指令和插值表达式

class Compile {
  // el 待编译模板，vm 为 fake vue 实例
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);

    // 把模板中的内容转移到片段中操作
    this.$fragment = this.node2Fragment(this.$el);
    // 执行编译
    this.compile(this.$fragment);
    // 放回 $el
    this.$el.appendChild(this.$fragment);
  }

  node2Fragment(el) {
    // 创建片段
    const fragment = document.createDocumentFragment();

    let child;
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }

  compile(el) {
    const { childNodes } = el;
    childNodes.forEach((node) => {
      if (node.nodeType === 1) {
        // 元素
        // console.log("compile element: " + node.nodeName);
        this.compileElement(node);
      } else if (this.isInter(node)) {
        // {{xxxx}} 花括号内无空格
        // console.log("compile {{xxxx}}: " + node.textContent);
        this.compileText(node);
      }

      // 递归子节点
      if (node.children && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }

  // 文本替换
  compileText(node) {
    // ???
    console.log(RegExp.$1);

    // 表达式
    const exp = RegExp.$1.trim();
    this.update(node, exp, "text");
  }

  update(node, exp, dir) {
    const updator = this[`${dir}Updator`];
    // 首次初始化
    updator && updator(node, this.$vm[exp]);
    // 创建 watcher 实例，依赖收集完成了
    new Watcher(this.$vm, exp, function (value) {
      updator && updator(node, value);
    });
  }

  textUpdator(node, value) {
    node.textContent = value;
  }

  htmlUpdator(node, value) {
    node.innerHTML = value;
  }

  modelUpdator(node, value) {
    node.value = value;
  }

  compileElement(node) {
    const nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach((attr) => {
      // v-aaa="bbb"

      // v-aaa
      const attrName = attr.name;
      // bbb
      const exp = attr.value;
      if (attrName.split("-")[0] === "v") {
        // aaa
        const dir = attrName.split("-")[1];
        this[dir] && this[dir](node, exp);
      }

      // 事件处理
      // @aaa="bbb"
      if (attrName.startsWith("@")) {
        // aaa
        const eventName = attrName.substring(1);
        // 事件监听处理
        this.eventHandler(node, this.$vm, exp, eventName);
      }
    });
  }

  // v-text
  text(node, exp) {
    this.update(node, exp, "text");
  }

  // v-html
  html(node, exp) {
    this.update(node, exp, "html");
  }

  // v-model
  model(node, exp) {
    this.update(node, exp, "model");

    node.addEventListener("input", (e) => {
      this.$vm[exp] = e.target.value;
    });
  }

  // 事件处理，给 node 添加事件监听
  // 通过 $options.methods 获得事件回调函数
  eventHandler(node, vm, exp, eventName) {
    let fn = vm.$options.methods && vm.$options.methods[exp];
    if (eventName && fn) {
      node.addEventListener(eventName, fn.bind(vm));
    }
  }
}
