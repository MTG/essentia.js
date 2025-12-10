<template>
  <div class="ui info small message" v-if="showInfo">
    <i class="close icon" @click="closeInfo"></i>
    <div class="header">
      About analysis:
    </div>
    <p>We select 65% of the audio, evenly spaced throughout the track, for analysis to ensure efficient processing while maintaining accuracy.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showInfo = ref(true);

function closeInfo() {
  showInfo.value = false;
}
</script>