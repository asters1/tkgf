<template>
	<!-- <view class="tks_content"> -->
	<!-- <scroll-view scroll-y="true" class="scroll-container"> -->
	<!-- 这里放需要滚动的内容 -->
	<A_item v-for="item in tk_items" :key="item.id" :item="item" class="item"
		:class="{ active: body1_activeId === item.id }" :value="item.value" @click="itemClick" @delete="delete_item">
		{{ item.name }}

	</A_item>
	<!-- </scroll-view> -->
	<view class="content1">





		<view style="padding: 100px;"></view>



	</view><!-- </view> -->



</template>

<script setup>
	import {
		ref
	} from 'vue'

	import g from '@/common/global'
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'


	const tk_items = ref([])
	const body1_activeId = ref(null);
	const isnotfrist = ref(false)

	const get_tk = () => {
		tk_items.value = []
		let result = g.get_tks_path(g.pulic_tiku_dir)

		for (let i = 0; i < result.length; i++) {
			let obj = {
				"name": result[i].name.replace('.json', ''),
				"value": result[i].fullPath,
				"id": i
			}
			tk_items.value.push(obj)
		}


	}
	const itemClick = (item) => {
		g.log("点击了题库")
		g.log(item)
	}
	const delete_item = (item) => {
		g.log("点击了删除")
		g.log(item)
		tk_items.value.splice(item.id, 1)
		g.delete_file(item.value)

	}
	//页面展示时加载
	onShow(() => {
		g.log("题库页面加载~")
		get_tk()

	})
</script>

<style>
	/* @import "../../static/gobal.css"; */

	.content {
		width: 99%;
	}

	.scroll-container {


		height: 650px;
		/* 必须设置固定高度，否则无法滚动 */
		border: 1px solid #eee;
		scrollbar-width: none;
		width: 99%;
		overflow-x: hidden;

	}

	.item {
		width: 99%;

		border-bottom: 1px solid #ddd;
	}
</style>