<template>
	<view class="a_bottom">

		<view class="class_icon" @click="icon_click(0)">
			<text :class="class_icon_home"></text>
			<text :class="class_text_home">首页</text>
		</view>
		<view class="class_icon" @click="icon_click(1)">
			<text :class="class_icon_tk"></text>
			<text :class="class_text_tk">题库</text>
		</view>
		<view class="class_icon" @click="icon_click(2)">
			<text :class="class_icon_remote"></text>
			<text :class="class_text_remote">远程</text>
		</view>
		<view class="class_icon" @click="icon_click(3)">
			<text :class="class_icon_my"></text>
			<text :class="class_text_my">我的</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	import g from '@/common/global'


	//==================
	const class_icon_home = ref("icon_sym icon-zhuye")
	const class_text_home = ref("text")

	const class_icon_tk = ref("icon_sym icon-fenlei")
	const class_text_tk = ref("text")

	const class_icon_remote = ref("icon_sym icon-tianqi-copy")
	const class_text_remote = ref("text")

	const class_icon_my = ref("icon_sym icon-geren")
	const class_text_my = ref("text")


	if (g.icon_index === 0) {

		class_icon_home.value = "icon_sym icon-zhuye-copy"
		class_text_home.value = "text select_text"

	} else if (g.icon_index === 1) {

		class_icon_tk.value = "icon_sym icon-fenlei-copy"
		class_text_tk.value = "text select_text"


	} else if (g.icon_index === 2) {

		class_icon_remote.value = "icon_sym icon-tianqi-copy-copy"
		class_text_remote.value = "text select_text"


	} else if (g.icon_index === 3) {

		class_icon_my.value = "icon_sym icon-geren-copy"
		class_text_my.value = "text select_text"


	}



	//==================
	const icon_click = (num) => {
		class_icon_home.value = "icon_sym icon-zhuye"
		class_icon_tk.value = "icon_sym icon-fenlei"
		class_icon_remote.value = "icon_sym icon-tianqi-copy"
		class_icon_my.value = "icon_sym icon-geren"

		class_text_home.value = "text"
		class_text_tk.value = "text"
		class_text_remote.value = "text"
		class_text_my.value = "text"

		if (num === 0) {

			class_icon_home.value = "icon_sym icon-zhuye-copy"
			class_text_home.value = "text select_text"
			g.log("点击了首页,正在跳转首页~")
			g.icon_index = 0
			uni.redirectTo({
				url: '/pages/index/index'
			});

		} else if (num === 1) {

			class_icon_tk.value = "icon_sym icon-fenlei-copy"
			class_text_tk.value = "text select_text"
			g.log("点击了题库，正在跳转题库~")
			g.icon_index = 1
			uni.redirectTo({
				url: '/pages/tk/tk'
			});
		} else if (num === 2) {

			class_icon_remote.value = "icon_sym icon-tianqi-copy-copy"
			class_text_remote.value = "text select_text"
			g.log("点击了远程~")
			g.icon_index = 2
			uni.redirectTo({
				url: '/pages/remote/remote'
			});
		} else if (num === 3) {

			class_icon_my.value = "icon_sym icon-geren-copy"
			class_text_my.value = "text select_text"
			g.log("点击了我的~")
			g.icon_index = 3
			uni.redirectTo({
				url: '/pages/my/my'
			});
		}
	}




	defineExpose({
		icon_click

	})
</script>

<style>
	@import "../../static/gobal.css";
	@import "../../static/icon.css";

	.icon_sym {
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

	.select_text {
		color: #1296db
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
		border-top: 1px solid #777;
	}

	.text {
		padding-top: 5px;
		font-size: 12px;

	}

	.a_bottom {
		display: flex;
		flex-direction: row;
		/* background-color: red; */
	}
</style>