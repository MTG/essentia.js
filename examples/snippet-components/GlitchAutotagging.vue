<template>
  <div>
    <playground-ide editable-file-system line-numbers resizable ref="autotagging-ide">
    </playground-ide>
  </div>
</template>

<script setup>
import { onMounted, useTemplateRef } from 'vue';
import scriptJs from "./autotagging/app.js?raw";
import indexHtml from "./autotagging/index.html?raw";
import inferenceWorkerJs from "./autotagging/inference-worker.js?raw";
import extractorWorkerJs from "./autotagging/extractor-worker.js?raw";
import audioUtilsJs from "./autotagging/audio-utils.js?raw";
import modelJson from "./autotagging/msd-musicnn-1/model.json?raw";
// import modelBinURL from "./autotagging/msd-musicnn-1/group1-shard1of1.bin?url";
import modelBinContent from "./autotagging/msd-musicnn-1/group1-shard1of1.bin?raw";

const ide = useTemplateRef('autotagging-ide');

onMounted( () => {
  ide.value.config = {
    files: {
      'index.html': {
        content: indexHtml
      },
      'app.js': {
        content: scriptJs
      },
      'inference-worker.js': {
        content: inferenceWorkerJs
      },
      'extractor-worker.js': {
        content: extractorWorkerJs
      },
      'audio-utils.js': {
        content: audioUtilsJs
      },
      'model.json': {
        content: modelJson,
      },
      "group1-shard1of1.bin": {
        hidden: false,
        content: modelBinContent,
        contentType: 'application/octet-stream',
      }
    }
  }
})
</script>