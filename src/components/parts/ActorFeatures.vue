<template>
  <ol class="items-list">
    <li class="item flexrow items-header">
      <div class="item-name">Name</div>
      <div class="item-controls">
        <a @click="itemCreate(context.actor._id, itemBase)" class="item-control item-create" title="Create item" data-type="feature"><i class="fas fa-plus"></i> Add item</a>
      </div>
    </li>
    <li v-for="(item, id) in context.features" :key="'data.features.' + id" class="item flexrow" :data-item-id="item._id">
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
  </ol>
</template>

<script>
import { itemCreate, itemEdit, itemDelete } from '../methods/ItemOperations.mjs';
export default {
  setup() {
    return {
      itemCreate,
      itemEdit,
      itemDelete
    }
  },
  name: 'ActorFeatures',
  props: ['context', 'actor'],
  computed: {
    data() {
      return this.actor.data;
    },
    itemBase() {
      return {
        name: 'New Feature',
        type: 'feature',
        data: {}
      }
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>