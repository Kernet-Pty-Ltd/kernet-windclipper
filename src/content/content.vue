<template>
  <div v-if="isActive"
    class="wcp-fixed wcp-bg-gray-500  wcp-cursor-pointer wcp-shadow-md wcp-flex wcp-justify-center wcp-items-center wcp-text-white wcp-rounded p-4 iwcp-w-14 wcp-h-4 wcp-top-6 wcp-right-6  wcp-z-[10000]"
    @mouseleave="onCloseHover(false)" @click="close" @mouseover="onCloseHover(true)">
    Exit windclipper
  </div>
  <div id="clippboard"
    class="wcp-absolute wcp-flex wcp-flex-col wcp-border wcp-border-indigo-300 wcp-space-y-1 wcp-z-[10000] wcp-w-96 wcp-min-h-24 wcp-shadow wcp-rounded wcp-backdrop-blur wcp-bg-indigo-500/5">

    <div class="wcp-flex wcp-border-b wcp-border-indigo-300 wcp-py-3 wcp-px-6">

      <p class="wcp-flex-1 wcp-font-bold">
        {{ `<${name}>` }}
      </p>
      <p class="wcp-text-gray-400"> {{ !copied ? 'click to copy' : 'copied to clipboard' }}</p>
    </div>
    <div class="wcp-text-green-500 wcp-font-bold wcp-pb-3 wcp-px-6">
      {{ classes }}
    </div>
  </div>
</template>
<style>
.wp-hidden {
  display: none;
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const mouseX = ref(0);
const mouseY = ref(0);
const name = ref('');
const classes = ref('');
const copied = ref(false);
let highlightedElement!: HTMLElement;
let closeHover = ref(false);
let clippBoard!: HTMLElement;
let isActive = ref(false);

const onCloseHover = (toggle = false) => {
  closeHover.value = toggle
}

const close = () => {
  isActive.value = false
  toggleEvents(true)
}

const toggleEvents = (toggle = false) => {
  // Get all the button and a elements from the body
  const buttons = document.body.getElementsByTagName('button');
  const links = document.body.getElementsByTagName('a');

  // Convert the HTMLCollection to an array to use forEach
  Array.from(buttons).forEach(button => {
    // Set the pointerEvents property to 'none'
    button.style.pointerEvents = toggle ? 'all' : 'none';
  });

  Array.from(links).forEach(link => {
    // Set the pointerEvents property to 'none'
    link.style.pointerEvents = toggle ? 'all' : 'none';
  });
}

onMounted(() => {

  clippBoard = document.getElementById('clippboard')!;

  window.addEventListener('mousemove', (event) => {
    if (isActive.value && !closeHover.value) {

      copied.value = false

      clippBoard.style.display = 'flex'
      mouseY.value = event.clientY
      mouseX.value = event.clientX

      clippBoard.style.left = `${event.pageX + 40}px`
      clippBoard.style.top = `${event.pageY + 20}px`

      const element = document.elementFromPoint(mouseX.value, mouseY.value) as HTMLElement;

      if (element) {
        // Remove border from previously highlighted element
        if (highlightedElement && highlightedElement !== element) {
          highlightedElement.style.border = '';
        }

        // Add a red border to the currently highlighted element
        element.style.border = '1px solid red';
        const elClasses = element.classList;

        if (elClasses.length > 0) {
          classes.value = elClasses.toString()
        }

        name.value = element?.tagName!.toLowerCase()!

        // Store the currently highlighted element
        highlightedElement = element!;
      }

    } else {

      if (highlightedElement) {
        highlightedElement.style.border = '';
      }

      clippBoard.style.display = 'none'
    }
  })

  // Click event outside of mousemove event handler
  window.addEventListener('click', (event) => {

    event.preventDefault();
    if (classes.value.length > 0 && isActive.value && !closeHover.value) {
      navigator.clipboard.writeText(classes.value.toString());
      copied.value = true
    }
  });


  chrome.runtime?.onMessage.addListener(async (message) => {
    if (message['command'] === 'open') {
      isActive.value = true
      closeHover.value = false

      toggleEvents(false)
    }
  })
})


</script>
