<!--
  Copyright (c) 2019-2024 Yuxi (Evan) You
  Copyright (c) 2024 Nintendo Homebrew

  SPDX-License-Identifier: MIT
-->

<script setup lang="ts">
import { useData } from 'vitepress'
import { useSidebar } from 'vitepress/theme'

const { theme, frontmatter } = useData()
const { hasSidebar } = useSidebar()
</script>

<template>
  <footer v-if="theme.footer && frontmatter.footer !== false" class="VPFooter" :class="{ 'has-sidebar': hasSidebar }">
    <div class="container">
<!-- hacks-guide change start: replace message with a list of links -->
<!--
      <p v-if="theme.footer.message" class="message" v-html="theme.footer.message"></p>
-->
      <li v-if="theme.footer.items" v-for="(item, index) in theme.footer.items">
        <ul><a class="message" v-bind:href="item.link">{{ item.text }}</a></ul>
        <ul v-if="index != theme.footer.items.length - 1"> - </ul>
      </li>
<!-- hacks-guide change end: replace message with a list of links -->
      <p v-if="theme.footer.copyright" class="copyright" v-html="theme.footer.copyright"></p>
    </div>
  </footer>
</template>

<style scoped>

/* hacks-guide change start: replace message with a list of links */
li {
  display: inline;
  list-style-type: none;
}

ul {
  display: inline;
  list-style-type: none;
}
/* hacks-guide change end: replace message with a list of links */

.VPFooter {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
}

.VPFooter.has-sidebar {
  display: none;
}

.VPFooter :deep(a) {
  text-decoration-line: underline;
  text-underline-offset: 2px;
  transition: color 0.25s;
}

.VPFooter :deep(a:hover) {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .VPFooter {
    padding: 32px;
  }
}

.container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  text-align: center;
}

.message,
.copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>
