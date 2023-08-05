<template>
  <Tab group="primary" :tab="tab">
    <section class="grid grid-3col">
      <aside class="sidebar">

        <div class="abilities flexcol">
          <div v-for="(ability, key) in context.data.abilities" :key="'data.abilities.' + key + '.value'" :data-key="key" class="ability flexrow flex-group-center">
            <label @click="onRollable" :for="'data.abilities.' + key + '.value'" class="resource-label rollable flexlarge align-left" :data-roll="'d20+@abilities.' + key + '.mod'" :data-label="ability.label">{{ability.label}}</label>
            <input type="text" :name="'data.abilities.' + key + '.value'" v-model="ability.value" data-dtype="Number"/>
            <span class="ability-mod rollable" :data-roll="'d20+@abilities.' + key + '.mod'" :data-label="ability.label">{{numberFormat(ability.mod, 0, true)}}</span>
          </div>
        </div>
      </aside>

      <section class="main grid-span-2">
        <ActorFeatures :context="context" :actor="actor"/>
      </section>

    </section>
  </Tab>
</template>

<script>
import { default as ActorFeatures } from '../parts/ActorFeatures.vue';
import { default as Tab } from '../parts/Tab.vue';
import { onRollable } from '../methods/Events.mjs';
import { numberFormat } from '../methods/Helpers.mjs';
export default {
  setup() {
    return {
      onRollable,
      numberFormat
    }
  },
  name: 'Features',
  props: ['context', 'actor', 'tab'],
  components: {
    ActorFeatures,
    Tab
  },
  computed: {
    data() {
      return this.context.data;
    }
  },
}
</script>

<style scoped>

</style>