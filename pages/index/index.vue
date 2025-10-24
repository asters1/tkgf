<template>
	<view class="content body">

		<button type="primary" @click="local_btn">本地导入</button>
		<button type="primary" @click="click_remote_btn">远程导入</button>
		<button type="primary" @click="click_mk_tiku_btn">题库制作</button>
		<button type="primary" @click="click_test_btn">测试按钮</button>
		<input-dialog v-model="show_remote_download" title="远程导入题库" placeholder="请输入题库地址" @confirm="input_click_enter"
			@cancel="input_click_cancel" />
	</view>

	<!-- 
<A_bottom class="g_bottom" ref="ref_bottom"></A_bottom> -->
</template>

<script setup>
	import {
		ref
	} from 'vue'

	import g from '@/common/global'

	import {
		onReady
	} from '@dcloudio/uni-app'
	import InputDialog from '@/components/input-dialog/input-dialog.vue'

	// g.log(g.getRealPath("_download"))

	g.log(g.get_tks_path(g.pulic_tiku_dir))
	
	const tkgf_init = () => {
		//初始化
		g.get_storage_permission()
		g.MkdirAll(g.pulic_tiku_dir)


	}
	tkgf_init()


	const ref_bottom = ref(null)
	const show_remote_download = ref(false)


	const input_click_enter = (value) => {
		// /g.get_storage_permission()
		g.downloadFile(g.pulic_tiku_dir, value)
		g.log('用户点击了确定')

	}
	const input_click_cancel = () => {
		g.log('用户点击了取消')
	}
	const click_remote_btn = () => {
		show_remote_download.value = true
	}
	const local_btn = () => {
		g.ShowWindow("本地导入", "请将题库文件(后缀名为.json)放入手机储存根目录(/storage/emulated/0)下的000TiKu文件夹下~")

	}



	const click_mk_tiku_btn = () => {
		g.ShowText("题库制作正在开发~")
	}

	function copyFile(fileEntry) {
		plus.io.resolveLocalFileSystemURL(
			"file://" + g.pulic_tiku_dir, // 替换为目标目录路径
			function(targetDir) {
				fileEntry.copyTo(
					targetDir,
					"new_file_name.text", // 新文件名，可自定义
					function(newFile) {
						console.log("文件复制成功，新路径：" + newFile.fullPath);
					},
					function(error) {
						console.error("文件复制失败：" + error.message);
					}
				);
			},
			function(error) {
				console.error("获取目标目录失败：" + error.message);
			}
		);
	}
	//===============
	import f from '@/common/file'
	const click_test_btn = () => {
		g.log(f.filelist("/storage/emulated/0/000TiKu0"))

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