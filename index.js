/*
  Copyright (C) 2024 Nintendo Homebrew
  SPDX-License-Identifier: MIT
*/

import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
    })
  }
}
