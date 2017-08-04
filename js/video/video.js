var _data={
	videoDuration:0,
	lengthOfMsecond:0,
	beginTime:0,
	durationTime:10,
	currentVideo:0,
	count:0,
	beginTimeFlag:false,
	durationTimeFlag:false
};
var _timeLine = [];
var isEdit = false;
var _urls = [];
$(function(){
	(function(){
		//$("#videoUrl").val("http://v.youku.com/v_show/id_XNzQ2MDc3ODQ0.html");
		$("#videoUrl").val("https://v.qq.com/x/page/q0331ui64ve.html");
		checkUrl(function(){
			$("#videoUrl").val("");
			$("#tailorCreate").removeClass().addClass("create");
		},function(){
			$("#videoUrl").val("");
			$("#tailorCreate").removeClass().addClass("create");
		});
	})();
	$(".toolNav a").click(function(e){
		e.preventDefault();
		if($(this).index() == 3){
			return;
		}
		var _href = $(this).attr("href");
		parent.window.postMessage("url:"+_href,"*");
	});
    $("#create").click(function(){
        checkUrl();
        _hmt.push(['_trackEvent', '视频转GIF', 'click', '开始制作']);
    });
    $("#videoUrl").keydown(function(e){
    	if(e.keyCode == "13"){
    		checkUrl();
    	}
    });
    $("#videoUrl").on("input",function(){
        $("#tailorCreate").removeClass().addClass("create");
    });
    $("#videoUrl").on("propertychange",function(){
        $("#tailorCreate").removeClass().addClass("create");
    });
	if(document.all){//判断浏览器是否是IE
		$("#videoUrl").on("propertychange",function(e){
			if(e.propertyName != 'value'){
				return;
			}
			$(this).trigger("input");
		});
	}
    $.jPlayer.timeFormat.showHour = true;
	$("#photos").delegate("li .producedImg .addDelete","click",function(){
		$(this).parents("li").remove();
		if($("#photos li").length < 3){
			var str = '<li>'
				+'<div class="producedImg">'
					+'<span class="addDelete"></span>'
				+'</div>'
				+'<div class="downwrap">'
					+'<a class="download" download href="#">下载</a>'
				+'</div>'
				+'</li>';
			$("#photos").append($(str));
			var _height = $(document).outerHeight();
			parent.window.postMessage("height:"+_height,"*");
		}
		_hmt.push(['_trackEvent', '视频转GIF', 'click', '删除']);
	});
	$("#photos").delegate("li .producedImg img","mouseenter",function(){
		var _src = $(this).attr("src");
		parent.window.postMessage("src:"+_src,"*");
	});
	$("#photos").delegate("li .producedImg img","mouseleave",function(){
		parent.window.postMessage("src:","*");
	});

	/*$("#photos").delegate("li .producedImg img","mouseenter",function(){
		var _src = $(this).attr("src");
		$("#preview img").attr("src",_src);
		$("#preview").css("display","block");
		$("#preview").trigger("mouseenter");
	});
	$("#photos").delegate("li .producedImg img","mouseleave",function(){
		$("#preview").css("display","none");
	});
	$('#preview').mouseenter(function(){
		$(this).css('display','block');
	});
	$('#preview').mouseleave(function(){
		$("#preview").css("display","none");
	});*/
	$(".workCreate").delegate("#produce","click",function(){
		if($(this).hasClass('active')){
			return;
		}
		$(this).addClass("active");
		$("#shade").css("display","block");
		var _beginGif =  checkUrlByTime(_data.beginTime);
		var _endGif = checkUrlByTime((_data.beginTime - 0) +(_data.durationTime - 0));
		var _w = $("#jquery_jplayer_0").attr("data-w") - 0,
		    _h = $("#jquery_jplayer_0").attr("data-h") - 0;
		_w = parseInt(_w*(350/_h));
		_h = 350;
		if(_beginGif.urlIndex !== _endGif.urlIndex){
			_gifInformation = {
                "realUrlA":_urls[_beginGif.urlIndex],
                "startTimeA":$.jPlayer.convertTime(Math.floor(_beginGif.playTime)),
                "endTimeA":$.jPlayer.convertTime(Math.floor(_timeLine[_beginGif.urlIndex])),
                "realUrlB":_urls[_endGif.urlIndex],
                "startTimeB":"00:00:00",
                "endTimeB":$.jPlayer.convertTime(Math.floor(_endGif.playTime)),
                "quality":2,
                "gifSize":_w + '*' + _h
           }
			getGif("/v1/mutil/video/gif",_gifInformation);
		}else{
			_gifInformation = {
                "realUrl":_urls[_beginGif.urlIndex],
                "startTime":$.jPlayer.convertTime(_beginGif.playTime),
                "endTime":$.jPlayer.convertTime(_endGif.playTime),
                "quality":2,
                "gifSize":_w + '*' + _h
            };
            getGif("/v1/single/video/gif",_gifInformation);
		}
		function getGif(_url,_gifInformation){
			$.ajax({
                type:"POST",
                url:_url,
                dataType:"json",
                data:_gifInformation,
                success:function(callback){
                    if(callback.status != 'ok'){
                    	$("#produce").removeClass("active");
						$("#shade").css("display","none");
                        return;
                    }
                    var _img = '<img src="'+callback.content+'"/>';
                    var _next = $("#photos li.next");
                    _next.removeClass("next").addClass("active");
                    _next.find(".producedImg .addDelete").before(_img);
                    _next.find(".download").attr("href",callback.content);
                    if(_next.next().index() != -1){
                    	_next.next().addClass("next");
                    }else{
                    	var str = '<li class="next">'
							+'<div class="producedImg">'
								+'<span class="addDelete"></span>'
							+'</div>'
							+'<div class="downwrap">'
								+'<a class="download" download href="#">下载</a>'
							+'</div>'
							+'</li>';
						$("#photos").append($(str));
                    }
					var _height = $(document).outerHeight();
					parent.window.postMessage("height:"+_height,"*");
                    var _top = $(".gifContainer").offset().top;
                    $('html,body').animate({
                    	'scrollTop':_top
                    },1000);
                    parent.window.postMessage("scroll:"+_top+"#"+1000,"*");
                    $("#produce").removeClass("active");
                    $("#shade").css("display","none");
                }
            });
		}
		_hmt.push(['_trackEvent', '视频转GIF', 'click', '生成GIF']);
	});
	$("#photos").delegate("li .producedImg","click",function(){
		if($(this).parent().hasClass('active')){
			return;
		}
		var _top = $("#workContent").offset().top-20;
		$("html,body").animate({
			"scrollTop":_top + "px"
		},400);
		parent.window.postMessage("scroll:"+_top+"#"+400,"*");
		_hmt.push(['_trackEvent', '视频转GIF', 'click', '返回顶部继续截取']);
	});
	$('html').click(function(){
    	if(_data.beginTimeFlag){
    		changeBeginTime();
    	}
    	if(_data.durationTimeFlag){
    		changeDurationTime();
    	}
    });
   $("#photos").delegate("li.active .downwrap a","click",function(e){
    	e.stopPropagation();
    	e.preventDefault();
    	var _url = $(this).attr("href");
    	location.href = "/v1/download?gifUrl="+_url;
    	_hmt.push(['_trackEvent', '视频转GIF', 'click', '下载']);
    });
   	$(".downloadAll").click(function(){
   		if($("#photos li.active").length == 0){ // /v1/batch/download  gifUrls
   			return;
   		}
   		if($(this).hasClass("active")){
   			return;
   		}
   		$(this).addClass("active");
   		var form = $("<form>");
   		form.attr("style","display:none;");
   		form.attr("method","post");
   		form.attr("action","http://106.75.10.135:18081/v1/batch/download");
   		$("body").append(form);
   		var _urls = [];
   		$("#photos li.active").each(function(){
   			var _url = $(this).find(".producedImg img").attr("src");
   			_urls.push(_url);
   			var input = $("<input>");
   			input.attr("type","hidden");
   			input.attr("name","gifUrls");
   			input.attr("value",$(this).find(".producedImg img").attr("src"));
   			form.append(input);
   		});
   		form.submit();form.remove();
   		$(this).removeClass("active");
   	});
});
function checkUrl(fn,fnerr){
	var _videoUrl = $.trim($("#videoUrl").val());
    if(!$("#videoUrl").val()){
    	$("#tailorCreate").removeClass().addClass("error");
    	$(".errorTip span").html("图片地址不能为空");
    	$("#tailorCreate.error .inputContainer").addClass("shake");
    	window.setTimeout(function(){
    		$("#tailorCreate.error .inputContainer").removeClass("shake");
    	},500);
        return;
    }
	var regUrl = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
	if(!regUrl.test(_videoUrl)){
		$("#tailorCreate").removeClass().addClass("error");
		$(".errorTip span").html("识别不出该网址");
    	$("#tailorCreate.error .inputContainer").addClass("shake");
    	window.setTimeout(function(){
    		$("#tailorCreate.error .inputContainer").removeClass("shake");
    	},500);
		return;
	}
    $("#tailorCreate").removeClass().addClass("running");
    $.ajax({
        type:"POST",
        url:"/v1/video/real/url",
        dataType:"json",
        data:{
            "videoUrl" : _videoUrl
        },
        success:function(callback){
            if (callback.status != 'ok'){
            	if(fnerr){
            		fnerr();
            	}else{
            		 $("#tailorCreate").removeClass().addClass("error");
	                $(".errorTip span").html("识别不出该网址");
	                $("#tailorCreate.error .inputContainer").addClass("shake");
			    	window.setTimeout(function(){
			    		$("#tailorCreate.error .inputContainer").removeClass("shake");
			    	},500);
            	}
                return;
            }
            isEdit = true;
            var data = callback.content;
            _urls = [];
            for(var key in data){
            	_urls.push(data[key]);
            }
		    $(".jp-type-single").html("");
		    _data={
				videoDuration:0,
				lengthOfMsecond:0,
				beginTime:0,
				durationTime:10,
				currentVideo:0,
				count:0,
				beginTimeFlag:false,
				durationTimeFlag:false
			};
			_timeLine = [];
			isEdit = false;
			$("#duration").html('0:00:00');
			$(".continueTime b").html('10s');
			$(".dragDuration").css('width','114px'); 
			$("#dragContainer").css('left',0);

			initVideoWrap();
			var _timer = window.setInterval(function(){
				if(_data.count == $(".jp-jplayer").length){
					var _tTime = sumPlayTime(_timeLine.length);
					_data.videoDuration = _tTime;
					$("#jp_container_1 .video-duration").html($.jPlayer.convertTime(_tTime));
					progressClick($(".progress"));
					progressDrag($("#dragTop"));
					beginTimeClickEvent($(".beginTime"));
					durationDrag($("#progressDurationLength"));
					durationTimeClickEvent($(".continueTime"));
					window.clearInterval(_timer);
				}
			},2000);
			parent.window.postMessage("edit:edit","*");
            $("#tailorCreate").removeClass().addClass("correct");
			$("#help").slideUp(500);

            $("#workContent").slideDown(500,function(){
            	if(fn){
            		return;
            	}
                var _top = $("#workContent").offset().top-20;
                $('html,body').animate({
                    'scrollTop':_top+'px'
                },1000);
                parent.window.postMessage("scroll:"+_top+"#"+1000,"*");
            });
            $(".gifContainer").slideDown(500,function(){
            	if($(".downloadAllWrap").css("display") == "none"){
                	$(".downloadAllWrap").css("display","block");
                }
            	var _h = $(document).outerHeight();
	            parent.window.postMessage("height:"+_h,"*");
            });

            if(fn){
            	fn();
            }
        },
        error:function(data){
            $("#tailorCreate").removeClass().addClass("error");
        }
    });
}
function changeBeginTime(){
	_data.beginTimeFlag = false;
	var _str = $("#inputDuration").val();
	var _reg = /^\d{1,2}(:\d\d){1,2}$/g;
	_str = $.trim(_str);
	var _beginTimeChangeFlag = true;
	if(!_reg.test(_str)){
		_str = $.jPlayer.convertTime(_data.beginTime);
		_beginTimeChangeFlag = false;
	}else if(convertStimeToNtime(_str)>_data.videoDuration){
		_str = $.jPlayer.convertTime(_data.beginTime);
		_beginTimeChangeFlag = false;
	} 
	var str = '<span id="duration">'+_str+'</span>';
	$(str).appendTo($("#inputDuration").parent());
	$("#inputDuration").remove();
	if(_beginTimeChangeFlag){
		_data.beginTime = convertStimeToNtime(_str); 
		var _dragTopWidth = $("#dragTop").width();
		var _progressWidth = $(".progress").width()-_dragTopWidth;
		var _eveSecondWidth = (_progressWidth/_data.videoDuration).toFixed(6)-0;
		$("#dragContainer").stop(false,true).animate({
			left:_data.beginTime*_eveSecondWidth+'px'
		},100,function(){
			if(parseInt($("#dragContainer").css('left')) > 610){
				$("#dragContainer .beginTime").addClass("white");
			}else{
				$("#dragContainer .beginTime").removeClass("white");
			}
			playByTheTime(_data.beginTime);
		});
	}else{
		playByTheTime(_data.beginTime);
	}
	_hmt.push(['_trackEvent', '视频转GIF', 'click', '输入开始时间']);
}
function changeDurationTime(){
	_data.durationTimeFlag = false;
	var _str = $("#duraTime").val();
	_str = parseInt(_str);
	if(!_str||_str<1||_str>20){
		_str = _data.durationTime;
	}else{
		_str = _str;
	}
	var str = '<b>'+_str+'s</b>';
	$(str).appendTo($("#duraTime").parent());
	$("#duraTime").remove();
	_data.durationTime = _str;
	if(_str*10+14>=214){
		$(".dragDuration").stop().animate({
			width:'214px'
		},100);
	}else{
		$(".dragDuration").stop().animate({
			width:_str*10+14+'px'
		},100);
	}
	_hmt.push(['_trackEvent', '视频转GIF', 'click', '输入持续时间']);
}
function playByTheLeft(_left){
	var _progressOffsetLeft = $(".progress").offset().left;
	var _dragTopWidth = $("#dragTop").width();
	var _progressWidth = $(".progress").width()-_dragTopWidth;
	var _playTime = (_left/_progressWidth)*_data.videoDuration;
	_playTime = (!_playTime||_playTime<0)?0:_playTime;
	var _playUrl = checkUrlByTime(_playTime);
	$("#jquery_jplayer_"+_playUrl["urlIndex"]).jPlayer('play',Math.floor(_playUrl["playTime"]));
	$("#jquery_jplayer_"+_playUrl["urlIndex"]).jPlayer("pauseOthers");
	$("#jquery_jplayer_"+_playUrl["urlIndex"]).css("display","block").siblings().css("display","none");
	var _totalTime = Math.floor(sumPlayTime(_timeLine.length));
	_data.beginTime = _playTime;
	_data.currentVideo = _playUrl["urlIndex"];
}
function checkUrlByTime(_time){
	var _urlIndex;
	var _countTime = 0;
	for(_urlIndex = 0;_urlIndex < _timeLine.length;_urlIndex++){
		_countTime += _timeLine[_urlIndex];
		if(_countTime >= _time ){
			break;
		}
	}
	if(_urlIndex >= _timeLine.length){
		var _max = _timeLine.length - 1;
		return {"urlIndex":_max,"playTime":parseInt(_timeLine[_max])};
	}
	return {"urlIndex":_urlIndex,"playTime":parseInt(_time-(_countTime-_timeLine[_urlIndex]))};
}
function playByTheTime(_time){
	var _playUrl = checkUrlByTime(_time);
	$("#jquery_jplayer_"+_playUrl["urlIndex"]).jPlayer('play',Math.floor(_playUrl["playTime"]));
	$("#jquery_jplayer_"+_playUrl["urlIndex"]).jPlayer("pauseOthers");
	$("#jquery_jplayer_"+_playUrl["urlIndex"]).css("display","block").siblings().css("display","none");
	_data.currentVideo = _playUrl["urlIndex"];
}
function convertStimeToNtime(str){
	var arrs = str.split(":");
	var total = 0;
	var i = arrs.length-1,j=0;
	while(i>=0){
		total+=arrs[i]*Math.pow(60,j);
		i--;
		j++;
	}
	return total;
}
function sumPlayTime(n){
	if(n<0){
		return 0;
	}
	var _sum = 0;
	for(var i=0;i<n;i++){
		_sum += _timeLine[i];
	}
	return _sum;
}
function beginTimeClickEvent($obj){
	var _beforeBegintime;
	$obj.delegate("#duration","click",function(e){
		e.stopPropagation();
		_data.beginTimeFlag = true;
		isEdit = true;
		_beforeBegintime = $.jPlayer.convertTime(_data.beginTime);
		var str = '<input type="text" id="inputDuration" autofocus value="'+$.jPlayer.convertTime(_data.beginTime)+'" />';
		$(str).appendTo($(this).parent());
		$(this).remove();
	});
	$obj.delegate("#inputDuration","keydown",function(e){
		if(e.keyCode != "13"){
			return;
		}		
		if(_data.durationTimeFlag){
			changeDurationTime();
		}
		changeBeginTime();
	});
	$obj.delegate("#inputDuration","focus",function(e){
		e.stopPropagation();
	});
	$obj.delegate("#duration","mousedown",function(e){
		e.stopPropagation();
	});
	$obj.delegate("#duration","mouseup",function(e){
		e.stopPropagation();
	});
	$obj.delegate("#duration","mousemove",function(e){
		e.stopPropagation();
	});
	$obj.delegate("#duration","mouseleave",function(e){
		e.stopPropagation();
	});
	$obj.delegate("#inputDuration","click",function(e){
		e.stopPropagation();
	});
	$obj.delegate("#inputDuration","mouseup",function(e){
		e.stopPropagation();
	});
}
function progressDrag($obj) {
	var progressDragable=false;
	$obj.click(function(e){
		e.stopPropagation();
    	e.preventDefault();
	});
   	$obj.mousedown(function(e){
   		e.stopPropagation();
    	e.preventDefault();
   		isEdit = true;
        var _pOLeft = $(".progress").offset().left;
        var _dragWidth = $("#dragTop").width();
        var _progressWidth = $(".progress").width()-_dragWidth; 
        var _presentWidth = (_progressWidth / _data.videoDuration).toFixed(6);
        progressDragable = true;
        var bb = true;
        $(".video").mousemove(function(e){
        	if (!progressDragable){
        		return;
        	}
        	var _x = e.clientX;
        	var _pOLeft = $(".progress").offset().left;
        	if(_x < _pOLeft||_x>_pOLeft+_progressWidth){
        		return;
        	}else{
	        	_mouse_left = _x - _pOLeft;
	        	$("#dragContainer").stop(false,true).animate({"left":_mouse_left +'px'},0,function(){
					if(parseInt($("#dragContainer").css('left')) > 610){
						$("#dragContainer .beginTime").addClass("white");
					}else{
						$("#dragContainer .beginTime").removeClass("white");
					}
				});
				var _beginTime = ((_x - _pOLeft)/_progressWidth)*_data.videoDuration;
				$("#duration").html($.jPlayer.convertTime(_beginTime));
        	}
        	if(bb){
        		_hmt.push(['_trackEvent', '视频转GIF', 'click', '拖动持续时间']);
        		bb = false;
        	}
      	});
    });
    $(".video").mouseup(function(e){ 
    	e.stopPropagation();
    	e.preventDefault();
    	if(progressDragable==true){
    		progressDragable = false;
	    	var _left = $("#dragContainer").offset().left - $(".progress").offset().left;
			playByTheLeft(_left);
			$("#duration").html($.jPlayer.convertTime(_data.beginTime));
    	}
    });
    $(".video").mouseleave(function(e){
    	e.stopPropagation();
    	e.preventDefault();
		if(progressDragable==true){
    		progressDragable = false;
	    	var _left = $("#dragContainer").offset().left - $(".progress").offset().left;
			playByTheLeft(_left);
			$("#duration").html($.jPlayer.convertTime(_data.beginTime));
    	}
    });
}
function progressClick($obj){
	$obj.click(function(e){
		if(_data.beginTimeFlag){
			e.stopPropagation();
			var str = '<span id="duration"></span>';
			$(str).appendTo($("#inputDuration").parent());
			$("#inputDuration").remove();
			_data.beginTimeFlag = false;
		}
		if(_data.durationTimeFlag){
			changeDurationTime();
		}
		var _left = $obj.offset().left;
		var _progressWidth = $(".progress").width()-$("#dragTop").width();
		var _presentWidth = ((_progressWidth) / _data.videoDuration).toFixed(6);
		var _endWidth = _left+_progressWidth+$("#dragTop").width();
		var _playTime;
		var _cX = e.clientX;
		var _toLeft = _cX - _left;
		isEdit = true;
		if(_cX<_left||_cX>_endWidth){
			return;
		}else{
			if(_toLeft >= _progressWidth){
				_toLeft = _progressWidth;
			}
			_playTime = Math.floor(_toLeft/_presentWidth);
			$("#dragContainer").animate({
				"left":_toLeft+'px'
			},100,function(){
				if(_toLeft > 610){
					$("#dragContainer .beginTime").addClass("white");
				}else{
					$("#dragContainer .beginTime").removeClass("white");
				}
			});
			playByTheLeft(_toLeft);
			$("#duration").html($.jPlayer.convertTime(_data.beginTime));
		}
		_hmt.push(['_trackEvent', '视频转GIF', 'click', '点击开始时间']);
	});
}
function durationTimeClickEvent($obj){
	$obj.delegate("b","click",function(e){
		e.stopPropagation();
		_data.durationTimeFlag = true;
		isEdit = true;
		var _val = $(this).html().replace("s","");
		var str = '<input type="text" id="duraTime" autofocus value="'+_val+'"/>';
		$(str).appendTo($(this).parent());
		$(this).remove();
	});
	$obj.delegate("#duraTime","keydown",function(e){
		if(e.keyCode != "13"){
			return;
		}
		if(_data.beginTimeFlag){
			changeBeginTime();
		}
		changeDurationTime();
	});
	$obj.delegate("#duraTime","focus",function(e){
		e.stopPropagation();
	});
	$obj.delegate("b","mousedown",function(e){
		e.stopPropagation();
	});
	$obj.delegate("b","mouseup",function(e){
		e.stopPropagation();
	});
	$obj.delegate("b","mousemove",function(e){
		e.stopPropagation();
	});
	$obj.delegate("b","mouseleave",function(e){
		e.stopPropagation();
	});
	$obj.delegate("#duraTime","click",function(e){
		e.stopPropagation();
	});
	$obj.delegate("#duraTime","mouseup",function(e){
		e.stopPropagation();
	});
}
function durationDrag($obj){
	var durationDragable = false;
	$("#dragDurationContainer").click(function(e){
		e.stopPropagation();
    	e.preventDefault();
	});
	$obj.click(function(e){
		e.stopPropagation();
    	e.preventDefault();
	});
	$obj.mousedown(function(e){
		e.stopPropagation();
    	e.preventDefault();
    	if(_data.durationTimeFlag){
			var str = '<b></b>';
			$(str).appendTo($("#duraTime").parent());
			$("#duraTime").remove();
			_data.durationTimeFlag = false;
		}
		isEdit = true;
		var $duration = $("#dragDurationContainer");
        var _durationOffsetLeft = $duration.offset().left;
        var _durationWidth = $duration.width();
        var _progressDurationLengthWidth = $("#progressDurationLength").width();
        durationDragable = true;
        var aa = true;
        $(".jp-jplayer").jPlayer("pause");
        $(".video").mousemove(function(e){
        	e.stopPropagation();
    		e.preventDefault();
        	if(!durationDragable){
        		return;
        	}
        	_durationOffsetLeft = $("#dragDurationContainer").offset().left;
        	var _clientMoveX = e.clientX;
			if(_clientMoveX<_durationOffsetLeft+24||_clientMoveX>_durationOffsetLeft+_durationWidth-_progressDurationLengthWidth){
				return;
			}else{
				if(_clientMoveX-_durationOffsetLeft+_progressDurationLengthWidth>=214){
					$(".dragDuration").css("width",'214px');
				}else{
					$(".dragDuration").css("width",_clientMoveX-_durationOffsetLeft+_progressDurationLengthWidth+'px');
				}
				var _durationTime = Math.floor((_clientMoveX-_durationOffsetLeft)/10);
				_durationTime = _durationTime>20?20:_durationTime;
				_data.durationTime = _durationTime;
				$(".dragDuration .continueTime b").html(_data.durationTime+'s');
			}
			if(aa){
				_hmt.push(['_trackEvent', '视频转GIF', 'click', '拖动开始时间']);
				aa = false;
			}
      	});
    });
    $("#dragDurationContainer").mouseleave(function(e){
    	e.stopPropagation();
    	e.preventDefault();
    	if(durationDragable==true){console.log("dragDurationContainer mouseleave");
    		durationDragable=false;
			var _clientX = e.clientX;
			var _durationContainerOffsetLeft = $("#dragDurationContainer").offset().left;
			var _progressDurationLengthWidth = $("#progressDurationLength").width();
			if(_clientX<_durationContainerOffsetLeft+30){
				$(".dragDuration").animate({
					"width":'30px'
				},100);
				_data.durationTime = 1;
				$(".dragDuration .continueTime b").html('1s');
			}else{
				if(_clientX - _durationContainerOffsetLeft+_progressDurationLengthWidth>=214){
					$(".dragDuration").animate({
						"width":'214px'
					},100);
				}else{
					$(".dragDuration").animate({
						"width":_clientX - _durationContainerOffsetLeft+_progressDurationLengthWidth+'px'
					},100);
				}
				var _durationTime = Math.floor((_clientX - _durationContainerOffsetLeft)/10);
				if(_durationTime>20){
					_durationTime = 20;
				}
				_data.durationTime = _durationTime;
				$(".dragDuration .continueTime b").html(_data.durationTime+'s');
			}
			playByTheTime(_data.beginTime);
			_hmt.push(['_trackEvent', '视频转GIF', 'click', '拖动持续时间']);
    	}
	});
    $("#dragDurationContainer").mouseup(function(e){
    	e.stopPropagation();
    	e.preventDefault();
    	var _clientX = e.clientX;
		var _durationContainerOffsetLeft = $("#dragDurationContainer").offset().left;
		var _durationTime = Math.floor((_clientX - _durationContainerOffsetLeft)/10);
		var _progressDurationLengthWidth = $("#progressDurationLength").width();
		if(_clientX >= $("#progressDurationLength").offset().left && _clientX < $("#progressDurationLength").offset().left+14){
			durationDragable = false;
			$("#jquery_jplayer_"+_data.currentVideo).jPlayer('play');
			$("#jquery_jplayer_"+_data.currentVideo).jPlayer("pauseOthers");
			$("#jquery_jplayer_"+_data.currentVideo).css("display","block").siblings().css("display","none");
			return;	
		}
    	if(_data.beginTimeFlag){
    		changeBeginTime();
    	}
    	if(_data.durationTimeFlag){
			var str = '<b></b>';
			$(str).appendTo($(".continueTime"));
			$("#duraTime").remove();
			_data.durationTimeFlag = false;
		}
    	durationDragable=false;
		if(_durationTime>20){
			_durationTime = 20;
		}
		if(_durationTime <= 1){
			_data.durationTime = 1;
			$(".dragDuration .continueTime b").html(_data.durationTime+'s');
			playByTheTime(_data.beginTime);
			$(".dragDuration").animate({
				"width":'30px'
			},100);
			return;
		}
		_data.durationTime = _durationTime;
		$(".dragDuration .continueTime b").html(_data.durationTime+'s');
		playByTheTime(_data.beginTime);
		if(_clientX - _durationContainerOffsetLeft+_progressDurationLengthWidth>=214){
			$(".dragDuration").animate({
				"width":'214px'
			},100);
		}else{
			$(".dragDuration").animate({
				"width":_clientX - _durationContainerOffsetLeft+_progressDurationLengthWidth+'px'
			},100);
		}
		_hmt.push(['_trackEvent', '视频转GIF', 'click', '点击持续时间']);
	});
}
function initVideoWrap(){
	for(var i=0;i<_urls.length;i++){
		if(i==0){
			var	_html = '<div id="jquery_jplayer_'+i+'" class="jp-jplayer"></div>';
		}else{
			var	_html = '<div id="jquery_jplayer_'+i+'" class="jp-jplayer" style="display:none;"></div>';
		}
		$(".jp-type-single").append(_html);
	}
	$(".jp-type-single .jp-jplayer").each(function(index,_obj){
		var _id = $(this).attr("id");
		initVideo($("#"+_id),_urls[index]);
		$("#"+_id).bind($.jPlayer.event.timeupdate,function(event) {
			if(isEdit){
				if(event.jPlayer.status.currentTime+0.25+sumPlayTime(_data.currentVideo)>=_data.beginTime+(_data.durationTime-0)){
					playByTheTime(_data.beginTime);
				}
				var _playPro = (((sumPlayTime(_data.currentVideo)+event.jPlayer.status.currentTime) - _data.beginTime)/_data.durationTime).toFixed(4)-0;
				if(_playPro>1){
					_playPro = 0;
				}
				var _dragDurationLength = $(".dragDuration").width()-6;
				if((_playPro*_dragDurationLength)<0){
					$("#progressDurationRuning").stop().css("display","none")
					.animate({"left":0+'px'},250).css("display","block");
				}else{
					$("#progressDurationRuning").stop().css("display","none")
					.animate({"left":_playPro*_dragDurationLength+'px'},250).css("display","block");
				}
			}
			if(sumPlayTime(_data.currentVideo)+event.jPlayer.status.currentTime < _data.beginTime){
				var _currentTime = $.jPlayer.convertTime(_data.beginTime);
			}else{
				var _currentTime = $.jPlayer.convertTime(sumPlayTime(_data.currentVideo)+event.jPlayer.status.currentTime);
			}
			$(".video-currentTime").html(_currentTime);
		});
		$("#"+_id).bind($.jPlayer.event.ended,function(event) {
			$(this).jPlayer("ended");
			if($(this).attr("id")===$(".jp-type-single .jp-jplayer:last").attr("id")){
				if(isEdit){
					playByTheTime(_data.beginTime);
					_data.currentVideo = $(this).index();
				}else{
					$(this).css("display","none");
					$("#jquery_jplayer_0").css("display","block").jPlayer("play",0);
					_data.currentVideo = 0;
				}
			}else{
				$(this).css("display","none");
				$(this).next().css("display","block").jPlayer("play",0);
				_data.currentVideo = $(this).index()+1;
			}
		});
		$("#"+_id).bind($.jPlayer.event.loadedmetadata,function(event){ //console.log(_id,event.jPlayer.status.duration);
			_data.count++;
			$(this).attr("data-w",event.jPlayer.status.videoWidth).attr("data-h",event.jPlayer.status.videoHeight);
			var _dura =( event.jPlayer.status.duration - 0).toFixed(2)-0;
			_timeLine[_id.match(/\d+/g)[0]] = _dura;
		});
	});
	$("#jquery_jplayer_0").bind($.jPlayer.event.ready,function(event){
		$(this).jPlayer("play",0);
		_data.currentVideo = 0;
	});
}
function initVideo($obj,url){
	$obj.jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				m4v:url,
				poster: ""
			});
		},
		swfPath: "../../js/swf",
		supplied: "webmv, ogv, m4v",
		preload:"metadata",
		size: {
			width: "884px",
			height: "350px"
		},
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		keyEnabled: true,
		volume :0,
		remainingDuration: true,
		toggleDuration: true,
		timeFormat:{
			showHour :true
		}
	});
}

