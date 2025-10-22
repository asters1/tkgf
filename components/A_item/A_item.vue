<template>
  <view class="swipe-item" 
    @touchstart="(e) => touchStart(e)"
    @touchmove="(e) => touchMove(e)" 
    @touchend="touchEnd">
    <!-- 内容区（通过插槽让父组件自定义内容） -->
    <view class="content" :style="{ transform: `translateX(${offsetX}px)` }" @click.stop="handleClick">
      <slot :item="item"></slot>
    </view >

    <!-- 删除按钮 -->
    <view class="delete-btn" @click.stop="handleDelete">
      删除
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 接收父组件传入的单个数据项
const props = defineProps({
  item: {
    type: Object,
    required: true,
    description: '列表项数据（需包含id等唯一标识）'
  },
  deleteWidth: {
    type: Number,
    default: 120,
    description: '删除按钮宽度'
  }
});

// 暴露删除事件给父组件
const emit = defineEmits(['delete','click']);

// 滑动状态管理（组件内部维护，不依赖外部数据）
const offsetX = ref(0); // 内容区偏移量
const startX = ref(0); // 触摸起始X坐标

// 触摸开始
const touchStart = (e) => {
  startX.value = e.touches[0].clientX;
};

// 触摸移动
const touchMove = (e) => {
  const currentX = e.touches[0].clientX;
  let moveOffset = currentX - startX.value; // 左滑为负值

  // 限制滑动范围（不超过删除按钮宽度，且不能右滑）
  if (moveOffset < -props.deleteWidth) moveOffset = -props.deleteWidth;
  if (moveOffset > 0) moveOffset = 0;

  offsetX.value = moveOffset;
};

// 触摸结束（判断展开/关闭）
const touchEnd = () => {
  if (offsetX.value < -props.deleteWidth / 2) {
    offsetX.value = -props.deleteWidth; // 展开删除按钮
  } else {
    offsetX.value = 0; // 关闭删除按钮
  }
};

// 处理删除（通知父组件执行删除逻辑）
const handleDelete = () => {
  emit('delete', props.item); // 传递当前项数据给父组件
  offsetX.value = 0; // 重置滑动状态
};
const handleClick=()=>{
	 emit('click', props.item)
	
}
</script>

<style scoped>
.swipe-item {
  position: relative;
  height: 50px;
  margin-bottom: 10px;
  overflow: hidden;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  background-color: #fff;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  z-index: 1;
  box-sizing: border-box; /* 确保padding不影响宽度 */
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 100%; /* 占满父元素高度 */
  background-color: #FF3B30;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  padding: 0;
  margin: 0;
  font-size: 14px;
  line-height: 1;
}
</style>