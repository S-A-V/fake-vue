import VNode from './vnode';

export const emptyNode = new VNode('', {}, []);

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
  let i, key;
  const map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (key) map[key] = i;
  }
  return map;
}

export function createPatchFunction() {
  // 虚拟 dom -> 真实 dom
  function createElm(vnode) {
    const children = vnode.children;
    const tag = vnode.tag;
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
      children.forEach((child) => {
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
    let i = vnode.data;
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

  function initComponent(vnode) {
    vnode.elm = vnode.componentInstance.$el;
  }

  // 解析 vnode 的 data 属性，映射到真实 dom 上
  function updateProperties(vnode, oldProps = {}) {
    // 真实的 dom 节点
    const elm = vnode.elm;
    const newProps = vnode.data || {};

    // 移除新节点上没有的属性
    for (const key in oldProps) {
      if (!newProps[key]) {
        elm.removeAttribute(key);
      }
    }

    // 特殊处理 style 属性，如果新节点没有，置空 style 属性值
    const newStyle = newProps.style || {};
    const oldStyle = oldProps.style || {};
    for (const key in oldStyle) {
      if (!newStyle[key]) {
        elm.style[key] = '';
      }
    }

    // 遍历设置新的属性
    for (const key in newProps) {
      if (key === 'style') {
        for (const styleName in newProps.style) {
          elm.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        elm.className = newProps.class;
      } else {
        // 给元素设置属性
        elm.setAttribute(key, newProps[key]);
      }
    }
  }

  // diff 算法核心。采用双指针方式，对比新旧 vnode 子节点
  function updateChildren(parentElm, oldCh, newCh) {
    // ???
    const patch = vm.__patch__;

    let oldStartIdx = 0; // 旧的子节点起始下标
    let newStartIdx = 0; // 新的子节点起始下标
    let oldEndIdx = oldCh.length - 1; // 旧的子节点结束下标
    let oldStartVnode = oldCh[0]; // 旧的第一个子节点
    let oldEndVnode = oldCh[oldEndIdx]; // 旧的最后一个子节点
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];

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
        let oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        // 根据旧子节点的 key 和 index 映射表，从新的起始子节点进行查找。如果可以找到就进行移动操作，否则直接进行插入操作
        let idxInOld = oldKeyToIdx[newStartVnode.key];
        if (!idxInOld) {
          // New element

          // 找不到旧的节点，直接插入
          parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.elm);
        } else {
          // 找到的旧节点
          let vnodeToMove = oldCh[idxInOld];
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
      const refElm = !newCh[newEndIdx + 1] ? null : newCh[newEndIdx + 1].elm;
      // 旧节点循环结束，新节点还有剩余。新节点添加到头部或尾部
      for (let i = newStartIdx; i <= newEndIdx; i++) {
        parentElm.insertBefore(createElm(newCh[i]), refElm);
      }
    } else if (newStartIdx > newEndIdx) {
      // 新节点循环结束，老节点还有剩余。老节点移除
      for (let i = oldStartIdx; i <= oldEndIdx; i++) {
        let ch = oldCh[i];
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
      const isRealElement = oldVnode.nodeType;
      if (isRealElement) {
        // oldVnode 是真实 dom 元素，代表初次渲染
        const oldElm = oldVnode;
        const parentElm = oldElm.parentNode;

        // 虚拟 dom -> 真实 dom
        const elm = createElm(vnode);

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
        const elm = (vnode.elm = oldVnode.elm);
        // 更新属性
        updateProperties(vnode, oldVnode.data);

        const oldCh = oldVnode.children || [];
        const newCh = vnode.children || [];
        if (oldCh.length > 0 && newCh.length > 0) {
          // 新旧都存在子节点
          updateChildren(elm, oldCh, newCh);
        } else if (oldCh.length) {
          // 旧的有儿子，新的没有
          elm.innerHTML = '';
        } else if (newCh.length) {
          // 新的有儿子，旧的没有
          for (let i = 0; i < newCh.length; i++) {
            const child = newCh[i];
            elm.appendChild(createElm(child));
          }
        }
      }
    }
  };
}
