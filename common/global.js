// src/common/global.js

const g = {
	"index": 0,
	"status": 0,
	"CacheDir":"",
	"ShowText": function(text) {
		console.log(text)
		uni.showToast({
			title: text,
			icon: 'none'
		});
	},
	"getCachePath": function() {
		const main = plus.android.runtimeMainActivity();
		const path = main.getExternalCacheDir().toString();

		this.ShowText('外部缓存目录:' + path);
		return path;
	},
	"MkdirAll": function(Path) {
		return new Promise((resolve, reject) => {
			try {
				const File = plus.android.importClass('java.io.File');
				const dir = new File(Path);

				if (dir.exists()) {
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
	"w_file": function(filePath, content) {
		// g.ShowText("==")
		g.ShowText(filePath)
		// g.ShowText("==")
		// 文件不存在，先创建文件再写入
		const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
		const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
	   // 获取沙箱目录路径
	     filePath = plus.io.convertLocalFileSystemURL(filePath);
	    
	    plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {
	        fs.root.getFile(filePath, { create: true }, function(fileEntry) {
	            fileEntry.createWriter(function(writer) {
	                writer.onwriteend = function(e) {
	                    console.log('写入成功');
	                };
	                writer.onerror = function(e) {
	                    console.error('写入失败：' + e.toString());
	                };
	                writer.write('你要写入的内容');
	            });
	        });
	    });

	},
	"requests": function(obj) {




	}
}

// 导出单例对象
export default g