<template>
  <Tab group="primary" :tab="tab">
    <Editor
      button="true"
      target="data.biography"
      :content="context.data.biography"
      :rollData="context.rollData"
      :owner="context.owner"
      :editable="context.editable"
    />
  </Tab>
</template>

<script>
import { default as Tab } from '../parts/Tab.vue';
import { default as Editor } from '../parts/Editor.vue';
export default {
  name: 'Bio',
  props: ['context', 'actor', 'tab'],
  computed: {
    data() {
      return this.actor.data;
    }
  },
  components: {
    Tab,
    Editor
  }
}
</script>

<style scoped>

</style>