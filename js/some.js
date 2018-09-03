var some = {
    data: {},
    control: {
        progress: true
    },
    load: function(id){
        var selectedFile = $('#'+id)[0].files[0];
        var reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function(){
            // 读取数据
            some.data = JSON.parse(reader.result);
			// 渲染前some.data处理
			some.complement();
            // 显示数据
            some.render();
            // 数据载入完毕，游戏开始
            // some.gain.health();
            // some.gain.cash();
        };
    },
    save: function(aLink){
        var str = JSON.stringify(some.data, null, 4);
        str =  encodeURIComponent(str);
        aLink.href = "data:text/JSON;charset=utf-8,"+str;    
    },
    render: function(){
        // Player Properties
		var game = $('#game_frame');
        game.empty();
        for ( key in some.data['player'] ) {
            var key_element = document.createElement('p');
            key_element.innerText = key + ": " + some.data['player'][key];
            game.append(key_element);
        }
		
		// Player BackPack
		// First clean up items with number lower or equal 0.
		for ( item in some.data['backpack'] ) {
			if ( some.data['backpack'][item]['数量'] <= 0 ) {
				delete some.data['backpack'][item];
			}
		}
		// Second render them one by one.
		var possession = $('#item_list');
		possession.empty();
		for ( item in some.data['backpack'] ) {
			var item_element = document.createElement('li');
			item_element.innerHTML = "<p>" + item + "</p><p>" + some.data['backpack'][item]['数量'] + "</p>";
			possession.prepend(item_element);
		}
		
		// Recipe
		for ( recipe in some.data['recipe'] ) {
			var opt = document.createElement('option');
			opt.innerText = recipe;
			$('#synthesis').append(opt);
		}
		
		// Monster
		for ( monster in some.data['monster'] ) {
			var opt = document.createElement('option');
			opt.innerText = monster;
			$('#vs').append(opt);
		}
    },
	fight: function(who) {
		$('#ally').removeClass('ally_anim');
		$('#enemy').removeClass('enemy_anim');
		$('#apic').removeClass('apic_anim');
		$('#bpic').removeClass('bpic_anim');
		
		if ( who == 'selected' ) {
			
			
			var battler_mgr = document.getElementById('vs');
			var battler_id = battler_mgr.options[battler_mgr.selectedIndex].innerText;
			console.log(battler_id);
			$('#bname').text(battler_id);
			$('#btemp').text(some.data['monster'][battler_id]['沸点']);
			$('#bmp').text(some.data['monster'][battler_id]['熔点']);
			$('#bheal').text(some.data['monster'][battler_id]['沸点']-some.data['monster'][battler_id]['熔点']);
			$('#bpic').attr('src', 'img/PubChem/'+some.data['monster'][battler_id]['PubChemID']+'.jpg');
			
			var battler_list = Object.getOwnPropertyNames(some.data['monster']);
			var rand_battler_a_id = battler_list[some.rand( 0, battler_list.length - 1)];
			$('#aname').text(rand_battler_a_id);
			$('#atemp').text(some.data['monster'][rand_battler_a_id]['沸点']);
			$('#amp').text(some.data['monster'][rand_battler_a_id]['熔点']);
			$('#aheal').text(some.data['monster'][rand_battler_a_id]['沸点']-some.data['monster'][rand_battler_a_id]['熔点']);
			$('#apic').attr('src', 'img/PubChem/'+some.data['monster'][rand_battler_a_id]['PubChemID']+'.jpg');
			
// 			$('#apic').css('margin-right',0);
// 			$('#apic').css('opacity',0);
// 			$('#bpic').css('margin-left',0);
// 			$('#bpic').css('opacity',0);
			
// 			$('#ally').rotate(
// 				{
// 					angle: -90,
// 					animateTo: 0
// 				}
// 			);
// 			
// 			$('#enemy').rotate(
// 				{
// 					angle: 90,
// 					animateTo: 0
// 				}
// 			);
			
// 			$('#apic').animate(
// 				{
// 					marginRight: "200px",
// 					opacity: "1"
// 				}
// 			);
// 			
// 			$('#bpic').animate(
// 				{
// 					marginLeft: "200px",
// 					opacity: "1"
// 				}
// 			);
			

		}
		
		$('#ally').addClass('ally_anim');
		$('#enemy').addClass('enemy_anim');
		$('#apic').addClass('apic_anim');
		$('#bpic').addClass('bpic_anim');
	},
	form: function(selector) {
		if ( $(selector).css('display') == 'none' ) {
			$('.main').prepend($(selector));
			$(selector).fadeIn();
		}
		else {
			$(selector).fadeOut(function() {
				$('.main').prepend($(selector));
				$(selector).fadeIn();
			});
		}
		console.log(selector);
	},
    upgrade: function(){
        while ( some.data['player']['experience'] >= some.data['player']['level'] * 100 ) {
            some.value.decrease('experience', some.data['player']['level'] * 100);
            some.value.increase('level', 1);
        }
    },
    gain: {
        experience: function(by){
            some.value.increase('experience', by);
            some.upgrade();
        },
        health: function(){
            setInterval(function(){
                if ( some.data['player']['health'] < some.data['player']['level'] * 100 ) {
                    some.value.increase('health', 100);
                }
            }, 1000);
        },
        cash: function(){
            setInterval(function(){
                some.value.increase('ATP', 1);
            }, 1000)
        },
		item: function(ItemID, by){
			if ( some.data['backpack'].hasOwnProperty(ItemID) ) {
				some.data['backpack'][ItemID]['数量'] += 1;
			}
			else {
				some.data['backpack'][ItemID] = {
					"数量": 1,
					"单位": undefined
				};
			}
			console.log("恭喜你获得"+ItemID+"×"+by);
			some.render();
		}
    },
    value: {
        increase: function(key, by) {
            if ( some.control.progress ) {
                some.data['player'][key] += by;
                some.render();
            }
        },
        decrease: function(key, by) {
            if ( some.control.progress ) {
                some.data['player'][key] -= by;
                some.render();    
            }
        }
    },
	mine: function() {
		var items = Object.getOwnPropertyNames(some.data['item']);
		var fetch = some.rand(0, items.length - 1 );
		console.log( "恭喜你获得" + items[fetch] + "，物品序号：" + fetch );
		
		some.gain.item(items[fetch],1);
		
		some.render();
	},
	rand: function(min,max) {
		return Math.floor( Math.random() * ( max + 1 - min ) + min );
	},
	complement: function() {
		for ( recipe in some.data['recipe'] ) {
			for ( substrate in some.data['recipe'][recipe]['substrate'] ) {
				some.createItem(substrate);
			}
			for ( product in some.data['recipe'][recipe]['product'] ) {
				some.createItem(product);
			}
		}
	},
	react: function() {
		var reaction_mgr = document.getElementById('synthesis')
		var reaction_id = reaction_mgr.options[reaction_mgr.selectedIndex].innerText;
		console.log("即将进行的反应是："+reaction_id);
		if ( ! some.data['recipe'].hasOwnProperty(reaction_id) ) {
			console.log("反应不存在");
		}
		else {
			var sufficient = true;
			for ( substrate in some.data['recipe'][reaction_id]['substrate'] ) {
				if ( ! some.data['backpack'].hasOwnProperty(substrate) ) {
					console.log("找不到"+reaction_id+"的所需的原料"+substrate);
					sufficient = false;
				}
				else if ( some.data['backpack'][substrate]['数量'] < some.data['recipe'][reaction_id]['substrate'][substrate] ) {
					console.log(reaction_id+"需要"+substrate+"×"+some.data['recipe'][reaction_id]['substrate'][substrate]+"而你只有×"+some.data['backpack'][substrate]['数量']+"，因而无法进行反应");
					sufficient = false;
				}
			}
			
			if ( sufficient ) {
				for ( substrate in some.data['recipe'][reaction_id]['substrate'] ) {
					some.data['backpack'][substrate]['数量'] -= some.data['recipe'][reaction_id]['substrate'][substrate];
				}
				
				for ( product in some.data['recipe'][reaction_id]['product'] ) {
					some.gain.item(product,some.data['recipe'][reaction_id]['product'][product]);
				}
				console.log("反应完成");
			}
			else {
				console.log("无法进行反应");
			}
		}
	},
	createItem: function(ItemID) {
		if ( ! some.data['item'].hasOwnProperty(ItemID) ) {
			some.data['item'][ItemID] = false;
		}
		else {
			console.log( "Item " + ItemID + " already exists!");
		}
	},
	base: {
		mapper: ["-","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
		flow: function(inpnum) {
			var did = Number(inpnum);
			for (prin = ""; did > 52;) {
				pre = did;
				did = Math.floor(pre / 53);
				rem = (pre - (did * 53));
				trans = some.base.mapper[rem];
				prin = trans + prin;
			}
			rem = did;
			trans = some.base.mapper[rem];
			prin = trans + prin;
			return prin;
		},
		ebb: function(card, spl) {
			var pai;
			switch(card) {
				case 0:
					// 普通转换
					pai = 0;
				break;
				case 1:
					// 插加
					pai = 0;
				break;
				case 2:
					// 插乘
					pai = 1;
				break;
			}
			var len = spl.length;
			for (start = 0, stop = 1, ini = 1; ini <= len; ini++, start++, stop++) {
				var media = spl.substring(start, stop);
				vert = some.base.mapper.indexOf(media);
				
				switch(card) {
					case 0:
						mi = len - ini;
						rea = vert * Math.pow(53, mi);
						pai += rea;
					break;
					case 1:
						pai += vert;
					break;
					case 2:
						pai *= vert;
					break;
				}
			}
			
			return pai;
		},
		iterate: function(inpnum) {
			var hea = Number(inpnum);
			var res = new Array();
			// 十进制→53进制
			var out = some.base.flow(hea);
			// 53进制→插乘值
			out = some.base.ebb(2, out);
			var tai = out;
			console.log("第1个插乘值：" + tai + "，即将开始第2次运算。");
			res[0] = hea;
			res[1] = tai;
			for (wit = 2, wih = 3; hea != tai; wit++, wih++) {
				hea = tai;
				out = some.base.flow(hea);
				out = out = some.base.ebb(2, out);
				tai = out;
				console.log("第" + wit + "个插乘值：" + tai + "，即将开始第" + wih + "次运算。");
				res[wit] = tai;
			}
			
			return res;
		},
		analy: function(arise) {
			var someArray = arise.split(" ");
			var res = {};
			for (i in someArray) {
				console.log(some.base.ebb(1, someArray[i]));
				res[someArray[i]] = some.base.ebb(1, someArray[i]);
			}
			return res;
		}
	}
}
