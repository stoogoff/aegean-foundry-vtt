<template>
  <Tab group="primary" :tab="tab">
    <ol class="items-list">
      <template v-for="(spells, spellLevel) in context.spells" :key="'data.spells.' + spellLevel" >
        <li class="item flexrow items-header">
          <div class="item-name">Level {{spellLevel}}</div>
          <div class="item-controls">
            <a @click="itemCreate(context.actor._id, modifiedItemBase(spellLevel))" class="item-control item-create" title="Create item" data-type="spell" :data-spell-level="spellLevel"><i class="fas fa-plus"></i> Add item</a>
          </div>
        </li>
        <li v-for="(item, id) in spells" :key="'data.spells.' + spellLevel + '.' + id" class="item flexrow" :data-item-id="item._id">
          <div class="item-name">
            <div class="item-image">
              <a class="rollable" data-roll-type="item"><img :src="item.img" :title="item.name" width="24" height="24"/></a>
            </div>
            <h4>{{item.name}}</h4>
          </div>
          <div class="item-controls">
            <a @click="itemEdit(context.actor._id, item._id)" class="item-control item-edit" title="Edit Item"><i class="fas fa-edit"></i></a>
            <a @click="itemDelete(context.actor._id, item._id)" class="item-control item-delete" title="Delete Item"><i class="fas fa-trash"></i></a>
          </div>
        </li>
      </template>
    </ol>
  </Tab>
</template>

<script>
import { default as Tab } from '../parts/Tab.vue';
import { itemCreate, itemEdit, itemDelete } from '../methods/ItemOperations.mjs';
export default {
  setup() {
    return {
      itemCreate,
      itemEdit,
      itemDelete
    }
  },
  name: 'Spells',
  props: ['context', 'actor', 'tab'],
  computed: {
    data() {
      return this.actor.data;
    },
    itemBase() {
      return {
        name: 'New Spell',
        type: 'spell',
        data: {}
      }
    }
  },
  methods: {
    modifiedItemBase(spellLevel) {
      let result = this.itemBase;
      result.name = `New Level ${spellLevel ?? 1} Spell`;
      result.data.spellLevel = spellLevel;
      return result;
    },
  },
  components: {
    Tab
  }
}
</script>

<style scoped>

</style>