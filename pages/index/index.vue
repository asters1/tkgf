<template>
	<view class="container">
		<view class="content">
			<view class="body1" v-if="this_index ===0 ">
				<view class="body1_head">
					<text class="item_body1_head icon_sym icon-icon-download2" @click="c_download"></text>
					<text class="item_body1_head icon_sym icon-folder" @click="c_download"></text>
					<input-dialog v-model="showDialog" title="远程导入题库" placeholder="请输入题库地址" @confirm="onInputConfirm"
						@cancel="onInputCancel" />
					<!-- <text>aaaa</text> -->
				</view>
				<view class="fgx"></view>

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
	g.CacheDir = g.getCachePath() + "/../tiku"
	g.MkdirAll(g.CacheDir)

	// g.downloadFile("https://gitee.com/asters1/tkgf/raw/master/tk/tk.json")

	//======弹窗开始=====
	const showDialog = ref(false)
	const c_download = () => {
		showDialog.value = true
	}
	const onInputConfirm = (value) => {
		g.downloadFile(value)

	}
	const onInputCancel = () => {
		console.log('用户点击了取消')
	}
	//点击按钮查看题库
	const c_select_tk = () => {
		g.get_tks_path(g.CacheDir).then(files => {
				console.log('找到的JSON文件:', JSON.stringify(files));
				for (const f of files) {
					console.log(f.fullPath)
				}
			})
			.catch(err => {
				g.ShowText('获取文件列表失败:' + err);
			});
	}
	//======弹窗结束=====
	const head_btn_click = (index) => {
		c_download.value = "icon_sym icon-icon-download2"
		c_download.value = "icon_sym icon-icon-download2-copy"

	}
	const btn_click = (index) => {
		this_index.value = index
		g.index = index
		// console.log(g.index)
		c_zhuye.value = ""
		c_lianxi.value = ""
		c_cuoti.value = ""
		c_shoucang.value = ""

		zhuye.value.SetClassString("icon-icon-menu")
		lianxi.value.SetClassString("icon-icon-edit2")
		cuoti.value.SetClassString("icon-icon-error")
		shoucang.value.SetClassString("icon-icon-star")

		zhuye.value.SetTextClass("")
		lianxi.value.SetTextClass("")
		cuoti.value.SetTextClass("")
		shoucang.value.SetTextClass("")
		switch (index) {
			case 0:
				c_zhuye.value = "select_btn"
				zhuye.value.SetClassString("icon-icon-menu-copy")
				zhuye.value.SetTextClass("select_text")
				break;
			case 1:
				lianxi.value.SetClassString("icon-icon-edit2-copy")
				c_lianxi.value = "select_btn"
				lianxi.value.SetTextClass("select_text")
				break;
			case 2:
				cuoti.value.SetClassString("icon-icon-error-copy")
				c_cuoti.value = "select_btn"
				cuoti.value.SetTextClass("select_text")
				break;
			case 3:
				shoucang.value.SetClassString("icon-icon-star-copy")
				c_shoucang.value = "select_btn"
				shoucang.value.SetTextClass("select_text")
				break;

		}


	}



	// 直接使用 UniApp 的页面生命周期
	onReady(() => {
		console.log('页面渲染完成')
		zhuye.value.SetBtnText('主页');
		zhuye.value.SetClassString("icon-icon-menu")
		lianxi.value.SetBtnText('练习');
		lianxi.value.SetClassString("icon-icon-edit2")
		cuoti.value.SetBtnText('错题');
		cuoti.value.SetClassString("icon-icon-error")
		shoucang.value.SetBtnText('收藏');
		shoucang.value.SetClassString("icon-icon-star")
		// console.log(g.index)
		btn_click(g.index)
	})
</script>

<style>
	@import "../../static/icon.css";

	.icon_sym {
		display: inline-block;
		width: 40px;
		height: 40px;
		color: red;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
		/* margin-left: 20px; */
		/* padding: 40px; */
	}

	.container {}

	.body1 {
		padding-top: 30px;
		/* position: fixed; */
		display: flex;
		flex-direction: column;

		justify-content: center;

	}

	.body1_head {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		/* 水平靠左 */
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

	.item_body1_head {

	margin-right: 20px;

	}
	.fgx{
		padding-top: 10px;
		border-bottom: 1px solid #777;
		
	}
</style>