<template>
	<view class="content">
		<cover-view class="nameBox flexBox flexBetween flexHeightCenter">
			<view style="font-size:20px;">核酸检测地图</view>
		</cover-view>
		
		<cover-view class="searchList" v-if=" data.showWebView == false && data.showMap == false ">
			<view class="listName" v-for="(item,index) in searchList" :key="index" @click=" tapSearchList(index) ">{{item.name}}</view>
		</cover-view>
		<map class="map" :scale="data.scale" :style="{'display':(data.showMap?'':'none')}" :latitude="data.latitude" :longitude="data.longitude" :markers="data.covers" @touchmove="moveMap" @markertap="markertaps" v-if=" data.showWebView == false "></map>
		<web-view class="web_view" :src="data.openMapUrl" v-if="data.showWebView"></web-view>
		<cover-view class="listBox" :style="{'height':data.ListHeight}" v-if=" data.showBottomList ">
			<cover-view class="iconTopBox" @click=" tapListIcon(1) "><uni-icons :type="data.ListIcon" style="font-weight: bold;"></uni-icons></cover-view>
			<cover-view class="list flexBox flexBetween flexWap" v-for="(item,index) in addrJson" :key="index">
				<view class="leftBox">
					<view class="title overflow_one" :style="{color:item.color}">{{item.name}}</view>
					<view class="contents overflow_one">{{item.details}}</view>
					<view class="telBox flexBox flexHeightCenter">
						<uni-icons type="phone" color="rgba(0,0,0,0.6)"></uni-icons>
						<view class="telNumber overflow_one">{{item.tel}}</view>
					</view>
				</view>
				<view class="rightBox" @click=" tapRightHere( item,index ) ">
					<view class="flexBox flexCenter">
						<uni-icons type="paperplane" color="white" style="width: 40upx;height:40upx;line-height: 40upx;padding:15upx;border-radius: 100upx;background: rgb(77,132,224)"></uni-icons>
					</view>
					<view class="toName">到这儿去</view>
				</view>
			</cover-view>
		</cover-view>
		
	</view>
</template>
<style>
	/deep/.uni-cover-view{font-size: 20px;}
	/deep/.uni-input-placeholder,.input-placeholder{font-size: 14px;}
	/* /deep/.csssprite{max-width:152px !important;width:152px !important;} */
	/* /deep/.csssprite{animation: changeUserIcon 3s linear infinite;} */
	/* @keyframes changeUserIcon { */
		/* from {transform:scale(0.7);} */
		/* to {transform:scale(0.8);} */
	/* } */
	.content {}
	.content .map{width:100%;min-height:100vh}
	.content .web_view{width: 100%;height:100%;background: white;}
	/* .content .map{width:100%;min-height:100vh;display:none} */
	.content .nameBox{width:90%;margin-left: 2.5%;padding: 2.5%;position: absolute;top:50upx;z-index: 2;border-radius: 10upx;color:rgb(156,220,254);font-weight: bold;}
	.content .searchList{width:90%;margin-left: 2.5%;padding: 2.5%;position: absolute;top:250upx;z-index: 2;border-radius: 10upx;}
	.content .searchList .listName{padding:40upx 0;margin-bottom:0upx;font-size: 14px;border-bottom: 2upx solid rgba(0,0,0,0.2);}
	.content .searchBox{width:90%;margin-left: 2.5%;padding: 2.5%;border: 2upx solid rgba(0,0,0,0.2);position: absolute;top:150upx;z-index: 2;border-radius: 10upx;background: white;}
	.content .searchBox .searchInput{width: 75%;margin-right: 5%;}
	.content .listBox{overflow-y: scroll !important;}
	.content .listBox .list{width: 100%;margin-left: 2.5%;padding:2.5%;border-bottom: 2upx solid rgba(0,0,0,0.2);}
	.content .listBox .list .leftBox{width: 70%;}
	.content .listBox .list .rightBox{width: 30%;}
	.content .listBox .list .leftBox .title{width:100%;font-weight: bold;font-size:16px;}
	.content .listBox .list .leftBox .contents{width: 100%;margin:20upx 0 30upx 0;color:rgba(0,0,0,0.6);font-size: 14px;}
	.content .listBox .list .leftBox .telNumber{color:rgba(0,0,0,0.6);font-size: 14px;}
	.content .listBox .list .rightBox .toName{width: 100%;margin-top: 20upx;font-size: 14px;text-align: center;}
	.content .listBox{width:100%;position: absolute;bottom:0upx;z-index: 2;background: white;}
	.content .listBox .iconTopBox{width: 100%;height: 100upx;line-height: 100upx;text-align: center;}
