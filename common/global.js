// src/common/global.js

const g = {
	"icon_index": 0,
	"debug": true,
	"pulic_tiku_dir": "/storage/emulated/0/000TiKu",
	"exercise_model": 0,
	"exercise_tk_obj": {},
	"tk_obj": {},
	"ShowText": function(text) {
		console.log(text)
		uni.showToast({
			title: text,
			icon: 'none'
		});
	},
	"ShowWindow": function(windown_title, text) {
		uni.showModal({
			title: windown_title, // 标题（可选）
			content: text, // 提示内容
			showCancel: false, // 隐藏取消按钮（关键）
			confirmText: '确定', // 自定义确定按钮文字
			success: (res) => {
				if (res.confirm) {
					// 点击确定按钮后执行
					console.log('用户点击了确定');
				}
			}
		});
	},
	"get_storage_permission": function() {
		//获取储存权限
		// 检查并请求存储权限
		// 判断有没有存储权限
		var _this = this
		plus.android.requestPermissions([
			'android.permission.WRITE_EXTERNAL_STORAGE',
			'android.permission.READ_EXTERNAL_STORAGE',
			'android.permission.INTERNET',
			'android.permission.ACCESS_WIFI_STATE'
		], function(e) {
			if (e.deniedAlways.length > 0) { //权限被永久拒绝
				// 弹出提示框解释为何需要读写手机储存权限，引导用户打开设置页面开启
				uni.showModal({
					title: '存储权限',
					content: '您拒绝了存储权限，请前往设置-应用开启存储权限。',
					success: function(res) {
						if (res.confirm) {
							// console.log('用户点击确定');
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			}
			if (e.deniedPresent.length > 0) { //权限被临时拒绝
				// 弹出提示框解释为何需要读写手机储存权限，可再次调用plus.android.requestPermissions申请权限
				plus.android.requestPermissions(['android.permission.WRITE_EXTERNAL_STORAGE'])

			}
			if (e.granted.length > 0) { //权限被允许
				//调用依赖获取读写手机储存权限的代码
				_this.exportFile()
			}
		}, function(e) {

		});

	},
	"log": function(obj) {
		if (this.debug) {
			if (typeof(obj) === "object") {
				// console.log(typeof(obj))
				console.log(JSON.stringify(obj))
			} else {
				console.log(obj)
			}



		}
	},
	"getCachePath": function() {
		const main = plus.android.runtimeMainActivity();
		const path = main.getExternalCacheDir().toString();

		// this.ShowText('外部缓存目录:' + path);
		return path;
	},
	"getTkDataDir": function() {
		return g.getCachePath() + "/../tk"
	},

	"getRealPath": function(path) {

		// 转换为真实路径
		const realPath = plus.io.convertLocalFileSystemURL(path);
		// console.log('._doc 实际路径：', realPath);

		return realPath;
	},
	"MkdirAll": function(Path) {
		return new Promise((resolve, reject) => {
			try {
				const File = plus.android.importClass('java.io.File');
				const dir = new File(Path);

				if (dir.exists()) {
					g.log(Path + "-->文件夹已存在！！")
					resolve(true);
					return;
				}


				const success = dir.mkdirs(); // mkdirs()会自动递归创建
				if (success) {
					resolve(true);
				} else {
					reject(new Error('创建目录失败'));
				}
			} catch (e) {
				reject(e);
			}
		});
	},
	/**
	 * 删除文件
	 * @param {String} filePath
	 */
	"delete_file": function(filePath) {
		const File = plus.android.importClass('java.io.File');
		let file = new File(filePath);
		if (file.exists()) {
			return file.delete();
		}
		return false
	},
	/**
	 * @param path 			写入文件的路径   			*必填
	 * @param content		写入文件的内容			*必填
	 * @param append		追加文件，默认false		
	 * @param charset		默认utf-8
	 */
	"W_file": function(path = '', content = '', append = false, charset = 'utf-8') {
		const File = plus.android.importClass('java.io.File');
		const FileOutputStream = plus.android.importClass('java.io.FileOutputStream');
		const OutputStreamWriter = plus.android.importClass('java.io.OutputStreamWriter');

		let outputStreamWriter;
		let file = new File(path);
		try {
			//不存在则创建新的文件
			if (!file.exists()) {
				file.createNewFile();
			}
			outputStreamWriter = new OutputStreamWriter(new FileOutputStream(path, append), charset);
			outputStreamWriter.write(content);
			outputStreamWriter.close();
		} catch (e) {
			if (null != outputStreamWriter) {
				outputStreamWriter.close();
			}
			return false;
		}
		return true;
	},
	"async_W_file": function(filePath, content) {
		// g.ShowText("==")
		// g.ShowText(filePath)
		// g.ShowText("==")
		// 文件不存在，先创建文件再写入
		const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
		const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
		// 获取沙箱目录路径
		filePath = plus.io.convertLocalFileSystemURL(filePath);

		plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {
			fs.root.getFile(filePath, {
				create: true
			}, function(fileEntry) {
				fileEntry.createWriter(function(writer) {
					writer.onwriteend = function(e) {
						console.log('写入成功 ');
					};
					writer.onerror = function(e) {
						console.error('写入失败：' + e.toString());
					};
					writer.write(content);
				});
			});
		});

	},
	/**
	 * 读取文件
	 * @param {String} path 文件路径
	 * @param {String} charset 编码
	 * @return {Array<String>} 内容列表（按行读取）,文件不存在或异常则返回false
	 */
	"R_file": function(path = '', charset = 'utf-8') {
		const File = plus.android.importClass('java.io.File');
		const InputStreamReader = plus.android.importClass('java.io.InputStreamReader');
		const BufferedReader = plus.android.importClass('java.io.BufferedReader');
		const FileInputStream = plus.android.importClass('java.io.FileInputStream');
		let file = new File(path);
		let inputStreamReader = null;
		let bufferedReader = null;
		let list = [];
		try {
			if (!file.exists()) {
				return false;
			}
			inputStreamReader = new InputStreamReader(new FileInputStream(file), charset);
			bufferedReader = new BufferedReader(inputStreamReader);
			let line = '';
			while (null != (line = bufferedReader.readLine())) {
				list.push(line);
			}
			bufferedReader.close();
			inputStreamReader.close();
		} catch (e) {
			if (null != bufferedReader) {
				bufferedReader.close();
			}
			if (null != inputStreamReader) {
				inputStreamReader.close();
			}
			return false;
		}
		return list;

	},
	/**
	 * 异步读取文件（Android 平台，基于 Promise）
	 * @param {string} path 文件路径（默认空字符串）
	 
	 * @returns {Promise} 返回 Promise 对象，成功时 resolve 读取的内容数组，失败时 reject 错误信息
	 */
	"async_R_file": function(filePath = '') {
		return new Promise((resolve, reject) => {
			// const filePath = '/storage/emulated/0/Android/data/io.dcloud.HBuilder/tiku/a.txt';
			const fullPath = plus.io.convertLocalFileSystemURL(filePath);

			plus.io.resolveLocalFileSystemURL(fullPath, (entry) => {
				entry.file((file) => {
					const reader = new plus.io.FileReader();
					reader.onloadend = (e) => {
						resolve(e.target.result); // 返回内容
					};
					reader.onerror = (e) => {
						reject(new Error('读取失败'));
					};
					reader.readAsText(file);
				}, (error) => reject(error));
			}, (error) => reject(error));
		});
	},
	/**
	 * 获取文件修改时间（Android 平台）
	 * @param {string} path 文件绝对路径
	 * @returns {Promise<number>} 成功返回修改时间戳（毫秒），失败返回错误信息
	 */
	"getFileModifyTime": function(path) {

		if (!path) {
			g.log('文件路径不能为空');
			return;
		}

		try {
			// 导入 Android File 类
			const File = plus.android.importClass('java.io.File');
			const file = new File(path);

			if (!file.exists()) {
				g.log('文件不存在: ' + path);
				return;
			}

			// 获取最后修改时间（毫秒时间戳，UTC 时间）
			const modifyTime = file.lastModified();
			const formattedDate = new Date(modifyTime).toISOString().slice(0, 10);
			// console.log(new Date(modifyTime).toUTCString())
			// const year = new Date(modifyTime).getFullYear()
			// const month = new Date(modifyTime).getMonth()
			// const day = new Date(modifyTime).getDay()
			// const localtime = year + "-" + month + "-" + day
			return formattedDate;

		} catch (e) {
			g.log('获取修改时间失败: ' + e.message);
		}
	},
	/**
	 * @param {String} dir			文件夹路径，注意结尾不要带"/".
	 * @param {String} filter		筛选后缀
	 */
	"get_file_list": function(dir = '', filter = "") {
		const File = plus.android.importClass("java.io.File");
		let list = [];
		let file = new File(dir);
		let tempList = file.listFiles();
		// console.log(tempList)
		for (let i = 0; i < tempList.length; i++) {
			let fileName = dir + "/" + tempList[i].getName();
			if (tempList[i].getName().endsWith(filter)) {
				// g.log(fileName)
				list.push(fileName);
			}

		}
		return list;
	},
	/**
	 * 获得目录中.json的列表
	 * @param {String} targetDir		目标文件夹
	 */
	"get_tks_path": function(targetDir) {
		let tks = this.get_file_list(targetDir, ".json")
		let result = []
		// g.log(tks)
		for (let i = 0; i < tks.length; i++) {
			const fileNameWithSuffix = tks[i].split('/').pop(); // 结果："钳工题.json"
			let tk_obj = {}
			tk_obj.id = i
			tk_obj.name = fileNameWithSuffix.slice(0, -5)
			tk_obj.fullPath = tks[i]
			result.push(tk_obj)
		}
		return result
	},

	/**
	 * @param  oldPath 旧的文件路径
	 * @param  newPath 新的文件路经
	 */
	"mv_file": function(oldPath, newPath) {
		const File = plus.android.importClass('java.io.File');
		// 创建源文件和目标文件对象
		const sourceFile = new File(oldPath);
		const targetFile = new File(newPath);

		// 检查源文件是否存在
		if (!sourceFile.exists()) {
			console.error('源文件不存在：', oldPath);
			return false;
		}

		// 检查目标路径的父目录是否存在，不存在则创建
		const targetParent = targetFile.getParentFile();
		if (!targetParent.exists()) {
			// 递归创建父目录（mkdirs() 与 mkdir() 区别：前者支持多级目录）
			const isDirCreated = targetParent.mkdirs();
			if (!isDirCreated) {
				console.error('目标目录创建失败：', targetParent.getAbsolutePath());
				return false;
			}
		}

		// 执行移动（renameTo() 方法）
		const isMoved = sourceFile.renameTo(targetFile);
		if (isMoved) {
			console.log('文件移动成功：', oldPath, '→', newPath);
		} else {
			console.error('文件移动失败');
		}

		return isMoved;

	},
	/**
	 * @param {String} oldPath
	 * @param {String} newPath			如果只传入路径，请不要在最后加"/"
	 */
	"cp_file": function(oldPath, newPath) {
		g.log("复制文件")
		let fileName = ""
		let Dir = newPath.substring(0, newPath.lastIndexOf('/'));
		const oldfileName = decodeURIComponent(oldPath.substring(oldPath.lastIndexOf('/') + 1));
		const newfileName = decodeURIComponent(newPath.substring(newPath.lastIndexOf('/') + 1));
		if (newfileName.includes(".")) {
			fileName = newfileName
		} else {
			Dir = newPath + "/"
			fileName = oldfileName

		}

		plus.io.resolveLocalFileSystemURL(
			"file://" + oldPath, // 替换为实际文件路径
			function(entry) {
				console.log("文件路径：" + entry.fullPath);
				console.log("file://" + Dir)
				// 进入下一步，拷贝文件
				plus.io.resolveLocalFileSystemURL(
					"file://" + Dir, // 替换为目标目录路径
					function(targetDir) {
						entry.copyTo(
							targetDir,
							fileName, // 新文件名，可自定义
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
			},
			function(error) {
				console.error("获取文件失败：" + error.message);
			}
		);
	},
	"file_exists": function(filePath) {
		const File = plus.android.importClass('java.io.File');
		const dir = new File(filePath);

		if (dir.exists()) {
			g.log(filePath + "-->文件已存在！！")
			return true;
		} else {
			g.log(filePath + "-->文件不存在！！")
			return false;
		}
	},
	/**
	 * @param {String} path		下载文件存放的路径
	 * @param {String} url		下载文件的url
	 */
	"downloadFile": function(path, url) {

		const fileName = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1));
		uni.downloadFile({
			url: url, // 下载地址
			header: {
				"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1 Edg/141.0.0.0"
			},

			success: (res) => {
				if (res.statusCode === 200) {
					// console.log('下载成功，临时路径:', res.tempFilePath);
					// 进一步保存到本地（APP端）
					uni.saveFile({
						tempFilePath: res.tempFilePath,
						success: (saveRes) => {
							this.delete_file(path + "/" + fileName)
							this.mv_file(
								this.getRealPath(saveRes.savedFilePath),
								path + "/" + fileName)
							g.ShowText('下载成功!\n文件已保存:\n' + path + "/" +
								fileName);
						}
					});
				} else {
					g.ShowText('下载失败!状态码：' + res.statusCode);
				}
			},
			fail: (err) => {
				g.ShowText('下载失败' + err);
			}
		});
	}
}

// 导出单例对象
export default g