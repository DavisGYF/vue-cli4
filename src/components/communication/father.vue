<template>
  <div>
    {{fatherData}}
    <son1 />
    <HelloWorld msg="Welcome " />
  </div>
</template>

<script>
import son1 from "@/components/communication/son1.vue";
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  components: {
    son1,
    HelloWorld
  },
  name: "Father",
  data() {
    return {
      fatherData: "我是父亲11"
    };
  }
};
</script>

<style lang="scss" scoped>
</style>