<template>
  <header class="sheet-header">
    <img :src="actor.img" :alt="actor.name" class="profile-img" height="100" width="100"/>
    <div class="header-fields">
      <h1 class="charname">
        <input type="text" name="name" v-model="actor.name" placeholder="Name"/>
      </h1>
      <div class="resources grid grid-3col">

        <div class="resource flex-group-center">
          <label for="data.health.value" class="resource-label">Health</label>
          <div class="resource-content flexrow flex-center flex-between">
          <input type="text" name="data.health.value" v-model="data.health.value" data-dtype="Number"/>
          <span> / </span>
          <input type="text" name="data.health.max" v-model="data.health.max" data-dtype="Number"/>
          </div>
        </div>

        <div class="resource flex-group-center">
          <label for="data.power.value" class="resource-label">Power</label>
          <div class="resource-content flexrow flex-center flex-between">
          <input type="text" name="data.power.value" v-model="data.power.value" data-dtype="Number"/>
          <span> / </span>
          <input type="text" name="data.power.max" v-model="data.power.max" data-dtype="Number"/>
          </div>
        </div>

        <div class="resource flex-group-center">
          <label for="data.attributes.level.value" class="resource-label">Level</label>
          <div class="resource-content flexrow flex-center flex-between">
          <input type="text" name="data.attributes.level.value" v-model="data.attributes.level.value" data-dtype="Number"/>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: ['actor'],
  computed: {
    data() {
      return this.actor.data;
    }
  }
}
</script>

<style scoped>

</style>