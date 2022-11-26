let data = {
  ok: false,
  text: "text",
};
let activeEffect;
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    console.log("effectfn");
    activeEffect = effectFn;
    fn();
  };
  effectFn.deps = [];
  effectFn();
}
const bucket = new WeakMap();

const obj = new Proxy(data, {
  set(target, key, newVal) {
    target[key] = newVal;
    trigger(target, key);
    return newVal;
  },
  get(target, key) {
    track(target, key);
    return target[key];
  },
});

function cleanup(effectFn) {
  const depsArray = effectFn.deps;

  for (let i = 0; i < depsArray.length; i++) {
    const deps = depsArray[i];
    deps.delete(effectFn);
  }
  // effectFn.length = 0;
}

function track(target, key) {
  if (!activeEffect) {
    return target[key];
  }
  let depsMap = bucket.get(target);
  if (!depsMap) {
    depsMap = new Map();
    bucket.set(target, depsMap);
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) {
    return;
  }
  const deps = depsMap.get(key);
  const depsNew = new Set(deps);
  console.log(depsNew);
  depsNew &&
    depsNew.forEach((fn) => {
      console.log("fffff");
      fn();
    });
}
effect(() => {
  document.body.innerText = obj.ok ? obj.text : "not";
});
setTimeout(() => {
  obj.ok = true;
  // obj.text = "hello world";
}, 1000);
