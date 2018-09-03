var some = new Vue({
	el: '#whole',
	data: {
		career: {},
		aname: '？',
		atemp: 0,
		amp: 0,
		bname: '？',
		btemp: 0,
		bmp: 0,
		save_href: "#",
		apic: "img/PubChem/1.jpg",
		bpic: "img/PubChem/1.jpg",
		control: {
			progress: true
		},
		menus: [
			{
				img: "img/settings.jpg",
				name: "系统",
				func: "some.form('#game_control')"
			},
			{
				img: "img/home.jpg",
				name: "角色",
				func: "some.form('#game_frame')"
			},
			{
				img: "img/item.jpg",
				name: "物品",
				func: "some.form('#game_item')"
			},
			{
				img: "img/synthesis.jpg",
				name: "合成",
				func: "some.form('#game_synthesis')"
			},
			{
				img: "img/vs.jpg",
				name: "巅峰对决",
				func: "some.form('#game_vs')"
			},
			{
				img: "img/friends.jpg",
				name: "朋友",
			}
		],
		cheats: [
			{
				name: "加200经验",
				func: "some.gain.experience(200)"
			},
			{
				name: "暂停",
				func: "some.control.progress=false"
			},
			{
				name: "开始",
				func: "some.control.progress=true"
			},
			{
				name: "挖矿",
				func: "some.mine()"
			}
		],
		gain: {
			experience: function(by){
				some.value.increase('experience', by);
				some.upgrade();
			},
			health: function(){
				setInterval(function(){
					if ( some.career['player']['health'] < some.career['player']['level'] * 100 ) {
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
				if ( some.career['backpack'].hasOwnProperty(ItemID) ) {
					some.career['backpack'][ItemID]['数量'] += by;
				}
				else {
					Vue.set(some.career['backpack'], ItemID, {
						"数量": 1,
						"单位": undefined
					})
				}
				console.log("恭喜你获得"+ItemID+"×"+by);
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
		},
		value: {
			increase: function(key, by) {
				if ( some.control.progress ) {
					some.career['player'][key] += by;
					// some.render();
				}
			},
			decrease: function(key, by) {
				if ( some.control.progress ) {
					some.career['player'][key] -= by;
					// some.render();    
				}
			}
		}
	},
	computed: {
		aheal: function() {
			return this.atemp - this.amp;
		},
		bheal: function() {
			return this.btemp - this.bmp;
		}
	},
	methods: {
		rep: function(detail, skill) {
			// rep: function(event) {
			//     console.log(event.target.innerText);
			// }
			$(txt).prepend( "<p>" + this.aname + "对" + this.bname + "施放" + skill + "，造成" + detail.harm +"°C温度下降</p>" );
			this.btemp -= detail.harm;
			
			// 判定死亡
			if ( this.btemp <= this.bmp ) {
				$(txt).prepend( "<p>" + this.bname + "当前状态为固态，行动不能</p>" );
			}
		},
		load: function(event) {
			var selectedFile = event.target.files[0];
			var reader = new FileReader();
			reader.readAsText(selectedFile);
			reader.onload = function(){
				// 读取数据
				some.career = JSON.parse(reader.result);
				// 渲染前some.career处理
				some.complement();
				// 显示数据
				// // some.render();
				// 数据载入完毕，游戏开始
				// some.gain.health();
				// some.gain.cash();
			}
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
		save: function(event){
			var str = JSON.stringify(some.career, null, 4);
			str =  encodeURIComponent(str);
			this.save_href = "data:text/JSON;charset=utf-8,"+str;
			// event.target.click();
		},
		clean: function(){
			// Originally Render() Method
			// Every time you have lost items, you should invoke this function.
			// Player BackPack
			// First clean up items with number lower or equal 0.
			for ( item in some.career['backpack'] ) {
				if ( some.career['backpack'][item]['数量'] <= 0 ) {
					Vue.delete(some.career['backpack'], item);
				}
			}
			// Second render them one by one, which is done by Vue.
						
		},
		fight: function(who) {
			$(ally).removeClass('ally_anim');
			$(enemy).removeClass('enemy_anim');
			$('#pic img:nth-child(1)').removeClass('apic_anim');
			$('#pic img:nth-child(2)').removeClass('bpic_anim');
			
			if ( who == 'selected' ) {
				var battler_id = some.getChoice('vs');
				console.log(battler_id);
				this.bname = battler_id;
				this.btemp = some.career['monster'][battler_id]['沸点'];
				this.bmp = some.career['monster'][battler_id]['熔点'];
				this.bpic = 'img/PubChem/'+some.career['monster'][battler_id]['PubChemID']+'.jpg';
				
				var battler_list = Object.getOwnPropertyNames(some.career['monster']);
				// -2, not -1 in order to avoid __ob__
				var rand_battler_a_id = battler_list[some.rand( 0, battler_list.length - 2)];
				this.aname = rand_battler_a_id;
				this.atemp = some.career['monster'][rand_battler_a_id]['沸点'];
				this.amp = some.career['monster'][rand_battler_a_id]['熔点'];
				this.apic = 'img/PubChem/'+some.career['monster'][rand_battler_a_id]['PubChemID']+'.jpg';
			}
			
			$(ally).addClass('ally_anim');
			$(enemy).addClass('enemy_anim');
			$('#pic img:nth-child(1)').addClass('apic_anim');
			$('#pic img:nth-child(2)').addClass('bpic_anim');
		},
		upgrade: function(){
			while ( some.career['player']['experience'] >= some.career['player']['level'] * 100 ) {
				some.value.decrease('experience', some.career['player']['level'] * 100);
				some.value.increase('level', 1);
			}
		},
		mine: function() {
			var items = Object.getOwnPropertyNames(some.career['item']);
			// -2, not -1 in order to avoid __ob__
			var fetch = some.rand(0, items.length - 2 );
			console.log( "恭喜你获得" + items[fetch] + "，物品序号：" + fetch );
			
			some.gain.item(items[fetch],1);
			
			// some.render();
		},
		rand: function(min,max) {
			return Math.floor( Math.random() * ( max + 1 - min ) + min );
		},
		complement: function() {
			for ( recipe in some.career['recipe'] ) {
				for ( substrate in some.career['recipe'][recipe]['substrate'] ) {
					some.createItem(substrate);
				}
				for ( product in some.career['recipe'][recipe]['product'] ) {
					some.createItem(product);
				}
			}
		},
		react: function() {
			var reaction_id = some.getChoice('synthesis');
			console.log("即将进行的反应是："+reaction_id);
			if ( ! some.career['recipe'].hasOwnProperty(reaction_id) ) {
				console.log("反应不存在");
			}
			else {
				var sufficient = true;
				for ( substrate in some.career['recipe'][reaction_id]['substrate'] ) {
					if ( ! some.career['backpack'].hasOwnProperty(substrate) ) {
						console.log("找不到"+reaction_id+"的所需的原料"+substrate);
						sufficient = false;
					}
					else if ( some.career['backpack'][substrate]['数量'] < some.career['recipe'][reaction_id]['substrate'][substrate] ) {
						console.log(reaction_id+"需要"+substrate+"×"+some.career['recipe'][reaction_id]['substrate'][substrate]+"而你只有×"+some.career['backpack'][substrate]['数量']+"，因而无法进行反应");
						sufficient = false;
					}
				}
				
				if ( sufficient ) {
					for ( substrate in some.career['recipe'][reaction_id]['substrate'] ) {
						some.career['backpack'][substrate]['数量'] -= some.career['recipe'][reaction_id]['substrate'][substrate];
					}
					some.clean();
					
					for ( product in some.career['recipe'][reaction_id]['product'] ) {
						some.gain.item(product,some.career['recipe'][reaction_id]['product'][product]);
					}
					console.log("反应完成");
				}
				else {
					console.log("无法进行反应");
				}
			}
		},
		createItem: function(ItemID) {
			if ( ! some.career['item'].hasOwnProperty(ItemID) ) {
				some.career['item'][ItemID] = false;
			}
			else {
				console.log( "Item " + ItemID + " already exists!");
			}
		},
		getChoice: function(selectID) {
			var mgr = document.getElementById(selectID);
			return mgr.options[mgr.selectedIndex].innerText.trim();
		}
	}
})
