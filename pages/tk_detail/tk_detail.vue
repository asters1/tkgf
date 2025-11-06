<template>
	<view class="body" @touchstart="(e) => touchStart(e)" @touchmove="(e) => touchMove(e)" @touchend="touchEnd">
		<view class="body_title">
			{{g.exercise_tk_obj.name}}
			<view class="update_time">
				更新时间：{{ref_update_time}}
			</view>
		</view>
		<view class="fgx"></view>
		<view class="body_fenlei">
			<view class="class_icon" @click="">
				<text class="icon-guanbi icon_sym"></text>
				<text class="text">我的错题</text>
			</view>
			<view class="class_icon" @click="">
				<text class="icon-shoucang icon_sym"></text>
				<text class="text">我的收藏</text>
			</view>
			<view class="class_icon" @click="">
				<text class="icon-a-009-knife icon_sym"></text>
				<text class="text">我的斩题</text>
			</view>
			<view class="class_icon" @click="">
				<text class="icon-dengji icon_sym"></text>
				<text class="text">我的笔记</text>
			</view>

		</view>
		<view class="body_exercise">
			<view class="lianxi">练习模式</view>
			<view class="zu">
				<view class="lianxi_btn" @click="lianxi_btn(0)">
					<view class="text1">
						<text>顺序练习</text>
						<text class="remark">{{exercise_index+1}}/{{exercise_total}}</text>
					</view>
					<text class="icon-shuzishunxu icon_sym_btn"></text>

				</view>
				<view class="lianxi_btn" @click="lianxi_btn(1)">
					<view class="text1">
						<text>随机练习</text>
						<text class="remark">无尽随机...</text>
					</view>
					<text class="icon-suiji icon_sym_btn"></text>

				</view>
			</view>
			<view class="zu">
				<view class="lianxi_btn" @click="lianxi_btn(2)">
					<view class="text1">
						<text>错题练习</text>
						<text class="remark">1/299</text>
					</view>
					<text class="icon-cuotiben icon_sym_btn"></text>

				</view>
				<view class="lianxi_btn" @click="lianxi_btn(3)">
					<view class="text1">
						<text>收藏练习</text>
						<text class="remark">1/299</text>
					</view>
					<text class="icon-shoucangben icon_sym_btn"></text>

				</view>
			</view>
			<view class="zu">
				<view class="lianxi_btn" @click="lianxi_btn(4)">
					<view class="text1">
						<text>题型练习</text>
						<text class="remark">1/299</text>
					</view>
					<text class="icon-ic_tixing_tikuxuanti icon_sym_btn"></text>

				</view>
				<view class="lianxi_btn" @click="lianxi_btn(5)">
					<view class="text1">
						<text>模拟考试</text>
						<text class="remark">1/299</text>
					</view>
					<text class="icon-kaoshi icon_sym_btn"></text>

				</view>
			</view>


		</view>



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
	const ref_update_time = ref("")

	const exercise_total = ref(0)
	const exercise_index = ref(0)
	// const class_icon_tk = ref("icon_sym icon-fenlei")
	// const class_text_tk = ref("text")




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
				delta: 1 // delta=1 表示返回上一页（默认值，可省略）
			});

		} else if (moveX < -80) {
			g.log("返回上一级")
			uni.navigateBack({
				delta: 1 // delta=1 表示返回上一页（默认值，可省略）
			});
		}
		// console.log(moveY);
	};
	const lianxi_btn = (index) => {

		switch (index) {
			case 0:
				g.log("顺序练习")
				g.log(g.exercise_tk_obj.value)
				uni.navigateTo({
					url: '/pages/exercise/exercise'
				});
				break;
			case 1:
				g.log("随机练习")
				uni.navigateTo({
					url: '/pages/exercise/exercise'
				});
				break;
			case 2:
				g.log("错题练习")
				break;
			case 3:
				g.log("收藏练习")
				break;
			case 4:
				g.log("题型练习")
				break;
			case 5:
				g.log("模拟考试")
				break;
			default:
				break;
		}

	}

	//===========程序开始============
	g.log(g.exercise_tk_obj)
	// let result = g.getFileModifyTime(g.exercise_tk_obj.value)
	ref_update_time.value = g.getFileModifyTime(g.exercise_tk_obj.value)
	g.MkdirAll(g.getTkDataDir() + "/" + g.exercise_tk_obj.name)
	//判断题库是否存在
	if (!g.file_exists(g.getTkDataDir() + "/" + g.exercise_tk_obj.name + "/" + g.exercise_tk_obj.name + ".json")) {
		g.cp_file(g.exercise_tk_obj.value, g.getTkDataDir() + "/" + g.exercise_tk_obj.name)
	}
	//判断tkgf.continue是否存在
	if (g.file_exists(g.getTkDataDir() + "/" + g.exercise_tk_obj.name + "/tkgf.continue")) {
		try {
			g.async_R_file(g.getTkDataDir() + "/" + g.exercise_tk_obj.name + "/tkgf.continue").then((res) => {
				let tkgf_continue = JSON.parse(res)
				exercise_total.value = tkgf_continue.exercise_total
				exercise_index.value = tkgf_continue.exercise_index
				g.exercise_index = tkgf_continue.exercise_index
				g.exercise_tk_obj.value = g.getTkDataDir() + "/" + g.exercise_tk_obj.name + "/" + g.exercise_tk_obj
					.name + ".json"
			})
		} catch (e) {
			g.log(e.message)
			g.ShowText("解析tkgf.continue失败！！")
		}
	} else {
		g.async_R_file(g.getTkDataDir() + "/" + g.exercise_tk_obj.name + "/" + g.exercise_tk_obj.name + ".json").then((
			res) => {
			try {
				g.tk_obj = JSON.parse(res)
				exercise_total.value = g.tk_obj.length
				exercise_index.value = g.exercise_index
				let tkgf_continue = {}
				tkgf_continue.exercise_total = g.tk_obj.length
				tkgf_continue.exercise_index = g.exercise_index
				// console.log(g.file_exists(g.getTkDataDir() + "/" + g.exercise_tk_obj.name + "/tkgf.continue"))
				g.async_W_file(g.getTkDataDir() + "/" + g.exercise_tk_obj.name + "/tkgf.continue",
					JSON.stringify(tkgf_continue))

			} catch (e) {
				g.log(e.message)
				g.ShowText("解析题库失败！！")
			}
		})
	}

	onShow(() => {
		g.log(exercise_index.value)
		g.log(g.exercise_index)
		exercise_index.value = g.exercise_index
	})
