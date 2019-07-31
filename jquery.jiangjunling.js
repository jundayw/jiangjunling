/**
* jiangjunling.js
* https://github.com/jundayw/jiangjunling
*
* 将军令
* @Author:Mr.Alex
* @Email:<mail@wangqiqiang.com>
* @version:1.0.0
* @date:2019-07-31 18:00:07
* @demo:
* <span class="warp">
*		<span class="qrcode"></span>
*		<span class="mask"></span>
*		<span class="text"></span>
* </span>
* $('.qrcode').JiangJunLing();
*/
(function(window,$,underfind){
	$.fn.JiangJunLing = function(option,callback){
		var that = this;
		var config = {
			app_id:'unknown',
			token:'',
			time:60,
			// JiangJunLing 中心接口地址
			url:'http://www.baidu.com/api.do?app_id={APP_ID}&token={TOKEN}&_t={_T}',
			// 状态监听地址
			monitor:'http://console.me.yunduanchongqing.com/qrcode.php',
			// 认证成功通知地址
			notice:'http://www.baidu.com/',
			qrcode:{
				text:'',
				render:'canvas',// table/canvas
				width:180,
				height:180,
				background:'#ffffff',
				foreground:'#000000'
			},
			warp:{
				selector:'.warp',
				style:{
					display:'block',
					position:"relative",
					overflow:'hidden'
				}
			},
			mask:{
				selector:'.mask',
				style:{
					position:"absolute",
					width:'100%',
					height:'100%',
					background:'#ffffff',
					opacity:0.95,
					top:0,
					left:0
				}
			},
			text:{
				selector:'.text',
				style:{
					position:"absolute",
					width:'100%',
					fontWeight:700,
					textAlign:'center',
					color:'#3c3c3c',
					top:0,
					left:0
				}
			},
			transform:function(data)
			{
				return data;
			},
			debug:false
		};
		
		var timer = null;
		
		var option = $.extend(true,config,option);
		
		option.warp.style.width = option.qrcode.width;
		option.warp.style.height = option.qrcode.height;
		
		option.text.style.paddingTop = [option.qrcode.height/3,'px'].join('');
		option.text.style.lineHeight = [option.qrcode.height/3,'px'].join('');
		option.text.style.fontSize = [option.qrcode.height/12,'px'].join('');
		
		this.option = function(){
			return option;
		};
		
		this.show = function(){
				console.log('show');
				
				option.qrcode.text = option.url;
				option.token = this.random();
				
				option.qrcode.text = option.qrcode.text.replace('{APP_ID}',option.app_id);
				option.qrcode.text = option.qrcode.text.replace('{TOKEN}',option.token);
				option.qrcode.text = option.qrcode.text.replace('{_T}',new Date().valueOf());
				$(this.selector).html('').qrcode(option.qrcode);
				
				timer = window.setTimeout(function(){
					console.log('show-setTimeout');
					that.show();
				},option.time * 1000);
		};
		
		this.random = function(){
			return [Math.random().toString(36).substr(2),Math.random().toString(36).substr(2)].join('');
		}
		
		this.listener = function(){
				console.log('listener');
				
				$.ajax({
					type:'GET',//Get or Post
					url:option.monitor,
					//async:true,//false
					//cache:true,//false
					data:{token:option.token},
					//timeout: 1000,
					dataType:'json',// html xml json text
					beforeSend:function(XMLHttpRequest){},
					success:function(data,textStatus){
						console.log('ajax-success');
						data = option.transform(data);
						return that.response(data.action,data,that);
					},
					complete:function(XMLHttpRequest,textStatus){},
					error:function(XMLHttpRequest,textStatus,errorThrown){
						console.log('ajax-error');
						return that.response('ERROR',textStatus,that);
					}
				});
				
				timer = window.setTimeout(function(){
					console.log('listener-setTimeout');
					that.listener();
				},1000);
		};
		
		this.response = function(action,data,scope){
			console.log('response')
			
			if( action === 'ERROR' )
			{
				$(option.mask.selector).show();
				
				$(option.text.selector).show().html(data);
				
				return false;
			}
			
			callback = callback === undefined ? this.callback : callback;
			
			return callback(data.action,data,that);
		};
		
		this.callback = function(action,data,that){
			console.log(data);
			
			if( action === 'WAIT' )
			{
				$(option.mask.selector).hide();
				
				$(option.text.selector).hide().html('');
				
				return;
			}
			
			$(option.mask.selector).show();
			
			$(option.text.selector).show().html(data.message);
			
			if( action === 'SUCCESS' )
			{
				return that.redirect();
			}
			
			return false;
		};
		
		this.init = function(){
			$(option.warp.selector).css(option.warp.style);
			$(option.mask.selector).css(option.mask.style).hide();
			$(option.text.selector).css(option.text.style).hide();
			
			this.show();
			
			return option.debug ? this.debug() : this.listener();
		};
		
		this.debug = function(){
			window.setTimeout(function(){
				$(option.mask.selector).show();
				$(option.text.selector).show();
				$(option.text.selector).html('136276... 扫描成功');
			},3000);
			window.setTimeout(function(){
				$(option.mask.selector).show();
				$(option.text.selector).html('登录成功');
			},5000);
			window.setTimeout(function(){
				that.redirect();
			},7000);
		};
		
		this.redirect = function(){
			var url = option.notice.indexOf('?') === -1 ? [option.notice,'?'].join('') : option.notice;
				url = [url,'token','=',option.token].join('');
				window.location.href = url;
		};
		
		this.init();
	};
})(window,jQuery);