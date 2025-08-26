<template>
  <div>
    <playground-ide editable-file-system line-numbers resizable ref="pitch-ide">
    </playground-ide>
  </div>
</template>

<script setup>
import { onMounted, useTemplateRef } from 'vue';
import scriptJs from "./pitch/script.js?raw";
import indexHtml from "./pitch/index.html?raw";
const ide = useTemplateRef('pitch-ide');

onMounted( () => {
  ide.value.config = {
    files: {
      'index.html': {
        content: indexHtml
      },
      'script.js': {
        content: scriptJs
      }
    }
  }
})
</script>