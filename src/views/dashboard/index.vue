<template>
  <div>
    <Card style="margin:10px"></Card>
    <Sale style=""></Sale>
    <Observe style="margin-top:20px;"></Observe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Card from './Card/index.vue';
import Sale from './Sale/index.vue';
import Observe from './Observe/index.vue'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: {
    Card,
    Sale,
    Observe
  },
  mounted(){
   this.$store.dispatch('getData')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
