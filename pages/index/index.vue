<template>
	<view class="container">
		<view class="content">
			<view class="btns" v-if="this_index ===0 ">
				<button size="default" @click="c_btn">远程导入题库</button>
				<input-dialog v-model="showDialog" title="远程导入题库" placeholder="请输入题库地址" @confirm="onInputConfirm"
					@cancel="onInputCancel" />
				<button>本地导入题库</button>
				<button>选择题库</button>

			</view>
		</view>
		<!-- ============以下勿动================= -->
		<!-- <view class="btn_click" @click="icon_click"> -->
		<view class="nav_bar" @click="icon_click">

			<view :class="c_zhuye">
				<A_input ref="zhuye" @click="btn_click(0)"></A_input>
			</view>
			<view :class="c_lianxi">
				<A_input ref="lianxi" @click="btn_click(1)"></A_input>
			</view>
			<view :class="c_cuoti">
				<A_input ref="cuoti" @click="btn_click(2)"></A_input>
			</view>
			<view :class="c_shoucang">
				<A_input ref="shoucang" @click="btn_click(3)"></A_input>
			</view>
		</view>
	</view>




</template>
<script setup>
	import {
		ref,
		reactive,
		nextTick
	} from 'vue'

	import InputDialog from '@/components/input-dialog/input-dialog.vue'
	import {
		onReady
	} from '@dcloudio/uni-app'
	import g from '@/common/global'
	const zhuye = ref(null)
	const lianxi = ref(null)
	const cuoti = ref(null)
	const shoucang = ref(null)

	const c_zhuye = ref("")
	const c_lianxi = ref("")
	const c_cuoti = ref("")
	const c_shoucang = ref("")

	const this_index = ref(0)

	//====缓存相关====

	g.MkdirAll(g.getCachePath() + "/../tiku")

	//======弹窗开始=====
	const showDialog = ref(false)
	const c_btn = () => {
		showDialog.value = true
	}
	const onInputConfirm = (value) => {
		console.log(value)
	}
	const onInputCancel = () => {
		console.log('用户点击了取消')
	}
	//======弹窗结束=====
	const btn_click = (index) => {
		this_index.value = index
		g.index = index
		console.log(g.index)
		c_zhuye.value = ""
		c_lianxi.value = ""
		c_cuoti.value = ""
		c_shoucang.value = ""
		switch (index) {
			case 0:
				c_zhuye.value = "select_btn"
				break;
			case 1:
				c_lianxi.value = "select_btn"
				break;
			case 2:
				c_cuoti.value = "select_btn"
				break;
			case 3:
				c_shoucang.value = "select_btn"
				break;

		}


	}



	// 直接使用 UniApp 的页面生命周期
	onReady(() => {
		console.log('页面渲染完成')
		zhuye.value.SetBtnText('主页');
		zhuye.value.SetClassString("icon-grid-view")
		lianxi.value.SetBtnText('练习');
		lianxi.value.SetClassString("icon-to-deliver")
		cuoti.value.SetBtnText('错题');
		cuoti.value.SetClassString("icon-close")
		shoucang.value.SetBtnText('收藏');
		shoucang.value.SetClassString("icon-save")
		// console.log(g.index)
		btn_click(g.index)
	})
</script>

<style>
	.container {
		/* 		position: fixed;
		display: flex;
		
		flex-direction: column; */

		/* 		width: 100%;
		max-width: 500px;
		margin: 0 auto;
		background-color: var(--card-bg);
		
		min-height: 10vh;
		position: relative;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
	}

	.btns {
		padding-top: 100px;
		/* position: fixed; */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* //调整间距 */
		gap: 30px
	}



	.nav_bar {
		position: fixed;
		/* 关键：保持固定定位 */
		bottom: 0;
		/* 关键：必须设置为0才能固定在底部 */
		left: 0;
		right: 0;
		display: flex;
		background: white;

		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		max-width: 400px;
		margin: 0 auto;
		/* border-top: 1px solid #f0f0f0; */
		justify-content: space-between;
		padding: 5px 10px 5px 10px;
		/* 左右添加内边距 */
		background-color: transparent;
	}

	.select_btn {
		border-bottom: 2px solid #ff0000;

		/* background-color: #eee; */

	}
</style>