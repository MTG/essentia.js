<template>
  <v-sheet 
    class="d-flex justify-center flex-grow-1"
    height="100%"
    elevation="0"
  >
    <div id="container">
      <v-card-title>
        Analysing
        <span class="loading-dot">.</span>
        <span class="loading-dot" id="dot2">.</span>
        <span class="loading-dot" id="dot3">.</span>
      </v-card-title>
      <v-card-text>
        <v-progress-linear
          :value="progressPercent"
          color="primary"
          height="25"
          stream
          :buffer-value="progressPercent"
          class="mb-4"
        >
          <strong>{{ progress }} tracks</strong>
        </v-progress-linear>
        This could take up to 3min, please be patient.
      </v-card-text>
    </div>
  </v-sheet>
</template>

<script>
export default {
  props: ['progress'],
  computed: {
    progressPercent() {
      const [num, total] = this.progress.split('/');
      return 100 * num / total;
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  width: 50%;
  margin-top: auto;
  margin-bottom: auto;
}

.loading-dot {
  will-change: opacity;
  animation: appear 1s ease-in-out infinite;

  &#dot2 {
    animation-delay: 0.33s;
  }

  &#dot3 {
    animation-delay: 0.66s;
  }
}

@keyframes appear {
  from {
    opacity: 100%;
  }
  to {
    opacity: 0%;
  }
}
</style>