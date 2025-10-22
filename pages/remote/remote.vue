<template>
	  <view class="container">
	    <!-- 循环渲染A_item组件 -->
	    <A_item 
	      v-for="item in list" 
	      :key="item.id" 
	      :item="item" 
		  @click="click_item"
	      @delete="click_delete_item"
	    >
	      <!-- 插槽自定义内容（这里展示item.name，可根据需求修改） -->
	      {{ item.name }}
	    </A_item>
	  </view>
	<!-- <A_bottom class="g_bottom" ref="ref_bottom"></A_bottom> -->
</template>

<script setup>
import {
		ref
	} from 'vue'
	
	import g from '@/common/global'


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
const click_item=(item)=>{
	  console.log('当前项的 key 是：', item.id); // 打印 key
	
}
const click_delete_item=(item)=>{
	 console.log('当前项的 key 是：', item.id); // 打印 key
}
</script>

<style scoped>
	
</style>