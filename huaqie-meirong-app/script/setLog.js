new MultiPicker({
    input: 'weight',//点击触发插件的input框的id
    container: 'targetContainer',//插件插入的容器id
    jsonData: $weight,
    success: function (arr) {
        $('#weight').val(arr[0].value)
    }//回调
});
var baseList = [ 'birth', 'skin','consume', 'temper', 'profession', 'health', 'weight' ]
var isFirst = true;
var params = null;
var peopleId = '';
var init = function() {
    var data = params.basic.extra;
    // $('#name').val(data.name);
    // $('#phone').val(data.phone);
    // $('#cost').val(data.amount == 1 ? data.amount : data.amount.toFixed(2));
    // if(data.amount == 1) {
    //     $('#cost-wrap').text('消费次数');
    // } else {
    //     $('#cost-wrap').text('实付金额');
    // }
    peopleId = params.basic.peopleId;
    //peopleId = '59f69def349e6f0222add767';
    ajax.getServerPeople({
        peopleId: peopleId,
    }, function(res) {
         console.log(res);
        var profile = res.data.extra.profile;
        var count = 0;
        if(profile) {
            for(key in profile) {
                if(baseList.indexOf(key) >= 0 && profile[key]) {
                    count += 1;
                    var domId = key.replace(/[A-Z]/g, function(val) {
                        return '-' + val.toLowerCase();
                    })
                    $('#' + domId).val(profile[key]);
                }
            }
            $('#progress').text(count ? (count / baseList.length * 100).toFixed(2) + '%' : '0%');
            isFirst = false;
            $('#more').show();
            $('#more').removeClass('img-up');
            $('.first-write').removeClass('first-write-up');

				 //便利渲染
                //skin

                var skin=profile.skin
                if(skin){
                	skin=skin.split(',')
                	 var skindom=$('[name="skin"]')
                console.log(skindom)
                for (var i = skin.length - 1; i >= 0; i--) {
                    for (var j = skindom.length - 1; j >= 0; j--) {
                        if(skindom[j].value==skin[i]){
                            skindom[j].checked=true 
                        }
                       
                    }
                }
                }
                
               
                //consume
                var consume=profile.consume
                var consumedom=$('[name="consume"]')
                for (var i = consumedom.length - 1; i >= 0; i--) {
                    if(consumedom[i].value==consume){
                        consumedom.eq(i).selected=true;
                    }
                }
                //性格
                var temper=profile.temper;
                var temperdom=$('[name="temper"]');
                console.log(temper,temperdom)
                for (var i = temperdom.length - 1; i >= 0; i--) {
                    if (temperdom[i].value==temper) {
                        console.log(0)
                        temperdom.eq(i).attr('checked',true)
                    }
                        
                }
                //profession
                var profession=profile.profession;
                var professiondom=$('[name="profession"]');
                console.log(profession,professiondom);
                for (var i = professiondom.length - 1; i >= 0; i--) {
                    if (professiondom[i].value==profession) {
                        professiondom.eq(i).attr('checked',true)
                    }
                    
                }

                //health
                var health=profile.health
                if(health){
                	health=health.split(',')

                var healthdom=$('[name="health"]')
                console.log(health)
                for (var i = health.length - 1; i >= 0; i--) {
                    for (var j = healthdom.length - 1; j >= 0; j--) {
                        if(healthdom[j].value==health[i]){
                           healthdom[j].checked=true 
                        }
                       
                    }
                }
                }
                




        } else {
            isFirst = true;
            $('#more').hide();
            $('#more').addClass('img-up');
            $('.first-write').addClass('first-write-up');
        }  
    })
}
// 设置选择图片配置
var options = {
    type: 'picture',
    column: 4,
    classify: true,
    max: 1,
    sort: {
        key: 'time',
        order: 'desc'
    },
    texts: {
        stateText: '已选择*项',
        cancelText: '取消',
        finishText: '完成'
    },
    styles: {
        bg: '#fff',
        mark: {
            icon: '',
            position: 'bottom_left',
            size: 20
        },
        nav: {
            bg: '#eee',
            stateColor: '#000',
            stateSize: 18,
            cancelBg: 'rgba(0,0,0,0)',
            cancelColor: '#000',
            cancelSize: 18,
            finishBg: 'rgba(0,0,0,0)',
            finishColor: '#000',
            finishSize: 18
        }
    },
    exchange: true,
}

