import { parse } from './parser/index';
import { generate } from './codegen/index';

// template 字符串 -> render 函数
export function compileToFunctions(template) {
  // 把 html 代码转换成 ast 语法树
  // ast 用来描述代码本身形成树结构，可以描述 html/css/javascript
  const ast = parse(template);

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
  const code = generate(ast);

  // 使用 with 语法改变作用域为 this。之后调用 render 函数可以使用 call 改变 this，方便 code 里的变量取值
  const renderFn = new Function(`with(this){return ${code}}`);
  debugger;
  return renderFn;
}
