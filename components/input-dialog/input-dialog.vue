<template>
  <view class="dialog-mask" v-if="modelValue" @tap="close">
    <view class="dialog-content" @tap.stop>
      <view class="dialog-header">{{ title }}</view>
      <view class="dialog-body">
        <input 
          v-model="inputValue" 
          :placeholder="placeholder" 
          :type="inputType" 
          class="dialog-input"
          focus
        />
      </view>
      <view class="dialog-footer">
        <button @tap="cancel" class="cancel-btn">取消</button>
        <button @tap="confirm" class="confirm-btn">确定</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '请输入'
  },
  placeholder: {
    type: String,
    default: '请输入内容...'
  },
  inputType: {
    type: String,
    default: 'text'
  },
  defaultValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const inputValue = ref(props.defaultValue)

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    inputValue.value = props.defaultValue
  }
})

const close = () => {
  emit('update:modelValue', false)
}

const cancel = () => {
  close()
  emit('cancel')
}

const confirm = () => {
  emit('confirm', inputValue.value)
  close()
}
</script>

<style>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.dialog-content {
  background-color: #fff;
  width: 80%;
margin-bottom: 300px;
  border-radius: 10px;
  overflow: hidden;
}

.dialog-header {
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.dialog-body {
  padding: 20px;
}

.dialog-input {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 10px;
}

.dialog-footer {
	
  display: flex;
  border-top: 1px solid #eee;
}

.dialog-footer button {
  flex: 1;
  border-radius: 0;
  background: none;
  border: none;
  line-height: 44px;
}

.cancel-btn {
  color: #666;
}

.confirm-btn {
  color: #007aff;
  border-left: 1px solid #eee !important;
}
</style>