var Oavatar = $('#avatar');
var renderId = '';
// 配置弹窗
var inputList = [
	{
		id: 'skin',
		values: ['中性', '干性', '油性', '混合性', '敏感性'],
	},
	{
		type: 'checkbox',
		id: 'skin-problem',
		values: ['雀斑', '黄褐斑', '红血丝', '暗疮'],
	},
	{
		id: 'consume',
		values: ['2000以下', '2000-5000元', '5000-10000元', '10000以上'],
	},
	{
		id: 'temper',
		values: ['大方豪爽', '外向开朗', '情绪多变', '沉默寡言', '小心谨慎'],
	},
	{
		id: 'profession',
		values: ['教师', '医生', '公务员', '老板', '职员', '自由职业'],
	},
	{
		type: 'checkbox',
		id: 'health',
		values: ['失眠', '偏头痛', '消化不良', '慢性胃病', '月经不调', '肩颈酸胀', '乳腺疼痛'],
	},
    // {
    //     type: 'checkbox',
    //     id: 'promotion',
    //     values: ['暂且无', '头疗', '面部护理', '纹绣', '美甲', '肩颈舒压', '减肥丰胸', '温胃', '肾保养', '粉红丝带', '瑶浴', '淋巴排毒', '艾灸', '脱毛'],
    // }
];

// 判断是单值还是多值
var checkOrRadio = function(data) {
	var result;
	if(data.match(/&/g)) {
		result = [];
		data.split('&').forEach(function(item) {
			result.push(item.split('=')[1]);
		})
		result = result.join('，');
	} else {
		result = data.split('=')[1];
	}
	return result;
}

// 初始化dialog内部的结构
/*conf由以下组成：
* type checkbox/radio 默认是radio
* name input的组名	  必填
* values 是一个数组，代表了input的组成员
*
* domId 默认为check-wrap, 可自行设定
*/
var initDialog = function(conf, domId) {
	var dom = $('#' + (domId || 'check-wrap'));
	var type = conf.type || 'radio';
	var name = conf.name;
	var values = conf.values || [];
	var domHtml = '';

	if(type !== 'radio' && type !== 'checkbox') {
		throw new Error('type of input can only be radio or checkbox!');
	}
	if(!name) {
		throw new Error('name of group must be set!');
	}
	if(!(values instanceof Array)) {
		throw new Error('values of group must be Array!');
	} else {
		if(values.length <= 0) {
			throw new Error('values of group can not be empty!');
		}
	}

	values.forEach(function(item, index) {
		var label;
		if(index == 0) {
			label = '<label>\
						<input \
    						type="'+ type +'" \
    						class="tag-radio" \
    						name="'+ name +'" \
    						value="'+ item +'"\
    						checked\
    					>\
						<span>'+ item +'</span>\
					</label>'
		} else {
			label = '<label>\
						<input \
    						type="'+ type +'" \
    						class="tag-radio" \
    						name="'+ name +'" \
    						value="'+ item +'"\
    					>\
						<span>'+ item +'</span>\
					</label>'		
		}
		domHtml += label;
	})
	dom.html(domHtml);
}

