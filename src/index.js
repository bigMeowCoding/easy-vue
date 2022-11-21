let data = {
  text: "text",
};
let activeEffect;
function effect(fn) {
  activeEffect = fn;
  fn();
}
const bucket = new Set();
const obj = new Proxy(data, {
  set(target, key, newVal) {
    target[key] = newVal;
    bucket.forEach((fn) => {
      fn();
    });
  },
  get(target, key) {
    if(!activeEffect) {
      return  target[key]
    }
    bucket.add(activeEffect);
    return target[key];
  },
});

effect(() => {
  document.body.innerText = obj.text;
});
setTimeout(() => {
  obj.text = "newText";
}, 1000);
