<template>
  <Tab group="primary" :tab="tab">
    <ol class="items-list effects-list">
      <template v-for="(section, sid) in context.effects" :key="'data.effects.' + sid">
        <li class="items-header flexrow" :data-effect-type="section.type">
          <h3 class="item-name effect-name flexrow">{{game.i18n.localize(section.label)}}</h3>
          <div class="effect-source">Source</div>
          <div class="effect-source">Duration</div>
          <div class="item-controls effect-controls flexrow">
            <a @click="manageEffect" data-action="create" class="effect-control" title="Create effect"><i class="fas fa-plus"></i> Add effect</a>
          </div>
        </li>

        <ol class="item-list">
          <li v-for="(effect, id) in section.effects" :key="'data.effects.' + sid + '.' + id" class="item effect flexrow" :data-effect-id="effect._id">
            <div class="item-name effect-name flexrow">
              <img class="item-image" :src="effect.icon" :title="effect.label" width="24" height="24"/>
              <h4>{{effect.label}}</h4>
            </div>
            <div class="effect-source">{{effect.sourceName}}</div>
            <div class="effect-duration">{{effect.duration.label}}</div>
            <div class="item-controls effect-controls flexrow">
              <a @click="manageEffect" data-action="toggle" class="effect-control" title="Toggle Effect">
                <i :class="'fas ' + (effect.disabled ? 'fa-check' : 'fa-times')"></i>
              </a>
              <a @click="manageEffect" data-action="edit" class="effect-control" title="Edit Effect">
                <i class="fas fa-edit"></i>
              </a>
              <a @click="manageEffect" data-action="delete" class="effect-control" title="Delete Effect">
                <i class="fas fa-trash"></i>
              </a>
            </div>
          </li>
        </ol>
      </template>
    </ol>
  </Tab>
</template>

<script>
import { default as Tab } from '../parts/Tab.vue';
import { onManageActiveEffect } from '../../../module/helpers/effects.mjs';
export default {
  name: 'ActiveEffects',
  props: ['context', 'actor', 'tab'],
  computed: {
    // Add a computed property to use game.i18n.localize in templates.
    game() {
      return game;
    }
  },
  methods: {
    manageEffect(event) {
      let owner = game.actors.get(this.context.actor._id);
      if (owner) onManageActiveEffect(event, owner);
    }
  },
  components: {
    Tab
  }
}
</script>

<style scoped>

</style>