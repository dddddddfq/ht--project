<template>
  <div>
    <div class="header">{{ title }}<svg t="1652869181525" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="2046" width="22" height="22">
        <path
          d="M509.92 795.84c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m-2.448-400.704h16a16 16 0 0 1 16 16v201.728a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V459.136a16 16 0 0 1 16-16z m0-100.176h16a16 16 0 0 1 16 16v23.648a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-23.648a16 16 0 0 1 16-16z"
          p-id="2047" fill="#cdcdcd"></path>
      </svg></div>
    <div class="cont"><span>{{ cont }}</span></div>
    <div class="chars">
      <slot name="chars"></slot>
    </div>
    <div class="footer">
      <slot name='footer'></slot>
    </div>

  </div>
</template>

<script>
export default {
  name: "",
  props: ['title', 'cont']
}
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #d9d9d9;
  line-height: 1.5;
}

.cont {
  font-size: 26px;
  font-weight: 400;
}

.footer {
  padding-top: 10px;
  font-size: 16px;
  ;
  border-top: 1px solid #eee;
}

.chars {
  width: 100%;
  font-size: 14px;
  height: 50px;
}
</style>