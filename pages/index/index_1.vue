<template>
	<view class="content">
		
		<cover-view class="nameBox flexBox flexBetween flexHeightCenter" v-if=" data.showWebView == false && data.showMap == false ">
			<view style="font-size:20px;">某某便民地图</view>
			<view style="font-size:14px;font-weight: normal;" @click=" showClearMap(1) ">返回</view>
		</cover-view>
		<cover-view class="searchBox flexBox flexHeightCenter " v-if=" data.showWebView == false">
			<uni-icons type="search" color="" style="margin-right:20upx"></uni-icons>
			<input class="searchInput" type="text" v-model=" data.searchContent " placeholder="请输入机构或事项名称" @focus="focusInput" @input="getValue" disabled="true" @click="tapSearchInput"/>
			<!-- <view class="searchBtn fontSize14" @click="tapSearchBtn">搜索</view> -->
		</cover-view>
		<cover-view class="searchList" v-if=" data.showWebView == false && data.showMap == false ">
			<view class="listName" v-for="(item,index) in searchList" :key="index" @click=" tapSearchList(index) ">{{item.name}}</view>
		</cover-view>
		<map class="map" :style="{'display':(data.showMap?'':'none')}" :latitude="data.latitude" :longitude="data.longitude" :markers="data.covers" @markertap="markertaps" v-if=" data.showWebView == false "></map>
		<web-view class="web_view" :src="data.openMapUrl" v-if="data.showWebView"></web-view>
		<cover-view class="listBox" :style="{'height':data.ListHeight}" v-if=" data.showBottomList ">
			<cover-view class="iconTopBox" @click=" tapListIcon(1) "><uni-icons :type="data.ListIcon" style="font-weight: bold;"></uni-icons></cover-view>
			<cover-view class="list flexBox flexBetween flexWap" v-for="(item,index) in addrJson" :key="index">
				<view class="leftBox">
					<view class="title overflow_one">{{item.name}}</view>
					<view class="contents overflow_one">{{item.details}}</view>
					<view class="telBox flexBox flexHeightCenter">
						<uni-icons type="phone" color="rgba(0,0,0,0.6)"></uni-icons>
						<view class="telNumber">{{item.tel}}</view>
					</view>
				</view>
				<view class="rightBox" @click=" tapRightHere( index ) ">
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
	.content .listBox .list{width: 90%;margin-left: 2.5%;padding:2.5%;border-bottom: 2upx solid rgba(0,0,0,0.2);}
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
	import addrJson from "../../json_addr"
	export default {
		data() {
			return {
				data:{
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
					covers: [
						{
							id:1,
							latitude: 29.550259,
							longitude: 106.572294,
							iconPath: '/static/icon_addr.png',
						},
						{
							id:2,
							latitude: 39.90,
							longitude: 116.39741,
							iconPath: '/static/icon_addr.png',
						},
					],
				},
				searchList:[
					{name:"核酸检测采样点"},
				],
				addrJson:[],
			}
		},
		onLoad() {
			this.AjaxLoad()
		},
		methods: {
			AjaxLoad:async function(){
				uni.showLoading()
				this.addrJson = addrJson.addr
				var that = this;
				var ownAddr = await new Promise( (resolve,rej)=>{
					uni.getLocation({
						type: 'gcj02',
						success: function (res) {
							uni.hideLoading()
							that.data.latitude  = res.latitude
							that.data.longitude  = res.longitude
							resolve()
						}
					})
				})
			},
			markertaps(e){
				var arrIndex = ""
				for (var i = 0; i < this.data.covers.length; i++) {
					if( this.data.covers[i].id == e.detail.markerId )arrIndex = i
				}
				console.log( e );
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
				console.log( this.data.searchContent )
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
			tapRightHere(index){
				this.data.showWebView = true
				this.data.showMap = false
				this.data.showBottomList = false
				this.data.openMapUrl = "https://apis.map.qq.com/tools/routeplan/eword="+this.addrJson[index].details+"?referer=myapp&key=VHFBZ-XGVL3-M3H34-3JYI2-5ZHH3-ZNFCW"
			},
			tapSearchList(index){
				this.data.searchContent = this.searchList[index].name
				this.data.showMap = true
				this.data.ListHeight = "800upx"
				this.data.ListIcon = "arrowdown"
				this.data.showBottomList = true
			},
			
			
			
			
			
			
			
		}
	}
</script>