</script>

<style>
	@import "../../static/icon1.css";
	/* @import "../../static/gobal.css"; */

	.body {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: #fff;
	}

	.icon_sym {
		display: inline-block;
		width: 25px;
		height: 25px;
		color: red;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
		/* margin-left: 20px; */
		/* padding: 40px; */
	}

	.icon_sym_btn {
		display: inline-block;
		width: 30px;
		height: 30px;
		color: red;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
		/* margin-left: 20px; */
		/* padding: 40px; */
	}

	.text {
		padding-top: 5px;
		font-size: 14px;

	}

	.class_icon {

		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		color: #666;
		text-decoration: none;
		font-size: 20px;
		padding: 8px 0;
		transition: all 0.2s;
		/* border-top: 1px solid #777; */
	}

	.lianxi {
		margin-top: 20px;
		margin-left: 20px;
		margin-bottom: 20px;
		font-size: 20px;

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

	.body_fenlei {
		display: flex;
		margin-top: 15px;
	}

	.text1 {
		display: flex;
		flex-direction: column;

	}

	.lianxi_btn {
		padding: 5px 5px 5px 10px;
		/* padding-left: 20px;
		padding-right: 20px; */
		background-color: #eee;
		display: flex;
		/* 关键：两端对齐，中间元素自动分配空间 */
		justify-content: space-between;
		border-radius: 8px;
		flex: 1;
		/* 水平内容居中 */
		/* 	  justify-content: center; */
		/* 垂直内容居中 */
		align-items: center;
		margin-right: 10px;
	}


	.remark {
		margin-top: 10px;
		color: #777;
	}

	.zu {
		display: flex;
		justify-content: space-between;

		margin: 10px 15px;

	}
</style>