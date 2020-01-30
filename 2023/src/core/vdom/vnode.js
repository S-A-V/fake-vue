// 定义 VNode 类
export default class VNode {
  constructor(tag, data, children, text, componentOptions) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.parent = undefined;
  }
}

export function createTextVNode(text) {
  return new VNode(undefined, undefined, undefined, text);
}
