<template>
  <v-sheet>
      <v-progress-linear
        v-model="progress"
        color="primary"
        height="25"
      >
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>
  </v-sheet>
</template>

<script>
export default {
    props: ['progress']
}
</script>

<style>

</style>