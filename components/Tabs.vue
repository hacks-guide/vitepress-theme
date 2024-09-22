<!--
  Copyright (c) 2024 emiyl

  SPDX-License-Identifier: MIT
-->

<script>
export default {
    props: {
        id: { default: "tab" }
    }
};
</script>

<template>
	<div class="tab-container">
		<slot />
	</div>
</template>
