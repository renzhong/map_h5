let userToken = () => {
	var info = ""
	try {
	    const value = uni.getStorageSync("userInfo");
	    if (value) {
			info = value
	    }
	}catch(e){}
	return info
}

const request = (urls,data) => {
	let httpDefaultOpts = {
		url: "https://coffee.sayyin.com/apicloud/" + urls,
		data: data,
		method:'post',
		header:{
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		dataType: 'json',
	}
	let promise = new Promise(function(reslove,reject){
		uni.request(httpDefaultOpts).then((res) =>{
			let data = res[1]
			if( data.data.status == 200 ){
				reslove(data.data)
			}else if( data.data.mess == "缺少用户令牌" || data.data.mess == "身份验证失败" ){
				uni.showToast({icon:"none",title:"请先登录"})
				setTimeout(function(){
					uni.navigateTo({
						url:"/pages/login/login"
					})
				},1500)
			}else if( data.data.status == 400 ){
				reslove(data.data)
			}else if( data.data.status == 402 ){
				uni.showToast({icon:"none",title:"请先设置登录密码"})
				setTimeout(function(){
					uni.navigateTo({
						url:"/pages_mine/pages/setting/setting.vue"
					})
				},1500)
			}
			// else if( data.data.status == 1004 ){
			// 	uni.showToast({icon:"none",title:data.data.mess})
			// 	uni.navigateTo({
			// 		url:"/pages/login/login"
			// 	})
			// }else if( data.data.status == 1006 ){
			// 	uni.showToast({icon:"none",title:data.data.mess})
			// 	uni.navigateTo({
			// 		url:"/pages/login/login"
			// 	})
			// }else{
			// 	// uni.showToast({icon:"none",title:data.data.mess})
			// 	reslove(data)
			// }
		})
	})
	return promise
}
export default {request,userToken};