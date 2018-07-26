//requestAnimationFrame兼容写法
window.requestAnimationFrame = window.requestAnimationFrame||function(fn){
	return setTimeout(fn,1000/60);
}
window.cancelAnimationFrame = window.cancelAnimationFrame||clearTimeout;
(function(){
	var oBox = document.getElementById("box");
	var oWrap = document.getElementById("wrap");
	var leave = oWrap.getElementsByTagName("div");
	var oScore = document.getElementById("score");
	var length = leave.length;
	var boxTop = oBox.offsetTop;
	var boxLeft = oBox.offsetLeft;
	var oBreak = document.getElementById("break");
	//var oBreak = document.getElementsByTagName("i")[0];
	oBox.score = 0;
	//禁止选中禁止拖拽
	(function(){
		document.onselectstart = function(){
			return false;
		}
		document.ondrag = function(){
			return false;
		}
	})();
	//初始化
	init();
	function init(){
		var arrImg = ["bg_1.jpg","bg_2.jpg","bg_3.jpg","bg_4.jpg"];
		for(var i=0;i<length;i++){
			(function(i){
				leave[i].onclick = function(e){
					oWrap.innerHTML = "";
					oScore.style.display = "block";
					oWrap.style.backgroundImage = "url(images/"+arrImg[i]+")";
					(function bgMove(){
						oWrap.bgPosY = oWrap.bgPosY || 0;
						oWrap.bgPosY++;
						oWrap.style.backgroundPositionY = oWrap.bgPosY + "px";
						oWrap.bgTimer = requestAnimationFrame(bgMove);
					})();
					var e = e || window.event;
					var cX = e.clientX - boxLeft;
					var cY = e.clientY - boxTop;
					var client = {x:cX,y:cY};
					creatPlane(client,i);
				};
			})(i)
		}
	};
	//reset按钮点击
	(function reset(){
		var oREset = document.getElementById("reset");
		var oFinal = document.getElementById("final");
		oREset.onclick = function(){
			oBox.score = 0;
			oScore.innerHTML = 0;
			oFinal.style.display = "none";
			cancelAnimationFrame(oWrap.bgTimer)
			oWrap.innerHTML = '<h3 class="title">AirplaneGameV1.0</h3>'+
					    	'<div class="d1">简单模式</div>'+
					    	'<div class="d2">中等模式</div>'+
					    	'<div class="d3">困难模式</div>'+
					    	'<div class="d4">极速模式</div>'
			init();//重新初始化
		}
	})();
	//生成我军飞机
	function creatPlane(client,i){
		var Img = new Image();
		Img.className = "plane";
		Img.src = "images/plane_1.png";
		Img.width = 100;
		Img.height = 90;
		oWrap.appendChild(Img);
		Img.style.top = client.y - Img.height/2 + "px";
		Img.style.left = client.x - Img.width/2 + "px";
		var maxTop = oWrap.offsetHeight - Img.height/2;
		var minTop = 0;
		var maxLeft = oWrap.offsetWidth - Img.width/2;
		var minLeft = -Img.offsetHeight/2;
		document.onmousemove = function(e){
			e = e || window.event;
			var left = e.clientX -  boxLeft- Img.width/2;
			var top = e.clientY - boxTop - Img.height/2;
			left = Math.min(left,maxLeft);
			left = Math.max(left,minLeft);
			top = Math.min(top,maxTop);
			top = Math.max(top,minTop);
			Img.style.left = left + "px";
			Img.style.top = top + "px";
		}
		creatBullet(Img,i);//生成子弹
		createEnemy(Img,i);//生成敌军
	}
	//生成子弹
	function creatBullet(plane,i){
		var t = false;
		oWrap.bulletTimer = setInterval(function(){
			if(oBox.score<300){
				//改变敌军速度数量和速度
				createEnemy.time = [300,260,200,100][i];
				createEnemy.speed = [Math.random()+4,Math.random()+5,Math.random()+6,Math.random()+7][i];
				t = false;
				//改变子弹数量
				bullet(plane,i,t,0);
				
			}else if(oBox.score<600){
				t = true;
				createEnemy.time = [240,200,140,80][i];
				createEnemy.speed = [Math.random()+5,Math.random()+6,Math.random()+7,Math.random()+8][i];
				plane.src = "images/plane_0.png";
				bullet(plane,i,t,-1);
				bullet(plane,i,t,1);
			}else{
				t = true;
				createEnemy.time = [220,180,120,60][i];
				createEnemy.speed = [Math.random()+6,Math.random()+7,Math.random()+8,Math.random()+9][i];
				bullet(plane,i,t,-1);
				bullet(plane,i,t,0);
				bullet(plane,i,t,1);
			}
		},[100,130,150,30][i]);
		//生成子弹
		function bullet(plane,i,t,num){
			 	var Bimg = new Image();
    			Bimg.className = "bullet";
    			Bimg.src = "images/fire.png";
    			Bimg.width = 30;
    			Bimg.height = 30;
    			oWrap.appendChild(Bimg);
    			var top = plane.offsetTop - Bimg.height/2;
    			var left = plane.offsetLeft + plane.width/2 - Bimg.width/2;
    			if(t){
    				left += Bimg.width*num;
    				if(num){
    					top += Bimg.height;
    				}
    			}
    			Bimg.style.top = top + "px";
    			Bimg.style.left = left + "px";
    			//子弹运动
    			function m(){
    				var top = Bimg.offsetTop;
    				top -= 30;
    				if(top<-Bimg.height){
    					oWrap.removeChild(Bimg);
    				}else{
    					Bimg.style.top = top + "px";
	    				Bimg.timer = requestAnimationFrame(m);
    				}
    			}
    			setTimeout(function(){
    				Bimg.timer = requestAnimationFrame(m);
    			},20);
		}
	};
	//生成敌机
	function createEnemy(plane,i){
			createEnemy.time = [300,260,200,100][i];//产生敌军的时间间隔
			var num = 1;
			oWrap.enemyTimer = setInterval(function(){
			var index = num%30?1:0;//每生成30架小飞机时生成一架大boss
			var ePlane = new Image();
			ePlane.index = index;
			ePlane.blood = [20,1][index];//小飞机血量为0，大boss血量为
			ePlane.src = "images/enemy_"+["big","small"][index]+".png";
			ePlane.width = [80,50][index];
			ePlane.height = [60,40][index];
			oWrap.appendChild(ePlane);
			var top = -ePlane.height;
			var left = Math.random()*oWrap.offsetWidth;
			left = Math.min(left,oWrap.offsetWidth-ePlane.width);
			ePlane.style.top = top + "px";
			ePlane.style.left = left +"px";
			ePlane.className = "enemy";
			num++;
			//敌军速度
			createEnemy.speed = [Math.random()+4,Math.random()+5,Math.random()+6,Math.random()+7][i];
			//敌军运动
			function m(){
				ePlane.style.top = ePlane.offsetTop + createEnemy.speed + "px";
				if(ePlane.offsetTop>oWrap.offsetHeight){//超出范围，清除敌机
					//逃过一架小敌机分数减一，逃过大boss分数减10
					index?oBox.score--:oBox.score -= 10; 
					oWrap.removeChild(ePlane);
						
				}else{
					//检测子弹与敌军撞击
					var aBullet = getClass("bullet");
					for(var i=0;i<aBullet.length;i++){//从后往前遍历
						if(coll(ePlane,aBullet[i])){
							//让子弹停止运动
							cancelAnimationFrame(aBullet[i].timer);
							oWrap.removeChild(aBullet[i]);//移除子弹
							ePlane.blood--;
							if(!ePlane.blood){//血量为0时爆炸
								oBox.score += [10,1][index];
								oScore.innerHTML = oBox.score;
			    				boom(ePlane.width,ePlane.height,ePlane.offsetTop,ePlane.offsetLeft,ePlane.index);//生成敌军爆炸图
			    				if(ePlane.parentNode){
			    					oWrap.removeChild(ePlane);//移除敌军
			    				}
			    				return;
							}
						}
					}
					//检测敌军与我军飞机撞击
					if( plane.parentNode && coll(plane,ePlane )){
						boom(ePlane.width,ePlane.height,ePlane.offsetTop,ePlane.offsetLeft,ePlane.index);//生成敌军爆炸图
						var src = plane.src;
						if(src.match("plane_1")){
							boom(plane.width,plane.height,plane.offsetTop,plane.offsetLeft,2);//生成我军爆炸图
						}else{
							boom(plane.width,plane.height,plane.offsetTop,plane.offsetLeft,3);//生成我军爆炸图
						}
						
						oWrap.removeChild(plane);//移除敌机
						oWrap.removeChild(ePlane);//移除我机
						setTimeout(gameover,2000); //游戏结束
						document.onmousemove = null;//清除鼠标移动事件
						return;
					}
					requestAnimationFrame(m);
				}
			}
			requestAnimationFrame(m);
		},createEnemy.time);
	}
	//碰撞检测
	function coll(obj1,obj2){
		var L1 = obj1.offsetLeft,
			T1 = obj1.offsetTop,
			R1 = L1 + obj1.offsetWidth,
			B1 = T1 + obj1.offsetHeight;
		var L2 = obj2.offsetLeft,
			T2 = obj2.offsetTop,
			R2 = L2 + obj2.offsetWidth,
			B2 = T2 + obj2.offsetHeight;
		//未碰撞时返回false，碰撞返回true
		return !( R1<L2 || B1<T2 || L1>R2 || T1>B2 );
	}
	//生成爆炸图片
	function boom(w,h,t,l,i){
		var boomImg = new Image();
		boomImg.src = "images/"+["boom_big","boom_small","plane_1","plane_0"][i]+".png";
		boomImg.width = w;
		boomImg.height = h;
		boomImg.className = ["boom","boom","oPlane","oPlane"][i];
		boomImg.style.top = t + "px";
		boomImg.style.left = l + "px";
		oWrap.appendChild(boomImg);
		setTimeout(function(){//图片存在于DOM里面是才清除
			boomImg.parentNode && oWrap.removeChild(boomImg);
		},[1000,1000,3000,3000][i]);
	}
	//游戏结束
	var initScore = getCookie("sco");//先获取cookie
	setCookie({score:initScore},1000);//设置cookie
	function gameover(){
		var oFinal = document.getElementById("final");
		var oTotal = document.getElementById("total");
		var oHonor = document.getElementById("honor");
		var oHistory = document.getElementById("history");
		
		clearInterval(oWrap.bulletTimer);//停止子弹生成
		clearInterval(oWrap.enemyTimer);//停止敌机生成
		oScore.style.display = "none";
		oFinal.style.display = "block";
		oTotal.innerHTML = oBox.score;
		var honor;
		var score = oBox.score;
		if(score<-10){
			honor = "小菜鸡";
		}else if(score<100){
			honor = "新手";
		}else if(score<300){
			honor = "初级战士";
		}else if(score<600){
			honor = "中级战士";
		}else if(score<1000){
			honor = "高级战士";
		}else if(score<1500){
			honor = "无敌炮手";
		}else if(score<2000){
			honor = "超神战士";
		}else if(score<5000){
			honer = "无敌";
		}else{
			honer = "孤独求败";
		}
		oHonor.innerHTML = honor;
		//得到上次cookie
		var s=getCookie("score");
		if(oBox.score>s){
			//破纪录
			(function(){
			var t=20;
			function m(){
				var top = oBreak.offsetTop;
				top += t;
				t += 15;
				if(top>200){
					oBreak.style.top = 200 + "px";
					cancelAnimationFrame(m.timer);
				}else{
					oBreak.style.top = top + "px";
					m.timer = requestAnimationFrame(m);
				}
			}
			m.timer = requestAnimationFrame(m);
			setTimeout(function(){
				var top = oBreak.offsetTop;
				function k(){
					top -= t;
					t -= 15;
					if(top<=-160){
						oBreak.style.top = -160 + "px";
						cancelAnimationFrame(k.timer);
					}else{
						oBreak.style.top = top + "px";
						k.timer = requestAnimationFrame(k);
					}
				}
				k.timer = requestAnimationFrame(k);
			},4000);
		})();
			//移除cookie
			removeCookie("score");
			setCookie({score:oBox.score},1000);//设置新的cookie
		}
		oHistory.innerHTML = getCookie("score") || score;//最高纪录
	}
	//获取类名兼容ie8-
	function getClass(obj){
			if(window.getElementsByClassName){
				return document.getElementsByClassName("obj");
			}else{
				var all = document.getElementsByTagName("*");
				var arr = [];
				for(var i=0;i<all.length;i++){
				if(all[i].className == obj){
					arr.push(all[i]);
				}
				}
				return arr;
			}
		}

		//设置cookie
	function setCookie(json,time){
		var date = new Date(new Date().getTime() + time*24*60*60*1000).toGMTString();
		for(var key in json){
			document.cookie = key+ "=" +json[key]+"; expires="+date;
		}
	}

	//获取cookie
	function getCookie(key){
		var cookie = document.cookie;
		var reg = new RegExp("(\\s|^)"+key+"=([^;]*)(;|$)");
		var s = cookie.match(reg);
		return s?s[2]:"";
	}

	//移除cookie
	function removeCookie(key){
		var json = {};
		json[key] = "";
		setCookie(json,-1);
	}
})();

