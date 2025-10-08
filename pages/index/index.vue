<template>
	<view class="container">
		<view class="content">
			<view class="body1" v-if="this_index ===0 ">
				<view class="body1_head">
					<text class="item_body1_head icon_sym icon-icon-download2" @click="c_download"></text>
					<text class="item_body1_head icon_sym icon-folder" @click="c_local"></text>
					<text class="item_body1_head icon_sym icon-icon-delete" @click="c_delete"></text>
					<input-dialog v-model="showDialog" title="远程导入题库" placeholder="请输入题库地址" @confirm="onInputConfirm"
						@cancel="onInputCancel" />
					<!-- <text>aaaa</text> -->
				</view>
				<view class="fgx"></view>
				<view class="body1_content">
					<scroll-view scroll-y="true" class="scroll-container">
						<!-- 这里放需要滚动的内容 -->
						<view v-for="item in tk_items" :key="item" class="item"
							:class="{ active: body1_activeId === item.id }" :value="item.value"
							@click="itemClick(item.id)">
							{{ item.name }}
						</view>
						<view style="padding: 100px;"></view>

					</scroll-view>


				</view>
			</view>
		</view>
		<view class="body2" v-if="this_index ===1 ">
			<view class="body2_head">
				<view>{{tk_index+1}}/{{tk_total}}</view>
			</view>
			<view style="padding: 10px;"></view>
			<view class="body2_head">
				<button @click="btn_jixu">继续</button>
				<button @click="btn_shunxu">顺序</button>
				<button @click="btn_tiaozhuan">跳转</button>
				<button @click="btn_suiji">随机</button>
				<input-dialog v-model="showDialog_tiaozhuan" title="跳转题目顺序练习" placeholder="请输入第几题"
					@confirm="input_tk_index" @cancel="onInputCancel" />
			</view>

			<view class="fgx"></view>
			<view class="question">
				<view class="question_type">{{text_question_type}}</view>
				<view style="padding: 5px;"></view>
				{{text_question}}
			</view>
			<view class="option">
				<view v-for="(o,index) in options" :key="o"
					:class="['option1',{'answer_active':select_Items[index],'iserror':select_Items[index]&&!o.istrue&&click_enter,'istrue':o.istrue&&click_enter}]"
					@click="toggleItem(index)">{{ o.n }}. {{o.v}}
				</view>
			</view>


			<view style="padding: 5px;"></view>
			<view class="answer">
				<view class="answer_icon">{{text_answer_icon}}</view>{{text_answer}}
			</view>
			<view class="analysis">
				<view style="padding: 5px;"></view>
				<view class="analysis_icon">{{text_analysis_icon}}</view>{{text_analysis}}
				<view style="padding:200px"></view>
			</view>
			<view class="body_bottom">

				<button class="btn_enter" @click="btn_enter">确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定</button>


				<view class="body2_select_ti">
					<button @click="btn_shangyiti">上一题</button>
					<button :class="{'shoucang_active':ref_shoucang_active}" @click="btn_shoucangbenti">收藏本题</button>
					<!-- <button :class="{'shoucang_active':ref_shoucang_active}" @click="btn_shoucangbenti">收藏本题</button> -->
					<button @click="btn_xiayiti">下一题</button>
				</view>
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
		nextTick,
		onMounted
	} from 'vue'

	import InputDialog from '@/components/input-dialog/input-dialog.vue'
	import {
		onReady
	} from '@dcloudio/uni-app'
	import g from '@/common/global'
	const a_z = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
		"T", "U", "V", "W", "X", "Y", "Z"
	];
	const zhuye = ref(null)
	const lianxi = ref(null)
	const cuoti = ref(null)
	const shoucang = ref(null)


	const c_zhuye = ref("")
	const c_lianxi = ref("")
	const c_cuoti = ref("")
	const c_shoucang = ref("")

	const tk_items = ref([])
	// 状态：当前选中的 item.id
	const body1_activeId = ref(null);
	// const tks = ref(null);

	const this_index = ref(0)
	this_index.value = 1
	this_index.value = 2
	this_index.value = 3
	this_index.value = 0
	//=======body2=======
	const tk_index = ref(0)
	const tk_total = ref(0)
	//题目
	const text_question = ref("")
	//选项
	const text_option = ref("")
	//答案
	const text_answer = ref("")
	//解析
	const text_analysis = ref("")
	//[题目类型]
	const text_question_type = ref("")
	//[答案】
	const text_answer_icon = ref("")
	//[解析]
	const text_analysis_icon = ref("")
	const options = ref([])
	//答案数组
	const select_Items = ref([])
	const click_enter = ref(false)
	const iserror = ref(false)



	//错题与收藏
	const cuoti_json = ref({})
	const soucang_json = ref({})

	const kaiji = ref(true)

	const ref_shoucang_active = ref(false)
	cuoti_json.value.tiku_id_lists = []
	soucang_json.value.tiku_id_lists = []
	cuoti_json.value.tiku_value_lists = []
	soucang_json.value.tiku_value_lists = []
	//=====body2结束=======



	//====缓存相关====
	g.CacheDir = g.getCachePath() + "/../tiku"
	g.MkdirAll(g.CacheDir)
	//==获取题库===
	//刷新列表
	const get_tk = () => {
		tk_items.value = []
		g.get_tks_path(g.CacheDir).then(result => {
			// g.ShowText(JSON.stringify(result[0]));
			// g.ShowText(result.length)
			// tk_items.value=result/
			for (let i = 0; i < result.length; i++) {
				// g.ShowText(JSON.stringify(result[i]))
				let obj = {
					"name": result[i].name.replace('.json', ''),
					"value": result[i].fullPath,
					"id": i
				}
				tk_items.value.push(obj)
			}
		});

	}
	get_tk()
	const update_data = () => {
		const fileName = g.Select_tiku_path.substring(g.Select_tiku_path.lastIndexOf('/') + 1).replace('.json',
			'');
		g.tk_fileName = fileName
		if (kaiji.value) {
			kaiji.value = false
			try {
				g.R_file(g.getCachePath() + "/" + fileName + ".like").then(result => {
					soucang_json.value = JSON.parse(result)
					ref_shoucang_active.value = false
					for (let i = 0; i < soucang_json.value.tiku_id_lists.length; i++) {
						if (soucang_json.value.tiku_id_lists[i] === tk_index.value) {
							ref_shoucang_active.value = true
						}

					}
				})

			} catch {
				console.log("读取缓存收藏失败！！")
			}
		}
		try {
			g.R_file(g.getCachePath() + "/" + fileName + ".like").then(result => {
				soucang_json.value = JSON.parse(result)
				ref_shoucang_active.value = false
				for (let i = 0; i < soucang_json.value.tiku_id_lists.length; i++) {
					if (soucang_json.value.tiku_id_lists[i] === tk_index.value) {
						ref_shoucang_active.value = true
					}

				}
			})

		} catch {
			console.log("读取缓存收藏失败！！")
		}



		uni.setNavigationBarTitle({
			title: g.tk_fileName, // 新标题内容
			success: () => console.log('标题修改成功'),
			fail: (err) => console.error('修改失败', err)
		});
		if (g.tk[tk_index.value].type === 1) {
			text_question_type.value = "[单选题]"
		} else if (g.tk[tk_index.value].type === 2) {
			text_question_type.value = "[多选题]"
		} else if (g.tk[tk_index.value].type === 3) {
			text_question_type.value = "[判断题]"
		}
		text_question.value = g.tk[tk_index.value].question
		options.value = []

		if (g.tk[tk_index.value].option.total > 0) {
			text_answer_icon.value = ""
			text_answer.value = ""
			text_analysis_icon.value = ""
			text_analysis.value = ""

			let i = 0;
			while (i < a_z.length) {
				let istrue = false
				if (g.tk[tk_index.value].option[a_z[i]] === undefined) {
					break
				}

				for (let j = 0; j < g.tk[tk_index.value].answer.length; j++) {
					if (g.tk[tk_index.value].answer[j] === a_z[i]) {

						istrue = true

					}

				}
				// options.value.push(a_z[i] + ". " + g.tk[tk_index.value].option[a_z[i]])
				let op1 = {
					"n": a_z[i],
					"v": g.tk[tk_index.value].option[a_z[i]],
					"istrue": istrue
				}
				options.value.push(op1)
				i++
			}



		}
		// console.log(options.value)
	}
	//=获取题库结束=
	// g.downloadFile("https://gitee.com/asters1/tkgf/raw/master/tk/tk.json")

	//======弹窗开始=====
	const showDialog = ref(false)
	const showDialog_tiaozhuan = ref(false)

	const c_download = () => {
		showDialog.value = true
	}
	const input_tk_index = (value) => {


		// g.ShowText("顺序练习")
		if (g.Select_tiku_path === "") {
			g.ShowText("还未选择题库，请去选择题库~")
		} else {
			if (isNaN(value)) {
				g.ShowText("请输入数字~")
			} else {
				tk_index.value = Number(value) - 1
			}

			console.log(g.tk.length)

			update_data()
			// g.ShowText(options.value)
		}
	}
	const onInputConfirm = (value) => {
		g.downloadFile(value)
		get_tk()

	}
	const onInputCancel = () => {
		console.log('用户点击了取消')
	}
	const c_local = () => {
		g.ShowText("本地加载功能正在开发，敬请期待~")
		get_tk()

	}
	const c_delete = () => {
		g.ShowText("删除功能正在开发，敬请期待~")
		get_tk()
	}


	//======弹窗结束=====
	const toggleItem = (index) => {
		// g.ShowText(index)
		select_Items.value[index] = !select_Items.value[index]
	}
	const itemClick = (id) => {
		body1_activeId.value = id
		g.Select_tiku_path = tk_items.value[id].value
		g.ShowText(g.Select_tiku_path)

		g.R_file(g.Select_tiku_path).then(result => {
			try {
				g.tk = JSON.parse(result)
				update_data()



			} catch {
				g.ShowText("转化题库失败")

			}

		})




	}
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
				if (g.Select_tiku_path === "") {
					try {
						g.R_file(g.getCachePath() + "/tkgf.continue").then(result => {
							let continue_obj = JSON.parse(result)
							// g.ShowText(continue_obj)
							g.Select_tiku_path = continue_obj.Select_tiku_path
							console.log(g.Select_tiku_path)
							g.R_file(g.Select_tiku_path).then(res => {
								try {
									g.tk = JSON.parse(res)
									update_data()

									console.log("转化成功！")
								} catch {
									g.ShowText("转化题库失败")


								}
							})

							tk_index.value = continue_obj.tk_index
							tk_total.value = continue_obj.tk_total

						})
					} catch {
						g.ShowText("还未选择题库，请去选择题库~")
					}
				}
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
	const btn_jixu = () => {
		// g.ShowText("继续练习")
		if (g.Select_tiku_path === "") {
			g.ShowText("还未选择题库，请去选择题库~")
		} else {
			const fileName = g.Select_tiku_path.substring(g.Select_tiku_path.lastIndexOf('/') + 1).replace('.json',
				'');
			g.R_file(g.getCachePath() + "/" + fileName + ".continue").then(result => {
				let continue_obj = JSON.parse(result)
				// g.ShowText(continue_obj)
				g.Select_tiku_path = continue_obj.Select_tiku_path
				console.log(g.Select_tiku_path)
				g.R_file(g.Select_tiku_path).then(res => {
					try {
						g.tk = JSON.parse(res)
						update_data()
						console.log("转化成功！")
					} catch {
						g.ShowText("转化题库失败")


					}
				})

				tk_index.value = continue_obj.tk_index
				tk_total.value = continue_obj.tk_total

			})
		}

	}


	const btn_shunxu = () => {
		// g.ShowText("顺序练习")
		if (g.Select_tiku_path === "") {
			g.ShowText("还未选择题库，请去选择题库~")
		} else {
			tk_index.value = 0
			console.log(g.tk.length)
			tk_total.value = g.tk.length
			update_data()
			// g.ShowText(options.value)

		}

	}
	const btn_tiaozhuan = () => {
		showDialog_tiaozhuan.value = true
		text_analysis_icon.value = ""
		text_analysis.value = ""
		select_Items.value = []
		click_enter.value = false
	}
	const btn_suiji = () => {
		// g.ShowText("随机练习")
		if (g.Select_tiku_path === "") {
			g.ShowText("还未选择题库，请去选择题库~")
		} else {

			g.ShowText("功能还未开发~")
		}

	}
	//比较两个数组是否相等，允许顺序不同
	function ArraysEqual(arr1, arr2) {
		if (arr1.length !== arr2.length) return false;
		const sortedArr1 = [...arr1].sort();
		const sortedArr2 = [...arr2].sort();
		return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
	}

	function getFilteredLetters(boolArray) {
		const letters = Array.from({
			length: boolArray.length
		}, (_, i) => String.fromCharCode(65 + i));
		return boolArray.map((isIncluded, index) => isIncluded ? letters[index] : null).filter(Boolean);
	}
	const btn_enter = () => {
		// g.ShowText("确定")
		//console.log("============================")
		// console.log(JSON.stringify(g.tk[tk_index.value]))
		// console.log("============================")
		// console.log(JSON.stringify(options.value))
		click_enter.value = !click_enter.value
		text_analysis_icon.value = "[解析]"
		text_analysis.value = g.tk[tk_index.value].analysis
		if (select_Items.value.length > 0) {
			if (!ArraysEqual(getFilteredLetters(select_Items.value), g.tk[tk_index.value].answer)) {
				console.log("no")
				const fileName = g.Select_tiku_path.substring(g.Select_tiku_path.lastIndexOf('/') + 1).replace('.json',
					'');
				shoucang_obj(g.getCachePath() + "/" + fileName + ".error", cuoti_json)

			}
		}

	}
	const btn_shangyiti = () => {
		// g.ShowText("上一题")
		if (g.Select_tiku_path === "") {
			g.ShowText("还未选择题库，请去选择题库~")
		} else {
			if ((tk_index.value - 1) < 0) {
				tk_index.value = 0
			} else {
				tk_index.value = tk_index.value - 1
			}
			tk_total.value = g.tk.length
			text_analysis_icon.value = ""
			text_analysis.value = ""
			select_Items.value = []
			click_enter.value = false
			save_Continue()
			update_data()

		}

	}
	const shoucang_obj = (path, obj) => {
		if (g.fileName === "") {
			return
		}
		console.log(path)



		for (let i = 0; i < obj.value.tiku_id_lists.length; i++) {
			if (obj.value.tiku_id_lists[i] === tk_index.value) {
				if (path.endsWith("like")) {
				obj.value.tiku_id_lists.splice(i, 1)
				obj.value.tiku_value_lists.splice(i, 1)
				
					g.W_file(path, JSON.stringify(obj.value))
					g.ShowText("已移除该题！")
				}else{
					return
				}
				update_data()
				return
			}

		}

		obj.value.tiku_id_lists.push(tk_index.value)
		obj.value.tiku_value_lists.push(g.tk[tk_index.value])
		g.W_file(path, JSON.stringify(obj.value))
		g.ShowText("已记录该题！")
		update_data()
	}

	const btn_shoucangbenti = () => {

		// g.ShowText("收藏本题")
		if (g.Select_tiku_path === "") {
			g.ShowText("还未选择题库，请去选择题库~")
		} else {
			const fileName = g.Select_tiku_path.substring(g.Select_tiku_path.lastIndexOf('/') + 1).replace('.json',
				'');
			shoucang_obj(g.getCachePath() + "/" + fileName + ".like", soucang_json)

		}


	}
	const save_Continue = () => {
		const fileName = g.Select_tiku_path.substring(g.Select_tiku_path.lastIndexOf('/') + 1).replace('.json',
			'');
		let tkgf_cache_file = g.getCachePath() + "/tkgf.continue"
		let tiku_cache_file = g.getCachePath() + "/" + fileName + ".continue"
		let f_obj = {}
		f_obj.Select_tiku_path = g.Select_tiku_path
		f_obj.tk_index = tk_index.value
		f_obj.tk_total = tk_total.value
		g.W_file(tkgf_cache_file, JSON.stringify(f_obj))
		g.W_file(tiku_cache_file, JSON.stringify(f_obj))
	}
	const btn_xiayiti = () => {
		// g.ShowText("下一题")
		if (g.Select_tiku_path === "") {
			g.ShowText("还未选择题库，请去选择题库~")
		} else {
			if (tk_index.value >= g.tk.length - 1) {
				tk_index.value = g.tk.length - 1
			} else {
				tk_index.value = tk_index.value + 1
			}

			text_analysis_icon.value = ""
			text_analysis.value = ""
			select_Items.value = []
			click_enter.value = false
			tk_total.value = g.tk.length
			save_Continue()
			update_data()
		}

	}
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

	.container {
		width: 97%;
	}

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

	.scroll-container {
		height: 650px;
		/* 必须设置固定高度，否则无法滚动 */
		border: 1px solid #eee;
		scrollbar-width: none;
		width: 99%;


	}

	.item {
		padding: 20px;
		border-bottom: 1px solid #ddd;
	}

	.item.active {
		background-color: #57CB37;
		/* 高亮颜色 */
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

		/* box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); */
		z-index: 1000;
		/* max-width: 400px; */
		margin: 0 auto;
		border-top: 1px solid #777;
		justify-content: space-between;
		padding: 5px 10px 5px 10px;

		/* 左右添加内边距 */
		/* background-color: transparent; */
		background-color: #fff;
		padding-left: 30px;
		padding-right: 30px;
	}

	.select_btn {
		border-bottom: 2px solid #ff0000;

		/* background-color: #eee; */

	}

	.item_body1_head {

		margin-right: 20px;

	}

	.fgx {
		padding-top: 10px;
		border-bottom: 1px solid #777;

	}

	.body2 {
		margin-top: 30px;
		margin-left: 15px;
		display: flex;
		flex-direction: column;
		width: 99%;
	}

	.body2_head {
		display: flex;
		flex-direction: row;

	}

	.body_bottom {
		position: fixed;
		/* 关键：保持固定定位 */
		bottom: 0;
		/* 关键：必须设置为0才能固定在底部 */
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		margin-bottom: 100px;
		background-color: #fff;
	}

	.btn_enter {

		width: 85%;
		margin-bottom: 15px;
	}

	.body2_select_ti {

		display: flex;
		flex-direction: row;
	}

	.option1 {
		margin-top: 10px;
		margin-right: 10px;
		padding: 10px
	}

	.answer_active {
		background-color: #27B755;

	}

	.istrue {
		background-color: #00CE26;

	}

	.iserror {
		background-color: #F02E45;

	}

	.analysis_icon {
		padding: 5px;
	}

	.shoucang_active {
		background-color: #FE9900
	}
</style>