// src/common/global.js

const g = {
	"icon_index": 0,
	"debug": true,
	"pulic_tiku_dir": "/storage/emulated/0/Download/000TiKu",


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
	"MkdirAll": function(Path) {
		return new Promise((resolve, reject) => {
			try {
				const File = plus.android.importClass('java.io.File');
				const dir = new File(Path);

				if (dir.exists()) {
					g.log("文件夹已存在！！")
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
	"delete_file": function(filePath) {
		return new Promise((resolve, reject) => {
			plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
				entry.remove(() => {
					resolve('文件删除成功');
				}, (error) => {
					reject('删除文件失败: ' + error.message);
				});
			}, (error) => {
				reject('获取文件失败: ' + error.message);
			});
		});
	},
	"W_file": function(filePath, content) {
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
	"R_file": async function(filePath) {
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
	"get_tks_path": function(targetDir) {
		return new Promise((resolve, reject) => {
			// 构建目标目录路径
			// const targetDir = '_documents/tiku'; // 使用相对路径更安全

			plus.io.resolveLocalFileSystemURL(targetDir, (dirEntry) => {
				const directoryReader = dirEntry.createReader();

				directoryReader.readEntries((entries) => {
					const jsonFiles = entries.filter(entry => {
						return entry.isFile && entry.name.endsWith('.json');
					}).map(fileEntry => {
						return {
							name: fileEntry.name,
							fullPath: fileEntry.fullPath,
							nativeURL: fileEntry.toLocalURL()
						};
					});

					resolve(jsonFiles);
				}, (error) => {
					reject('读取目录内容失败: ' + error.message);
				});
			}, (error) => {
				if (error.code === 1) { // NOT_FOUND_ERR
					resolve([]); // 目录不存在返回空数组
				} else {
					reject('访问目录失败: ' + error.message);
				}
			});
		});
	},
	"mv_file": function(oldPath, newPath) {

		return new Promise((resolve, reject) => {
			plus.io.resolveLocalFileSystemURL(oldPath, (entry) => {
					plus.io.resolveLocalFileSystemURL(newPath.substring(0, newPath.lastIndexOf(
							'/') + 1),
						(dirEntry) => {
							entry.moveTo(dirEntry, newPath.substring(newPath.lastIndexOf('/') +
									1),
								(newEntry) => {
									resolve(newEntry.toLocalURL());
								},
								(error) => {
									reject('移动文件失败: ' + error.message);
								}
							);
						},
						(error) => {
							reject('获取目标目录失败: ' + error.message);
						}
					);
				},
				(error) => {
					reject('获取源文件失败: ' + error.message);
				});
		});
	},
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
								saveRes.savedFilePath,
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