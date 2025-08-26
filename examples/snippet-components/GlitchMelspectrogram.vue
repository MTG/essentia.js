<template>
  <div>
    <playground-ide editable-file-system line-numbers resizable ref="melspectrogram-ide">
    </playground-ide>
  </div>
</template>

<script setup>
import { onMounted, useTemplateRef } from 'vue';
import scriptJs from "./melspectrogram/script.js?raw";
import indexHtml from "./melspectrogram/index.html?raw";
const ide = useTemplateRef('melspectrogram-ide');

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