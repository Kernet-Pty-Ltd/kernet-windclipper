<template>
  <div
    class="wcp-fixed wcp-bg-gray-900 wcp-cursor-pointer wcp-shadow-md wcp-flex wcp-justify-center wcp-items-center wcp-text-white wcp-rounded-full wcp-w-14 wcp-h-14 wcp-top-6 wcp-right-6  wcp-z-[10000]"
    @mouseleave="onCloseHover(false)" @click="close" @mouseover="onCloseHover(true)">
    X
  </div>
  <div id="clippboard"
    class="wcp-absolute wcp-flex wcp-flex-col wcp-border wcp-border-indigo-300 wcp-space-y-1 wcp-z-[10000] wcp-w-96 wcp-min-h-24 wcp-shadow wcp-rounded wcp-backdrop-blur wcp-bg-indigo-500/5">

    <div class="wcp-flex wcp-border-b wcp-border-indigo-300 wcp-py-3 wcp-px-6">

      <p class="wcp-flex-1 wcp-font-bold">
        {{ `<${name}>` }}
      </p>
      <p class="wcp-text-gray-400">click to copy</p>
    </div>
    <div class="wcp-text-green-500 wcp-font-bold wcp-pb-3 wcp-px-6">
      {{ classes }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const mouseX = ref(0);
const mouseY = ref(0);
const name = ref('');
const classes = ref([]);
let highlightedElement!: HTMLElement;
let closeHover = false;
let clippBoard!: HTMLElement;
let isActive = true;

const onCloseHover = (toggle = false) => {
  closeHover = toggle
}

const close = () => {
  isActive = false
}

onMounted(() => {


  clippBoard = document.getElementById('clippboard')!;


  window.addEventListener('mousemove', (event) => {
    if (isActive) {
      if (!closeHover) {
        mouseY.value = event.clientY
        mouseX.value = event.clientX

        clippBoard.style.left = `${event.pageX + 40}px`
        clippBoard.style.top = `${event.pageY + 20}px`

        const element = document.elementFromPoint(mouseX.value, mouseY.value) as HTMLElement;

        // Remove border from previously highlighted element
        if (highlightedElement && highlightedElement !== element) {
          highlightedElement.style.border = '';
        }

        // Add a red border to the currently highlighted element
        element.style.border = '1px solid red';
        const elClasses = element.classList;

        if (elClasses.length > 0) {
          classes.value = elClasses
        }

        name.value = element?.tagName!.toLowerCase()!


        // Store the currently highlighted element
        highlightedElement = element!;

      } else {
        // Remove border from previously highlighted element
        if (highlightedElement) {
          highlightedElement.style.border = '';
        }
      }
    }
  })

  // Click event outside of mousemove event handler
  window.addEventListener('click', (event) => {

    event.preventDefault();
    if (classes.value.length > 0 && isActive && !closeHover) {
      navigator.clipboard.writeText(classes.value.toString());
    }
  });
})


</script>
