<template>
  <div>
    <h3>kform index 页面</h3>

    <kform :model="model" :rules="rules">
      <kformItem label="用户" prop="name">
        <kinput v-model="model.name"></kinput>
      </kformItem>
    </kform>
    {{model}}
    <p>
      <button @click="submit">提交</button>
    </p>
  </div>
</template>

<script>
import kinput from "./kInput";
import kformItem from "./kformitem";
import kform from "./kform";
// import create from "../../utils/create";
// import Notice from "./notice";

export default {
  name: "KFormIndex",

  components: {
    kinput,
    kformItem,
    kform
  },
  data() {
    return {
      model: {
        name: "121",
        password: ""
      },
      rules: {
        name: [{ required: true, message: "用户名" }]
      }
    };
  },
  methods: {
    submit() {
      // console.log("e", e);
      // create(Notice, {
      //   title: "娇艳信息",
      //   message: "message",
      //   duration: 1000
      // }).show();
      this.$notice({
        title: "娇艳信息",
        message: "message",
        duration: 1000
      }).show();

      if (!this.model.name) {
        console.log("1", 1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>