<template>
  <div>
    {{son1Data}}
    <grandson />
  </div>
</template>

<script>
import grandson from "./grandson1.vue";

export default {
  components: {
    grandson
  },
  name: "son1",
  data() {
    return {
      son1Data: "我是erzi11111"
    };
  }
};
</script>

<style lang="scss" scoped>
</style>