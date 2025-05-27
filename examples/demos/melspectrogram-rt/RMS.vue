.<template>
  <div class="ui small statistics">
    <div class="statistic">
      <div class="value">
        <span id="rms-value"><slot name="rms-value">-100</slot></span> <span>dBFS</span>
      </div>
      <div class="label">
        RMS
      </div>
    </div>
    <!-- TODO: add other single-valued lowlevel descriptors (spectral moments, etc) -->
  </div>
</template>

<script setup>
</script>