var dataPicker = function(that, mode) {
	var mode = mode || 'date';
	api.openPicker({
	    type: 'date',
	    date: moment().format('YYYY-MM-DD'),
	    title: '选择时间'
	}, function(ret, err) {
	    if (ret) {
	        var year = ret.year;
	        var month = ret.month < 10 ? '0' + ret.month : ret.month;
	        var day = ret.day < 10 ? '0' + ret.day : ret.day;

	        switch(mode) {
	        	case 'date':
	        		$(that).val(year + '-' + month + '-' + day);
	        	break;
	        	case 'diff': 
	        		var now = moment();
	        		var time = moment(year + '-' + month + '-' + day);
	        		if(now >= time) {
	        			alert('只能选择今日以后的时间！');
	        			return;
	        		}
	        		var diff = time.diff(now, 'day') + 1;
	        		$(that).val(diff);
	        	break;
	        }
	    } else {
	        alert(JSON.stringify(err));
	    }
	});
}
// 选择图片
var chooseImg = function() {
	var UIMediaScanner = api.require('UIMediaScanner');
	UIMediaScanner.open(options, function(ret) {
	   if (ret) {
	        if(ret.eventType == 'confirm') {
	            if(ret.list.length <= 0) {
	                api.toast({
	                    msg: '至少选择一张图片'
	                });
	            } else {
	            	var size = ret.list[0].size / 1024 / 1024;
	            	if(size >= 2) {
	            		api.toast({
		                    msg: '请上传小于2M的图片',
		                });
	            	} else {
	            		UIMediaScanner.transPath({
		                    path: ret.list[0].path,
		                }, function(ret, err) {
		                    if (ret) {
		                        api.showProgress({
		                            title: '正在加载中...',
		                            text: '请稍后...',
		                            modal: false
		                        });
		                        uploadAvatar(ret);
		                    } else {
		                        api.toast({
		                            msg: JSON.stringify(err)
		                        });
		                    }
		                });
	            	} 
	            }
	        } else {
	            api.toast({
	                msg: '已取消选择'
	            });
	        }
	   }
	}); 
}
// 上传图片
var uploadAvatar = function(ret) {
    api.ajax({
        url: "https://g2.huaqie.com/cloud/app/upload",
        method: 'post',
        data: {
            values: {
                file: 'file'
            },
            files: {
               file: ret.path
            }
       }
    }, function(ret, err) {
        if (ret) {
            if( ret.code > 0 ) {
                api.toast({ msg: ret.message });
                alert(ret)
                return;
            }
            api.hideProgress();
            Oavatar.attr('src', ret.data.url)
            $('#delAvatar').show();
            $('#avatar').show();
            $('#addAvatar').hide()
            // api.alert({ msg: JSON.stringify(ret) });
        } else {
            api.toast({ msg: '网络出错' });
        }
    });
}
// 为dom绑定事件
inputList.forEach(function(item) {
	$('#' + item.id).on('click', function() {
		// console.log(this.dataset.id);
		renderId = this.dataset.id;
		initDialog({
			type: item.type,
			name: item.id,
			values: item.values,
		});
		$('#radio-box').find('.radio-bg').addClass('radio-bg-on');
	})
})
// 控制弹窗开关
$('#radio-box').on('click', '.radio-bg', function(e) {
	if(e.target.className !== 'radio-bg radio-bg-on') {
		return;
	}
	if($(this).is('.radio-bg-on')) {
		$(this).removeClass('radio-bg-on');
	} else {
		return;
	}
})
// 选择生日
$('#birth').on('click', function() {
	dataPicker(this);
})
$('#next-time').on('click',  function() {
	dataPicker(this, 'diff');
})
// 点击确认事件
$('#dialog-checked').on('click', function() {
	var encodeFormData = $('#dialog-form').serialize();
	var relData = decodeURIComponent(encodeFormData, true);
	var result = checkOrRadio(relData);
	$('#' + renderId).val(result);
	$('#radio-box').find('.radio-bg').removeClass('radio-bg-on');
	// console.log(result);
})
// 点击取消事件
$('#dialog-cancel').on('click', function() {
	// console.log('cancel');
	$('#radio-box').find('.radio-bg').removeClass('radio-bg-on');
})
// 点击更多
$('#more').on('click', function() {
	$(this).toggleClass('img-up');
	$('.first-write').toggleClass('first-write-up');
})

// var addLog = function() {
//     // console.log(isFirst);
    
//     var postData = {
//         peopleId: peopleId,
//         feedId: params.feedId,
//         servicePic: $('#avatar').attr('src'),
//         promotion: $('#promotion').val(),
//         buy: $('#buy').val(),
//         nextTime: $('#next-time').val(),
//         arrears: $('#arrears').val(),
//         desc: $('#arrears').val()
//     };
//     if(isFirst) {
//         postData =Object.assign(postData, {
//             birth: $('#birth').val(),
//             skin: $('#skin').val(),
//             skinProblem: $('#skin-problem').val(),
//             consume: $('#consume').val(),
//             temper:  $('#temper').val(),
//             profession: $('#profession').val(),
//             health: $('#health').val(),
//             weight: $('#weight').val(),
//         }) 
//     }

//     ajax.updateProfile(postData, function(res) {
//         api.toast({
//             msg: '填写成功！',
//         });
//         setTimeout(function() {
//             api.closeWin();
//             api.execScript({
//                 name: 'log',
//                 frameName: 'log_frame',
//                 script: 'getPreBook()',
//             });
//         }, 1000)
//     })
// }

apiready = function() {
	params = api.pageParam;
	init();
}