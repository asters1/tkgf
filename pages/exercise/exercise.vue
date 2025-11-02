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

		<!-- 页面主体内容：必须加上标题栏总高度的上边距，避免被遮挡 -->
		<view class="body">
			这里是页面内容...（可添加大量文本测试滚动效果）
		</view>
	</view>
</template>

<script setup>
	// 脚本部分无需修改，保持原样
	import { onLoad } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	const statusBarHeight = ref(0) 
	const select_index = ref(0)

	onLoad(() => {
		const systemInfo = uni.getSystemInfoSync()
		statusBarHeight.value = systemInfo.statusBarHeight
	})

	const handleBack = () => {
		uni.navigateBack({ delta: 1 })
	}

	const handleRightClick = () => {
		uni.showToast({ title: '点击了右侧按钮', icon: 'none' })
	}

	const select_modle = (index) => {
		select_index.value = index
	}
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
		position: fixed; /* 固定在页面顶部 */
		top: 0; /* 距离顶部0距离 */
		left: 0; /* 距离左侧0距离 */
		right: 0; /* 距离右侧0距离，实现全屏宽度 */
		z-index: 999; /* 提高层级，避免被其他内容遮挡 */
		display: flex;
		align-items: center;
		height: 64px; /* 标题栏主体高度（不含状态栏） */
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
		padding-top: calc(var(--status-bar-height) + 100px);
		height: 1000px; /* 可保留用于测试滚动 */
	}

	.pulic_text {
		padding: 5px;
	}

	.select_text {
		background-color: #000;
		color: #fff;
	}
</style>