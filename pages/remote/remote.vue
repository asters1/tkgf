<template>
	<view class="container">
		<view v-for="(item, index) in list" :key="item.id" class="swipe-item" @touchstart="(e) => touchStart(e, index)"
			@touchmove="(e) => touchMove(e, index)" @touchend="() => touchEnd(index)">
			<!-- 内容区 -->
			<view class="content" :style="{ transform: `translateX(${item.offsetX}px)` }">
				{{ item.name }}
			</view>

			<!-- 删除按钮 -->
			<view class="delete-btn" @click.stop="deleteItem(index)">
				&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp删除
			</view>
		</view>
	</view>
	<A_bottom class="g_bottom" ref="ref_bottom"></A_bottom>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	// 列表数据（包含滑动相关状态）
	const list = ref([{
			id: 1,
			name: '项目 1',
			offsetX: 0,
			startX: 0
		},
		{
			id: 2,
			name: '项目 2',
			offsetX: 0,
			startX: 0
		},
		{
			id: 3,
			name: '项目 3',
			offsetX: 0,
			startX: 0
		}
	]);

	const deleteWidth = 120; // 删除按钮宽度

	// 触摸开始
	const touchStart = (e, index) => {
		list.value[index].startX = e.touches[0].clientX;
	};

	// 触摸移动
	const touchMove = (e, index) => {
		const currentX = e.touches[0].clientX;
		const startX = list.value[index].startX;
		let offsetX = currentX - startX; // 左滑为负值

		// 限制滑动范围
		if (offsetX < -deleteWidth) offsetX = -deleteWidth;
		if (offsetX > 0) offsetX = 0;

		list.value[index].offsetX = offsetX;
	};

	// 触摸结束（判断是否展开/关闭）
	const touchEnd = (index) => {
		const offsetX = list.value[index].offsetX;
		if (offsetX < -deleteWidth / 2) {
			list.value[index].offsetX = -deleteWidth; // 展开
		} else {
			list.value[index].offsetX = 0; // 关闭
		}
	};

	// 删除项
	const deleteItem = (index) => {
		list.value.splice(index, 1);
	};
</script>

<style scoped>
	.container {
		padding: 5px;
	}

	.swipe-item {
		position: relative;
		height: 50px;
		margin-bottom: 10px;
		overflow: hidden;
		/* border-radius: 8px; */
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
	}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 100%;
  background-color: #FF3B30;
  color: white;
  /* 确保文字水平和垂直居中 */
  display: flex;
  align-items: center; /* 垂直居中 */
  /* 水平居中 */ 
 justify-content: center;
 
  z-index: 0;
  /* 补充：去除默认内边距和字体样式影响 */
  padding: 0;
  margin: 0;
  font-size: 14px; /* 可根据需要调整字体大小 */
  line-height: 1; /* 避免行高影响垂直居中 */
}
</style>