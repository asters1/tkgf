// src/common/global.js

const g = {
	"index": 0,
	"status": 0,
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
	"requests": function(obj) {




	}
}

// 导出单例对象
export default g