<template>
	<view class="head1">
		<!-- 自定义标题栏：添加固定定位后会始终在顶部 -->
		<view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
			<!-- 左侧返回按钮 -->
			<view class="nav-left" @click="handleBack">
				<text class="icon-fanhui1 icon_sym"></text>
			</view>

			<!-- 中间标题 -->
			<view class="nav-center">
				<view :class="['pulic_text',{'select_text':select_index===0}]" @click="select_modle(0)">答题</view>
				<view :class="['pulic_text',{'select_text':select_index===1}]" @click="select_modle(1)">背题</view>
			</view>

			<!-- 右侧操作区 -->
			<view class="nav-right" @click="handleRightClick">
				<text class="icon-wodeyizhan icon_sym_zhanti"></text>
			</view>
		</view>

		//页面主体
		<view class="body" @touchstart="(e) => touchStart(e)" @touchmove="(e) => touchMove(e)" @touchend="touchEnd">
			<view>
				<text :class="{'timu_type_icon':load_tk}">
					{{timu_type_icon_text}}
				</text>
				<text class="timu">
					{{timu_text}}
				</text>
			</view>
			<!-- ✓✕ -->
			<view v-if="timu_obj.qtype==='2'">
				<view v-for="(item, index) in timu_obj.options" :key="item" class="options" :value="item.value"
					@click="itemClick(index)">

					<view class="option_any_icon"
						:class="{ select_item_icon:answer_list.includes(item.Key),option_any_icon_false:item.Key==='✕',option_any_icon_true:item.Key==='✓'}">
						{{item.Key}}

					</view>
					<view class="option_any_text"
						:class="{ select_item_text:answer_list.includes(item.Key),option_any_text_false:item.Key==='✕',option_any_text_true:item.Key==='✓'}">
						{{item.Value}}
					</view>

				</view>
			</view>
			<view v-else>
				<view v-for="(item, index) in timu_obj.options" :key="item" class="options" :value="item.value"
					@click="itemClick(index)">

					<view class="option_one_icon"
						:class="{ select_item_icon: body1_activeId ===index && not_click,option_one_icon_false:item.Key==='✕',option_one_icon_true:item.Key==='✓'}">
						{{item.Key}}

					</view>
					<view class="option_one_text"
						:class="{ select_item_text: body1_activeId ===index && not_click ,option_one_text_false:item.Key==='✕',option_one_text_true:item.Key==='✓'}">
						{{item.Value}}
					</view>

				</view>
			</view>
			<view class="btns">
				<view class="btn" @click="last_tk">上一题</view>
				<view class="btn" @click="submit_answer">提交答案</view>
				<view class="btn" @click="next_tk">下一题</view>
			</view>

		</view>
	</view>
</template>

