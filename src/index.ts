interface IVNode {
  tag: string;
  children: string | IVNode;
  props: { [key: string]: any };
}

function render(vNode: IVNode, container: HTMLElement) {
  const el = document.createElement(vNode.tag);
  for (const prop of Object.keys(vNode.props)) {
    if (prop.startsWith("on")) {
      el.addEventListener(
        prop.substring(2).toLowerCase(),
        vNode.props[prop],
        false
      );
    }
  }
  const childrenAttr = vNode.children;
  if (typeof childrenAttr === "string") {
    el.appendChild(document.createTextNode(childrenAttr));
  } else {
    render(childrenAttr, el);
  }
  container.appendChild(el);
}

render(
  {
    tag: "div",
    props: {
      onClick: () => {
        console.log("click");
      },
    },
    children: "i am div",
  },
  document.body
);
