import { isFunction, isString } from "lodash-es";

interface IVNode {
    tag: string | Function;
    children?: string | IVNode;
    props?: { [key: string]: any };
}

interface IElementVNode extends IVNode {
    tag: string;
}

interface IComponentVNode extends IVNode {
    tag: Function;
}

function moundElement(vNode: IElementVNode, container: HTMLElement) {
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
function mountComponent(vNode: IComponentVNode, container: HTMLElement) {
    const render = vNode.tag();
    moundElement(render, container);
}

function render(vNode: IVNode, container: HTMLElement) {
    const tagAttr = vNode.tag;
    if (isString(tagAttr)) {
        moundElement(vNode as IElementVNode, container);
    } else if (isFunction(tagAttr)) {
        mountComponent(vNode as IComponentVNode, container);
    }
}

render(
    {
        tag: "component",
        props: {
            onClick: () => {
                alert("我是个大组件");
            },
        },
        children: "i am component",
    },
    document.body
);
const component = function () {
    return {
        tag: "div",
        props: {
            onClick: () => {
                console.log("click");
            },
        },
        children: "i am div",
    };
};
render(
    {
        tag: component,
    },
    document.body
);
