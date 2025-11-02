<template>
	<view class="head1">
		<!-- 自定义标题栏 -->
		<view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
			<!-- 左侧返回按钮 -->
			<view class="nav-left" @click="handleBack">
				<text v-if="canBack">{{"←"}}</text>
			</view>

			<!-- 中间标题 -->
			<view class="nav-center">
				<view :class="['pulic_text',{'select_text':select_index===0}]" @click="select_modle(0)">答题</view>
				<view :class="['pulic_text',{'select_text':select_index===1}]" @click="select_modle(1)">背题</view>
			</view>

			<!-- 右侧操作区（示例：添加按钮） -->
			<view class="nav-right" @click="handleRightClick">
				<text>添加</text>
			</view>
		</view>

		<!-- 页面主体内容 -->
		<view class="body">
			这里是页面内容...
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		ref
	} from 'vue'

	// 标题栏配置
	// const pageTitle = ref('我的页面') // 页面标题
	const statusBarHeight = ref(0) // 状态栏高度
	const select_index = ref(0)
	const canBack = ref(true) // 是否显示返回按钮（可根据页面是否为首页动态控制）

	// 获取状态栏高度并初始化
	onLoad(() => {
		// 获取系统信息，计算状态栏高度
		const systemInfo = uni.getSystemInfoSync()
		statusBarHeight.value = systemInfo.statusBarHeight

		// 示例：如果是首页，隐藏返回按钮（可根据实际路由判断）
		// const pages = getCurrentPages()
		// canBack.value = pages.length > 1
	})

	// 返回上一页
	const handleBack = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	// 右侧按钮点击事件
	const handleRightClick = () => {
		uni.showToast({
			title: '点击了右侧按钮',
			icon: 'none'
		})
	}
	const select_modle = (index) => {
		select_index.value = index
	}
</script>

<style scoped>
	/* 页面容器 */
	.head1 {

		min-height: 100vh;
		background-color: #f5f5f5;

	}

	/* 自定义标题栏 */
	.custom-nav {
		display: flex;
		align-items: center;
		height: 44px;
		/* 标题栏主体高度（不含状态栏） */
		background-color: #fff;
		border-bottom: 1px solid #eee;
		justify-content: space-between;
	}

	/* 左侧返回按钮区域 */
	.nav-left {
		width: 60px;
		height: 100%;
		display: flex;
		align-items: center;
		/*  justify-content: center; */
		font-size: 20px;
		color: #333;
		/* background-color: red;*/
		margin-left: 20px;
	}

	/* 中间标题区域 */
	.nav-center {
		/* 占满剩余空间 */
		/* flex: 1; */
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

	/* 右侧操作区域 */
	.nav-right {
		width: 60px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #007aff;
		/* 示例蓝色 */
	}

	/* 页面内容区域（避开标题栏高度） */
	.body {
		/* 状态栏高度 + 标题栏主体高度（44px） */
		padding-top: calc(var(--status-bar-height) + 44px);
		padding: calc(var(--status-bar-height) + 44px) 16px 16px;
	}

	.pulic_text {
		/* color: red; */
		padding: 5px;
	}

	.select_text {
		background-color: #000;
		color: #fff;
	}
</style>