<script setup>
	// 脚本部分无需修改，保持原样
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		ref
	} from 'vue'
	import g from '@/common/global'

	const statusBarHeight = ref(0)
	const select_index = ref(0)
	const timu_type_icon_text = ref("")
	const timu_text = ref("")
	const tk_obj = ref({})
	const load_tk = ref(false)
	const timu_obj = ref([])
	const body1_activeId = ref(null);
	// const option_one_icon_text=

	const auto_next_switch = ref(true)
	const not_click = ref(false)
	const answer_list = ref([])
	const not_submit = ref(true)


	onLoad(() => {
		const systemInfo = uni.getSystemInfoSync()
		statusBarHeight.value = systemInfo.statusBarHeight
	})



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
		if (moveX > 60) {
			g.log("上一题")
			moveX = 0
			last_tk()
		} else if (moveX < -60) {

			g.log("下一题")
			moveX = 0

			next_tk()
		}
		// console.log(moveY);
	};




	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	const handleBack = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const handleRightClick = () => {
		uni.showToast({
			title: '点击了右侧按钮',
			icon: 'none'
		})
	}
	const last_tk = () => {
		g.exercise_index = g.exercise_index - 1
		// g.log(g.exercise_index)
		if (g.exercise_index < 0) {
			g.exercise_index = 0
			g.ShowText("已经是第一题了~")
		} else {
			not_submit.value = true
			answer_list.value = []
			body1_activeId.value = -1
			g.log(tk_obj.value[g.exercise_index])
			update_data(tk_obj.value[g.exercise_index])
			not_click.value = false
		}

	}
	const next_tk = () => {

		g.log("下一题")
		g.exercise_index = g.exercise_index + 1
		// g.log(g.exercise_index)
		if (g.exercise_index == tk_obj.value.length) {
			g.exercise_index = g.exercise_index - 1
			g.ShowText("已经是最后一题了~")
		} else {
			not_submit.value = true
			body1_activeId.value = -1
			answer_list.value = []
			update_data(tk_obj.value[g.exercise_index])
			not_click.value = false

		}

		update_data(tk_obj.value[g.exercise_index])
		not_click.value = false


	}
	const check_answer = () => {
		let your_answer = answer_list.value.join("")
		let tiku_answer = timu_obj.value.answer
		if (your_answer === tiku_answer) {
			g.log("答案正确")
			g.log("你的答案" + your_answer)
			g.log("标准答案" + tiku_answer)
			return true
		} else {
			g.log("答案错误")
			g.log("你的答案" + your_answer)
			g.log("标准答案" + tiku_answer)
			return false
		}

	}
	const submit_answer = () => {


		if (not_submit.value) {


			g.log(timu_obj.value)
			if (answer_list.value == []) {

			} else {
				for (var i = 0; i < timu_obj.value.options.length; i++) {
					if (timu_obj.value.answer.includes(timu_obj.value.options[i].Key)) {
						timu_obj.value.options[i].Key = "✓"
					}
				}
				for (var i = 0; i < timu_obj.value.options.length; i++) {
					for (var j = 0; j < answer_list.value.length; j++) {
						g.log(answer_list.value[j])
						g.log(timu_obj.value.options[i])
						if (answer_list.value[j] == timu_obj.value.options[i].Key) {
							timu_obj.value.options[i].Key = "✕"
						}
					}
				}
				g.log(timu_obj.value)
			}
		}
		not_submit.value = false
		// check_answer()
	}
	const select_modle = (index) => {
		select_index.value = index
	}
	const update_data = (t_obj) => {
		let t_obj_str = JSON.stringify(t_obj)
		const tt_obj = JSON.parse(t_obj_str)
		if (tt_obj.qtype === "1") {
			load_tk.value = true
			timu_type_icon_text.value = "单选"
			timu_obj.value = tt_obj
		} else if (tt_obj.qtype === "2") {
			load_tk.value = true
			timu_type_icon_text.value = "多选"
			timu_obj.value = tt_obj
		} else if (tt_obj.qtype === "3") {
			load_tk.value = true
			timu_type_icon_text.value = "判断"
			timu_obj.value = tt_obj
		} else if (tt_obj.qtype === "4") {
			load_tk.value = true
			timu_type_icon_text.value = "填空"
			timu_obj.value = []
		} else if (tt_obj.qtype === "5") {
			load_tk.value = true
			timu_type_icon_text.value = "简答"
			timu_obj.value = []

		} else {
			load_tk.value = false
		}

		timu_text.value = t_obj.question

	}
	//=========================
	try {
		g.async_R_file(g.exercise_tk_obj.value).then((result) => {
			tk_obj.value = JSON.parse(result)
			update_data(tk_obj.value[g.exercise_index])
		})
	} catch (e) {
		g.log("练习页面，解析[" + g.exercise_tk_obj.value + "]失败")
	}
	const toggleStringItem = (strArr, str) => {
		const isExisted = strArr.includes(str);
		// 第一步：执行添加/删除操作，得到临时数组
		const tempArr = isExisted ?
			strArr.filter(item => item !== str) // 存在则删除
			:
			[...strArr, str]; // 不存在则添加

		// 第二步：对临时数组按 A-Z 升序排序（不区分大小写）
		const sortedArr = tempArr.sort((a, b) => {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		});

		return sortedArr;
	};
	const itemClick = async (id) => {
		if (not_submit.value) {


			if (timu_obj.value.qtype == "2") {
				answer_list.value = toggleStringItem(answer_list.value, timu_obj.value.options[id].Key)


			} else {
				answer_list.value = []
				answer_list.value.push(timu_obj.value.options[id].Key)
			}


			not_click.value = true
			body1_activeId.value = id
			if (timu_obj.value.options[id].Key === timu_obj.value.answer) {

				if (auto_next_switch.value && check_answer()) {
					await sleep(500)
					g.exercise_index = g.exercise_index + 1
					// g.log(g.exercise_index)
					if (g.exercise_index == tk_obj.value.length) {
						g.exercise_index = g.exercise_index - 1
						g.ShowText("已经是最后一题了~")
					} else {
						not_submit.value = true
						body1_activeId.value = -1
						answer_list.value = []
						update_data(tk_obj.value[g.exercise_index])
						not_click.value = false

					}

					update_data(tk_obj.value[g.exercise_index])
					not_click.value = false

				}

			}

		}
	}
	// onshow
