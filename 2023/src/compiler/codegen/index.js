// 匹配花括号 {{ }}，捕获花括号里面的内容
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 递归创建生成 code
export function generate(el) {
  debugger;
  const children = genChildren(el);
  const code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'}${
    children ? `,${children}` : ''
  })`;
  return code;
}

// 生成子节点，调用 gen 函数进行递归创建
function genChildren(el) {
  const children = el.children;
  if (children.length) {
    const gen = genNode;
    return `${children.map((c) => gen(c)).join(',')}`;
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
    let text = node.text;
    // 如果不存在花括号变量表达式
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    }

    // 正则是全局模式，每次需要重置正则的 lastIndex 属性，不然会引发匹配 bug
    let lastIndex = (defaultTagRE.lastIndex = 0);
    let tokens = [];
    let match, index;

    while ((match = defaultTagRE.exec(text))) {
      // index 代表匹配到的位置
      index = match.index;
      if (index > lastIndex) {
        // 匹配到的 {{ 位置，在 tokens 里面放入普通文本
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      // 放入捕获到的变量内容
      tokens.push(`_s(${match[1].trim()})`);
      // 匹配指针后移
      lastIndex = index + match[0].length;
    }

    // 如果匹配完了花括号，text 里面还有剩余的普通文本，那么继续 push
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }

    // _v 表示创建文本
    return `_v(${tokens.join('+')})`;
  }
}

// 处理 props 属性
function genProps(props) {
  let staticProps = ``;
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    // 对 props 属性里面的 style 做特殊处理
    if (prop.name === 'style') {
      let obj = {};
      prop.value.split(';').forEach((item) => {
        let [key, value] = item.split(':');
        obj[key] = value;
      });
      prop.value = obj;
    }
    const value = generateValue(prop.value);
    staticProps += `"${prop.name}":${value},`;
  }
  staticProps = `{${staticProps.slice(0, -1)}}`;
  return staticProps;
}

function generateValue(value) {
  return JSON.stringify(value);
}
