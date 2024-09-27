<!--
  Copyright (c) 2019-2024 Yuxi (Evan) You
  Copyright (c) 2024 Nintendo Homebrew

  SPDX-License-Identifier: MIT
-->

<script setup lang="ts">
import type { MenuItem } from 'vitepress/dist/client/theme-default/composables/outline.js'

defineProps<{
  headers: MenuItem[]
  root?: boolean
}>()

function onClick({ target: el }: Event) {
  const id = (el as HTMLAnchorElement).href!.split('#')[1]
  const heading = document.getElementById(decodeURIComponent(id))
  heading?.focus({ preventScroll: true })
}
</script>

<template>
  <ul class="VPDocOutlineItem" :class="root ? 'root' : 'nested'">
    <li v-for="{ children, link, title } in headers">
      <a class="outline-link" :href="link" @click="onClick" :title="title">{{ title }}</a>
      <template v-if="children?.length">
        <VPDocOutlineItem :headers="children" />
      </template>
    </li>
  </ul>
</template>

<style scoped>
.root {
  position: relative;
  z-index: 1;
}

.nested {
  padding-right: 16px;
  padding-left: 16px;
}

.outline-link {
  display: block;
/* hacks-guide change start: wrap long text to newline */
  line-height: 20px;
  padding-bottom: 12px;
/* hacks-guide change end: wrap long text to newline */
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-2);
/* hacks-guide change start: wrap long text to newline */
  /* white-space: nowrap; */
/* hacks-guide change end: wrap long text to newline */
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.5s;
}

.outline-link:hover,
.outline-link.active {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.outline-link.nested {
  padding-left: 13px;
}
</style>
