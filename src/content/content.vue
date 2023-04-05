<template>
  <div
    class="fixed bg-gray-900 cursor-pointer shadow-md flex justify-center items-center text-white rounded-full w-14 h-14 top-6 right-6  z-[10000]"
    @mouseleave="onCloseHover(false)" @click="close" @mouseover="onCloseHover(true)">
    X
  </div>
  <div id="clippboard"
    class="absolute flex flex-col space-y-1 z-[10000] w-96 min-h-24 shadow rounded backdrop-blur bg-indigo-100 ">

    <div class="flex border-b py-3 px-6">

      <p class="flex-1 font-bold">
        {{ `<${name}>` }}
      </p>
      <p class="text-gray-400">click to copy</p>
    </div>
    <div class="text-green-500 font-bold pb-3 px-6">
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
let highlightedElement!: Element;
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

        const element = document.elementFromPoint(mouseX.value, mouseY.value);

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
  window.addEventListener('click', () => {
    if (classes.value.length > 0 && isActive && !closeHover) {
      navigator.clipboard.writeText(classes.value.toString());
    }
  });
})


</script>
