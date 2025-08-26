<template>
  <div>
    <playground-ide editable-file-system line-numbers resizable ref="chroma-ide">
    </playground-ide>
  </div>
</template>

<script setup>
import { onMounted, useTemplateRef } from 'vue';
import scriptJs from "./chroma/script.js?raw";
import indexHtml from "./chroma/index.html?raw";
const ide = useTemplateRef('chroma-ide');

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