</style>
<script>
	import addrJson from "../../json_addr_fromPython"
	export default {
		data() {
			return {
				data:{
					del:"",
					searchContent:"",
					showWebView:false,
					showMap:true,
					// openMapUrl:"https://apis.map.qq.com/tools/routeplan/eword=故宫博物馆&epointx=116.39710&epointy=39.917200?referer=myapp&key=VHFBZ-XGVL3-M3H34-3JYI2-5ZHH3-ZNFCW",
					// openMapUrl:"https://apis.map.qq.com/tools/routeplan/eword=故宫博物馆?referer=myapp&key=VHFBZ-XGVL3-M3H34-3JYI2-5ZHH3-ZNFCW",
					openMapUrl:"",
					ListHeight:"100upx",
					ListIcon:"arrowup",
					showBottomList:true,
					latitude:"",
					longitude:"",
					userLatitude:"",
					userLongitude:"",
					scale:12,
					clickList:false,
					covers: [
						// {
						// 	id:1,
						// 	width:25,
						// 	height: 30,
						// 	latitude:39.928353,
						// 	longitude: 116.416357,
						// 	iconPath: '/static/icon_addr.png',
						// },
					],
				},
				searchList:[
					{name:"东城区常态化核酸检测采样点"},
				],
				addrJson:[],
				twoFinger:false,
			}
		},
		onLoad() {
			this.AjaxLoad()
			
			var that = this;
			setInterval(function(){
				that.data.scale = 12
			},50)
			
			
		},
		methods: {
			whichPhone(){
				let u = navigator.userAgent;
				let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
				let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
				if(isAndroid) {
					
				}else if(isIOS) {
					
				}
			},
			AjaxLoad:async function(){
				uni.showLoading()
				var that = this;
				this.addrJson = addrJson.addr
				var ownAddr = await new Promise( (resolve,rej)=>{
					uni.getLocation({
						type: 'gcj02',
						isHighAccuracy:true,
						success: function (res) {
							uni.hideLoading()
							that.data.userLatitude  = res.latitude
							that.data.userLongitude  = res.longitude
							that.data.latitude   = 39.928353
							that.data.longitude  = 116.416357
							// that.data.latitude   = res.latitude
							// that.data.longitude  = res.longitude
							let obj = {
								id:10000,
								width:15,
								height: 15,
								latitude:res.latitude,
								longitude:res.longitude,
								iconPath:'/static/icon_user.png',
							}
							that.data.covers.push( obj )
							that.whichPhone();
							resolve()
						}
					})
				})
				for (var i = 0; i < this.addrJson.length; i++) {
					this.data.covers.push({
						width:25,
						height: 30,
						id:this.addrJson[i].id,
						latitude:this.addrJson[i].latitude,
						longitude:this.addrJson[i].longitude,
						iconPath:'/static/icon_addr.png',
						// iconPath:"",
						// callout: {
						// 	borderRadius: 10,
						// 	padding: 10,
						// 	bgColor: '#CDDFF3',
						// 	color: '#f00',
						// 	fontSize: 10,
						// 	content: this.addrJson[i].details+"检测点",
						// }
					})
				}
			},
			markertaps(e){
				if( this.data.twoFinger )return;
				var arrIndex = "",clickThis = {}
				for (var i = 0; i < this.addrJson.length; i++) {
					this.addrJson[i].color = ""
					if( this.addrJson[i].id == e.detail.markerId ){
						arrIndex = i
					}
				}
				this.data.ListHeight = "800upx"
				this.data.ListIcon = "arrowdown"
				clickThis = this.addrJson[arrIndex]
				this.addrJson.splice(arrIndex,1)
				var addtList = this.addrJson
				addtList.unshift( clickThis )
				this.addrJson[0].color = "rgb(124,97,180)"
				// console.log(arrIndex);
				
				this.data.del = this.data.twoFinger
				
				
				// 
				
				// for (var i = 0; i < this.data.covers.length; i++) {
				// 	if( this.data.covers[i].id == e.detail.markerId ){
				// 		arrIndex = i
				// 	}
				// }
				// this.data.ListHeight = "800upx"
				// this.data.ListIcon = "arrowdown"
				// clickThis = this.addrJson[arrIndex]
				// this.addrJson.splice(arrIndex,1)
				// var addtList = this.addrJson
				// addtList.unshift( clickThis )
				// console.log(arrIndex);
				// return;
				// this.tapRightHere( this.addrJson[arrIndex] , arrIndex );
				//这里可能要跳转
			},
			showClearMap(e){
				var that = this;
				if( e == 1 ){
					uni.showLoading()
					that.data.showMap = true
					setTimeout(function(){
						uni.hideLoading()
					},500)
					this.data.showBottomList = true
				}else if( e == 2 ){
					this.data.showMap = false
					this.data.ListHeight = "100upx"
					this.data.ListIcon = "arrowup"
					this.data.showBottomList = false
				}
			},
			tapSearchBtn(){
				// console.log( this.data.searchContent )
			},
			focusInput(e){
				this.showClearMap(2)
			},
			getValue(e){
				this.showClearMap(2)
				if( e.detail.value == "" ){
					this.showClearMap(1)
				}
			},
			tapSearchInput(){
				this.showClearMap(2)
			},
			tapListIcon(e){
				if( e == 1 ){
					if( this.data.ListIcon == "arrowdown" ){
						this.data.ListHeight = "100upx"
						this.data.ListIcon = "arrowup"
					}else{
						this.data.ListHeight = "800upx"
						this.data.ListIcon = "arrowdown"
					}
				}else if( e == 2 ){
					
				}
			},
			tapRightHere(item,index){
				var that = this;
				this.data.showWebView = true
				this.data.showMap = false
				this.data.showBottomList = false
				location.href = "//uri.amap.com/marker?markers="+item.longitude+","+item.latitude+","+item.details+"&src=mypage&callnative=1"
				// location.href = "https://uri.amap.com/navigation?from="+this.data.userLatitude+","+this.data.userLongitude+",起点&to="+item.longitude+","+item.latitude+","+item.details+"&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0"
				
				
				// location.href = "https://uri.amap.com/marker?position="+item.longitude+","+item.latitude+"&name="+item.details+"&src=mypage&coordinate=gaode&callnative=0"
				
				// window.location = "https://uri.amap.com/marker?markers="+item.longitude+","+item.latitude+""+"&src=mypage&callnative=1"
				// location.href = "//uri.amap.com/marker?markers="+item.longitude+","+item.latitude+","+item.details+"&src=mypage&callnative=1"
				// https://uri.amap.com/marker?position=116.473195,39.993253,广渠门桥西北角（报刊亭边）&src=mypage&callnative=1&innersrc=uriapi
				
				
				// "//uri.amap.com/marker?markers="+item.longitude+","+item.latitude+","+item.details+"&src=mypage&callnative=1"
				
				// this.data.openMapUrl = "//uri.amap.com/navigation?from="+that.data.userLongitude+","+that.data.userLatitude+"&to="+item.longitude+","+item.latitude+",endpoint="+item.details+"&midwaypoint&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0"
				// this.data.openMapUrl = "https://uri.amap.com/marker?position="+item.longitude+","+item.latitude+"&name="+item.details+""
				// this.data.openMapUrl = "https://apis.map.qq.com/tools/routeplan/eword="+this.addrJson[index].details+"?referer=myapp&key=VHFBZ-XGVL3-M3H34-3JYI2-5ZHH3-ZNFCW"
				// this.data.openMapUrl = "https://uri.amap.com/marker?position=116.416357,39.925353"
				// this.data.openMapUrl = "https://uri.amap.com/marker?position=116.473195,39.993253"
			},
			tapSearchList(index){
				for (var i = 0; i < this.data.covers.length; i++) {
					if( i !== 0 ){
						this.data.covers[i].iconPath = '/static/icon_addr.png'
					}
				}
				this.data.searchContent = this.searchList[index].name
				this.data.showMap = true
				// this.data.ListHeight = "800upx"
				// this.data.ListIcon = "arrowdown"
				this.data.showBottomList = true
				this.data.clickList = true
			},
			tapCover(e){
				console.log(e.id)
			},
			moveMap(e){
				if ( e.touches.length >= 2 ){
					this.data.twoFinger = true
				}else{
					this.data.twoFinger = false
				}
			}
			
			
			
			
		}
	}
</script>