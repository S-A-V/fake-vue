// 以下为源码中的正则表达式
import { attribute, startTagOpen, startTagClose, endTag } from './html-parser';

// 创建 AST
function createASTElement(tag, attrs) {
  return {
    type: 1,
    tag,
    attrs,
    parent: null,
    children: [],
  };
}

// HTML -> AST
export function parse(html) {
  // 用栈结构来表示开始/结束标签
  let stack = [];
  // 根节点
  let root;
  // 当前父节点
  let currentParent;

  while (html) {
    // 查找 <
    let textEnd = html.indexOf('<');
    // 如果 < 在第一个，那么证明接下来就是一个标签，不管是开始还是结束标签
    if (textEnd === 0) {
      // 匹配开始标签
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        // 把解析好的标签名和属性，生成 AST
        handleStartTag(startTagMatch);
        continue;
      }

      // 匹配结束标签 </
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        handleEndTag(endTagMatch[1]);
        continue;
      }
    }

    let text;
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
        text,
      });
    }
  }

  // 匹配开始标签
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      // 匹配到了开始标签，就截取掉
      advance(start[0].length);

      // 开始匹配属性
      // end 代表结束符号 >，如果不是匹配到了结束标签
      // attr 表示匹配的属性
      let end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        attr = {
          name: attr[1],
          // 这里是因为正则捕获支持双引号、单引号和无引号的属性值
          value: attr[3] || attr[4] || attr[5],
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
  function handleStartTag({ tagName, attrs }) {
    let element = createASTElement(tagName, attrs);
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
    let element = stack.pop();
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
