<template>
	<view class="body" @touchstart="(e) => touchStart(e)" @touchmove="(e) => touchMove(e)" @touchend="touchEnd">
		<view class="body_title">
			{{g.exercise_tk_obj.name}}
			<view class="update_time">
				更新时间：2025-10-11
			</view>
		</view>
		<view class="fgx"></view>
		<view class="body_fenlei">{{g.exercise_tk_obj.name}}</view>
		<view class="body_exercise">{{g.exercise_tk_obj.name}}</view>



	</view>
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
	uni.setNavigationBarTitle({
		title: g.exercise_tk_obj.name
	})



	let swiper_data = ref([{
			name: "1",
			likestate: 0,
			anim: null
		},
		{
			name: "2",
			likestate: 0,
			anim: null
		},
		{
			name: "3",
			likestate: 0,
			anim: null
		},
	]);
	let startX = 0; // 滑动开始x轴的位置
	let startY = 0; // 滑动开始y轴的位置
	let moveX = 0; // 滑动X轴的位置
	let moveY = 0; // 滑动Y轴的位置

	const touchStart = (event) => {
		// console.log(event);
		startX = event.touches[0].pageX;
		startY = event.touches[0].pageY;
		// g.log(startX)
		// g.log(startY)
	};

	// 触摸开始滑动
	const touchMove = (event) => {
		// console.log(event);
		let currentX = event.touches[0].pageX;
		let currentY = event.touches[0].pageY;
		moveX = currentX - startX;
		moveY = currentY - startY;

	};
	// 触摸结束
	const touchEnd = (event) => {
		// console.log(moveX);
		if (moveX > 80) {
			g.log("返回上一级")
			uni.navigateBack({
				delta: 1 // delta=1 表示返回上一页（默认值，可省略）s
			});

		} else if (moveX < -80) {
			g.log("返回上一级")
			uni.navigateBack({
				delta: 1 // delta=1 表示返回上一页（默认值，可省略）s
			});
		}
		// console.log(moveY);
	};

	onShow(() => {


	})
</script>

<style>
	.body {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: #fff;
	}

	.body_title {
		margin-top: 80px;
		margin-left: 40px;
		font-size: 20px;
	}

	.update_time {
		margin-top: 5px;
		font-size: 12px;
		color: #666
	}

	.fgx {
		padding-top: 10px;
		border-bottom: 1px solid #777;

	}
</style>