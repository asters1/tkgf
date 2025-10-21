<template>
	<view class="content body">
		<A_bottom class="g_bottom" ref="ref_bottom"></A_bottom>
		<button type="primary" @click="local_btn">本地导入</button>
		<button type="primary" @click="click_remote_btn">远程导入</button>
		<button type="primary" @click="click_mk_tiku_btn">题库制作</button>
		<input-dialog v-model="show_remote_download" title="远程导入题库" placeholder="请输入题库地址" @confirm="input_click_enter"
			@cancel="input_click_cancel" />
	</view>



</template>

<script setup>
	import {
		ref
	} from 'vue'
	import A_bottom from '@/components/A_bottom/A_bottom.vue'
	import g from '@/common/global'

	import {
		onReady
	} from '@dcloudio/uni-app'
	import InputDialog from '@/components/input-dialog/input-dialog.vue'
	const tkgf_init = () => {
		//初始化
		g.get_storage_permission()
		g.MkdirAll("/storage/emulated/0/000TiKu")

	}
	tkgf_init()


	const ref_bottom = ref(null)
	const show_remote_download = ref(false)


	const input_click_enter = (value) => {
		g.log(value)
		g.log("用户点击了确定")
	}
	const input_click_cancel = () => {
		g.log('用户点击了取消')
	}
	const click_remote_btn = () => {
		show_remote_download.value = true
	}
	const local_btn = () => {
g.ShowWindow("本地导入","请将题库文件(后缀名为.json)放入手机储存根目录(/storage/emulated/0)下的000TiKu文件夹下~")

	}
	const click_mk_tiku_btn=()=>{
		g.ShowText("题库制作正在开发~")
		
	}

</script>

<style>
	@import "../../static/gobal.css";

	button {
		margin-top: 15px;

		width: 80%;

	}

	.body {
		padding-top: 120px;
	}
</style>