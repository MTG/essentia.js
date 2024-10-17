import { getFeaturesDefault } from "./js/default";
import { getFeaturesJSReimplementation } from "./js/jsReimplementation";
import { extractor2A } from "./js/extractor2A";
import { extractor2B } from "./js/extractor2B";
import { vectorTestJS, vectorTestCPP } from "./js/vectorArray";
import { sampleRate } from "./js/analysisParams";

const testFunctions = {
  "default": getFeaturesDefault,
  "js-reimplementation": getFeaturesJSReimplementation,
  "extractor-2A": extractor2A,
  "extractor-2B": extractor2B,
  "vector-test-js": vectorTestJS,
  "vector-test-cpp": vectorTestCPP
};

const audioDuration = 600;
const testInput = Float32Array.from(Array(sampleRate*audioDuration));
testInput.forEach( (e,i) => testInput[i] = Math.random()*2 - 1 );

const buttons = document.querySelectorAll(".test-runner");

function timeTest(funcName, assignedButton) {
  // disable associated button
  const testFunc = testFunctions[funcName];
  assignedButton.disabled = true;
  setTimeout( () => {
    let numReps = 5;
    const times = [];
    while (numReps > 0) {
      performance.mark(`${testFunc.name}-start`);
      const result = testFunc(testInput);
      performance.mark(`${testFunc.name}-end`);
      const measure = performance.measure(`${testFunc.name}-duration`, `${testFunc.name}-start`, `${testFunc.name}-end`);
      times.push(measure.duration);
      numReps -= 1;
      console.log(`${numReps} reps left`);
    }
    
    const averageTime = times.reduce( (acc, val) => acc+val ) / times.length;
    console.log(`${testFunc.name} took ${averageTime}ms on average`);
    assignedButton.disabled = false;
    // console.log(`${testFunc.name} result:`, result);
  }, 50);
}

window.onload = () => {
  // assign button listeners
  buttons.forEach( b => {
    const funcName = b.id;
    b.onclick = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      timeTest(funcName, b);
    }
  })
}