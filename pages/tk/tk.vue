<template>
	<!-- <view class="tks_content"> -->
	<!-- <scroll-view scroll-y="true" class="scroll-container"> -->
	<!-- 这里放需要滚动的内容 -->
	<A_item v-for="item in tk_items" :key="item.id" :item="item" class="item"
		:class="{ active: body1_activeId === item.id }" :value="item.value" @click="itemClick">
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
	const tk_items = ref([])
	const body1_activeId = ref(null);

	const get_tk = () => {
		tk_items.value = []
		g.get_tks_path(g.pulic_tiku_dir).then(result => {
			// g.ShowText(JSON.stringify(result[0]));
			// g.ShowText(result.length)
			// tk_items.value=result/
			for (let i = 0; i < result.length; i++) {
				// g.ShowText(JSON.stringify(result[i]))
				let obj = {
					"name": result[i].name.replace('.json', ''),
					"value": result[i].fullPath,
					"id": i
				}
				tk_items.value.push(obj)
			}
		});

	}
	const itemClick = (item) => {
		g.log(item)
	}




	get_tk()
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