</script>

<style scoped>
	@import "../../static/icon.css";

	.icon_sym {
		display: inline-block;
		width: 20px;
		height: 20px;
		color: red;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
	}

	.icon_sym_zhanti {
		display: inline-block;
		width: 27px;
		height: 27px;
		color: red;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
	}

	/* 页面容器：无需额外样式，让内容自然滚动 */
	.head1 {
		min-height: 100vh;
	}

	/* 核心修改：给标题栏添加固定定位，使其不随滚动移动 */
	.custom-nav {
		position: fixed;
		/* 固定在页面顶部 */
		top: 0;
		/* 距离顶部0距离 */
		left: 0;
		/* 距离左侧0距离 */
		right: 0;
		/* 距离右侧0距离，实现全屏宽度 */
		z-index: 999;
		/* 提高层级，避免被其他内容遮挡 */
		display: flex;
		align-items: center;
		height: 64px;
		/* 标题栏主体高度（不含状态栏） */
		background-color: #f8f8f8;
		border-bottom: 1px solid #eee;
		justify-content: space-between;
	}

	/* 左侧返回按钮区域：保持原样 */
	.nav-left {
		width: 60px;
		height: 100%;
		display: flex;
		align-items: center;
		font-size: 20px;
		color: #333;
		margin-left: 20px;
	}

	/* 中间标题区域：保持原样 */
	.nav-center {
		display: flex;
		text-align: center;
		font-size: 16px;
		font-weight: 500;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border: 1px solid #777;
		border-radius: 4px;
		margin: 5px;
	}

	/* 右侧操作区域：保持原样 */
	.nav-right {
		width: 60px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #007aff;
	}

	/* 核心修改：页面内容必须加上标题栏总高度的上边距 */
	.body {
		/* 状态栏高度 + 标题栏主体高度（64px），避免内容被标题栏遮挡 */
		padding-top: calc(var(--status-bar-height) + 80px);
		margin: 0px 20px;
		height: 1000px;
		/* 可保留用于测试滚动 */
		display: flex;
		flex-direction: column;

	}

	.pulic_text {
		padding: 5px;
	}

	.select_text {
		background-color: #000;
		color: #fff;
	}

	.timu_type_icon {
		display: inline-block;
		background-color: #007aff;
		color: #fff;
		margin-right: 10px;
		padding: 5px;
	}

	.timu {
		line-height: 1.5;
		font-size: 18px;
	}

	.option_one_icon {
		margin: 0 10px;
		font-size: 20px;
		display: flex;
		width: 20px;
		height: 20px;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 50%;
		align-items: center;
		justify-content: center;
		/* background-color: #007aff; */
	}

	.option_one_text {
		line-height: 1.5;
		font-size: 18px;
	}

	.options {
		display: flex;
		align-items: center;
		margin-top: 20px;
	}

	.select_item_icon {
		border: 1px solid #fff;
		background-color: #04c292;
		color: #fff;
	}

	.select_item_text {
		color: #04c292;
	}

	.option_any_icon {
		margin: 0 10px;
		font-size: 20px;
		display: flex;
		width: 20px;
		height: 20px;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
		align-items: center;
		justify-content: center;
		/* background-color: #007aff; */
	}


	.option_one_icon_true {
		border: 1px solid #fff;
		background-color: #04c292;
		color: #fff;
	}



	.option_one_text_true {
		color: #04c292;
	}



	.option_any_icon_true {
		border: 1px solid #fff;
		background-color: #04c292;
		color: #fff;
	}


	.option_any_text_true {
		color: #04c292;
	}

	.option_any_text_false {
		color: #ff5b59;
	}

	.option_any_icon_false {
		border: 1px solid #fff;
		background-color: #ff5b59;
		color: #fff;
	}

	.option_one_text_false {
		color: #ff5b59;
	}

	.option_one_icon_false {
		border: 1px solid #fff;
		background-color: #ff5b59;
		color: #fff;
	}

	.btns {
		display: flex;
		justify-content: space-between;
		margin-top: 50px;
	}

	.btn {
		padding: 10px;
		border: 1px solid #eee;
		border-radius: 10px;
		background-color: #04c292;
		color: #fff;
	}
</style>