<template>
  <Tab group="primary" :tab="tab">
    <ol class="items-list">
      <li class="item flexrow items-header">
        <div class="item-name">Name</div>
        <div class="item-controls">
          <a @click="itemCreate(context.actor._id, itemBase)" class="item-control item-create" title="Create item" data-type="item"><i class="fas fa-plus"></i> Add item</a>
        </div>
      </li>
      <li v-for="(item, id) in context.gear" :key="'data.items.' + id" class="item flexrow" :data-item-id="item._id">
        <div class="item-name">
          <div class="item-image">
            <a class="rollable" data-roll-type="item"><img :src="item.img" :title="item.name" width="24" height="24"/></a>
          </div>
          <h4>{{item.name}}</h4>
        </div>
        <div class="item-formula item-prop">{{item.data.formula ?? ''}}</div>
        <div class="item-controls">
          <a @click="itemEdit(context.actor._id, item._id)" class="item-control item-edit" title="Edit Item"><i class="fas fa-edit"></i></a>
          <a @click="itemDelete(context.actor._id, item._id)" class="item-control item-delete" title="Delete Item"><i class="fas fa-trash"></i></a>
        </div>
      </li>
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
  name: 'Items',
  props: ['context', 'actor', 'tab'],
  computed: {
    data() {
      return this.actor.data;
    },
    itemBase() {
      return {
        name: 'New Item',
        type: 'item',
        data: {}
      }
    }
  },
  methods: {},
  components: {
    Tab
  }
}
</script>

<style scoped>

</style>