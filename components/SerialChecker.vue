<script setup>
import { ref, watch } from 'vue'

const prefix = ref('XAW1')
const digits = ref('')
const result = ref(null)

function checkSerial(s) {
  if (s.match(/^X[KJWT][JWCE]/)) return 'mariko'
  if (s.match(/^HA[JKWE]/)) return 'switch2'
  if (!s.match(/^XA[JKW9][1479]/)) return 'invalid'

  if (s.length >= 10 && s.length < 14) s = s.padEnd(14, 'X')
  if (s.length !== 14) return 'invalid'

  const region = s[2]
  const assemblyLine = parseInt(s[3])
  const checkingValue = parseInt(s.slice(3, 10))

  if (region === 'K') return 'maybe'
  if (region === '9') return 'maybe'

  if (region === 'J') {
    if (assemblyLine === 1) {
      if (checkingValue < 1002000) return 'unpatched'
      if (checkingValue < 1003000) return 'maybe'
      return 'patched'
    } else if (assemblyLine === 4) {
      if (checkingValue < 4004400) return 'unpatched'
      if (checkingValue < 4008300) return 'maybe'
      return 'patched'
    } else if (assemblyLine === 7) {
      if (checkingValue < 7004000) return 'unpatched'
      if (checkingValue < 7005000) return 'maybe'
      return 'patched'
    }
  }

  if (region === 'W') {
    if (assemblyLine === 1) {
      if (checkingValue < 1006500) return 'unpatched'
      if (checkingValue < 1012000) return 'maybe'
      return 'patched'
    } else if (assemblyLine === 4) {
      if (checkingValue < 4001100) return 'unpatched'
      if (checkingValue < 4001200) return 'maybe'
      return 'patched'
    } else if (assemblyLine === 7) {
      if (checkingValue < 7001750) return 'unpatched'
      if (checkingValue < 7003000) return 'maybe'
      return 'patched'
    } else if (assemblyLine === 9) {
      return 'maybe'
    }
  }

  return 'invalid'
}

const messages = {
  mariko:    { type: 'warning', text: 'This appears to be a <strong>Mariko (V2) Switch or Switch Lite</strong>. These are patched and not hackable via software, only via hardware modchip. Find trusted hardmodders <a href="https://nintendohomebrew.com/hardmodders">here</a>.' },
  switch2:   { type: 'danger',  text: 'This appears to be a <strong>Switch 2</strong>. These are currently not hackable.' },
  refurb:   { type: 'warning',  text: 'This prefix belongs to officially <strong>refurbished Switch</strong> consoles, it <strong>might be patched</strong>. The only way to know for sure is to manually push a payload. Continue to <a href="/user_guide/rcm/sending_payload.html">this page</a>.' },
  maybe:     { type: 'warning', text: 'This serial <strong>might be patched</strong>. The only way to know for sure is to manually push a payload. Continue to <a href="/user_guide/rcm/sending_payload.html">this page</a>.' },
  patched:   { type: 'danger',  text: 'This serial is <strong>patched</strong>. It is not hackable via software. Find trusted hardmodders <a href="https://nintendohomebrew.com/hardmodders">here</a>.' },
  unpatched: { type: 'tip',     text: 'This serial is <strong>not patched</strong>! Click the following link to continue with the <a href="rcm/index">RCM path</a> of the guide.' },
  invalid:   { type: 'danger',  text: 'This serial is <strong>invalid</strong>. Double-check you typed it correctly. At minimum, provide 6 digits after the prefix.' },
}

function redact(s) {
  if (s.length <= 9) return s
  return s.slice(0, 9) + 'XXXX'
}

watch([prefix, digits], () => {
  const d = digits.value.replace(/\D/g, '')
  const s = (prefix.value + d).toUpperCase()

  const earlyCheck = checkSerial(s.padEnd(14, 'X'))
  if (earlyCheck === 'mariko' || earlyCheck === 'switch2') {
    result.value = { key: earlyCheck, serial: prefix.value + '…', ...messages[earlyCheck] }
    return
  }

  if (prefix.value === 'XAW9') {
    result.value = { key: 'refurb', serial: prefix.value + '…', ...messages['refurb'] }
    return
  }

  if (prefix.value === 'XAK1') {
    result.value = { key: 'maybe', serial: prefix.value + '…', ...messages['maybe'] }
    return
  }

  if (d.length < 6) {
    result.value = null
    return
  }

  const key = checkSerial(s)
  result.value = { key, serial: redact(s), ...messages[key] }
})
</script>

<template>
  <div class="serial-checker">
    <div class="serial-input-row">
      <select v-model="prefix">
        <optgroup label="XAW (World/Global)">
          <option>XAW1</option>
          <option>XAW4</option>
          <option>XAW7</option>
          <option>XAW9</option>
        </optgroup>
        <optgroup label="XAJ (Japan)">
          <option>XAJ1</option>
          <option>XAJ4</option>
          <option>XAJ7</option>
        </optgroup>
        <optgroup label="XAK (Korea)">
          <option>XAK1</option>
        </optgroup>
        <optgroup label="Mariko (not hackable via software)">
          <option>XKW1</option>
          <option>XKJ1</option>
          <option>XJW0</option>
          <option>XWW0</option>
        </optgroup>
        <optgroup label="Switch 2 (not hackable)">
          <option>HAE1</option>
          <option>HAJ1</option>
          <option>HAK1</option>
          <option>HAW1</option>
        </optgroup>
      </select>
      <input
        v-model="digits"
        type="text"
        placeholder="0000000000"
        maxlength="10"
        inputmode="numeric"
      />
    </div>
    <p class="serial-hint">Select your Switch serial number prefix from the dropdown menu, then enter the digits that follow. You only need the first 6 digits.</p>

    <div v-if="result" :class="['serial-result', result.type]">
      <strong>{{ result.serial }}</strong> —
      <span v-html="result.text" />
    </div>
  </div>
</template>

<style scoped>
.serial-checker {
  margin: 0.75rem 0;
}
.serial-input-row {
  display: flex;
  gap: 0.5rem;
}
.serial-input-row select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-family: monospace;
  cursor: pointer;
}
.serial-input-row input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-family: monospace;
  box-sizing: border-box;
}
.serial-hint {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.serial-result {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border-left: 4px solid;
}
.serial-result.tip {
  background: rgba(0, 180, 0, 0.1);
  border-color: #00b400;
  color: var(--vp-c-text-1);
}
.serial-result.warning {
  background: var(--vp-custom-block-warning-bg);
  border-color: var(--vp-custom-block-warning-border);
  color: var(--vp-custom-block-warning-text);
}
.serial-result.danger {
  background: var(--vp-custom-block-danger-bg);
  border-color: var(--vp-custom-block-danger-border);
  color: var(--vp-custom-block-danger-text);
}
</style>
