<template>
  <view class="h">
    <!-- 添加点击事件和动态 class 绑定 -->
    <view
      v-for="(item, index) in tabs"
      :key="index"
      class="h_text"
      :class="{ select: selectedIndex === index }"
      @click="handleClick(index)"
    >
      {{ item }}
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 使用响应式数据记录选中状态

const selectedIndex = ref(-1)
// 定义标签数据
const tabs = ['基本', '发现', '搜索', '一级', '二级', 'lazy']

// 点击处理函数
selectedIndex.value = 0
const handleClick = (index) => {
  selectedIndex.value = index
}
const get_select_index = () => selectedIndex.value
defineExpose({ get_select_index })
</script>

<style>
.h {
  /* margin-top: 30px; */
  display: flex;
  flex-direction: row;
}

.h_text {
  padding: 5px 10px 5px 10px;
  font-size: 15px;
}

.select {
  border-bottom: 2px solid #ff0000;
  background-color: #ccc;
}
</style>
