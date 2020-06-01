import Vue from "vue";

export default function create(Component, props) {
  // 方法 一
  const Ctor = Vue.extend(Component);
  const comp = new Ctor({ propsData: props });
  comp.$mount();

  document.body.appendChild(comp.$el);
  comp.remove = () => {
    document.body.removeChild(comp.$el);
    comp.$destory;
  };

  return comp;
  // 方法二
  /* const vm = new Vue({
    render(h) {
      return h(Component, { props });
    },
  }).$mount();
  document.body.appendChild(vm.$el);
  const comp = vm.$children[0];

  comp.remove = () => {
    document.body.removeChild(vm.$el);
    comp.$destory;
  };
  return comp; */
}
