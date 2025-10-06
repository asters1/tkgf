<template>
	<view class="icon_background">
		<view class="nav-btn">

			<text :class="iconClassString"></text>
			<text :class="textClassString">{{btn_text}}</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const btn_text = ref(""); // 初始值为"主页"
	const iconClassString = ref("")
	const textClassString = ref("")

	const SetBtnText = (text) => {

		btn_text.value = text
	};
	const SetClassString = (text) => {
		// console.log('Setting class to:', text); // 添加日志
		text = "icon_sym " + text
		iconClassString.value = text
	};
	const SetTextClass=(text)=>{
		textClassString.value=text
	}
	// SetClassString("icon_sym icon-grid-view")
	defineExpose({
		SetBtnText,
		SetClassString,
		SetTextClass
	})
</script>

<style>
	@import "../../static/icon.css";

	.icon_sym {
		display: inline-block;
		width: 30px;
		height: 30px;
		color:red;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
		/* margin-left: 20px; */
		/* padding: 40px; */
	}

	.icon_background {
		/* 		position: fixed;
		flex-direction: column;
		display: flex; */

	}

	.nav-btn {

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
	}
	.select_text{
		color:#1296db
	}
</style>