var diagnosis = {
	data: {},
	history: {},
	debug: false,
	autoload: true,
    update: function(){
		var game = $('#game_frame');
        game.empty();
		if ( typeof(diagnosis.data) == 'string' ) {
			var judgement = document.createElement('p');
			judgement.innerText = "您的最终诊断是：" + diagnosis.data;
			game.append("<hr>");
			game.append(judgement);
			game.append("<hr>");
			var play_back = document.createElement('button');
			play_back.innerText = "再来一遍";
			play_back.onclick = function() {
				location.reload();
			}
			game.append(play_back);
		}
		else
		{
			var q = document.createElement('p');
			var doubt = document.createElement('p');
			for ( key in diagnosis.data ) {
				if ( key == '初步诊断' ) {
					doubt.innerText = "我的初步诊断是：" + diagnosis.data[key].join("、") + "，一共" + diagnosis.data[key].length + "种。";
				}
				else {
					q.innerText = "有" + key + "吗？";
					for ( option in diagnosis.data[key] ) {
						var a = document.createElement('button');
						a.innerText = option;
						a.consequence = diagnosis.data[key][option];
						a.onclick = function(){
							diagnosis.data = this.consequence;
							diagnosis.history[key] = this.innerText;
							diagnosis.update();
						}
						game.append(a);
						if ( a.consequence['初步诊断'] == undefined ) {
							game.append( " → " + a.consequence );
						}
						else {
							game.append( " → " + a.consequence['初步诊断'].join("、") );							
						}
						game.append('<br>');
						if ( diagnosis.debug ) {
							var debug_data = document.createElement('p');
							debug_data.innerText = JSON.stringify(a.consequence, null, 4);
							game.append(debug_data);
							game.append('<br>');
						}
					}
					break;
				}
			}
			game.prepend(q);
			game.prepend("<hr>");
			game.prepend(doubt);
			game.prepend("<hr>");
		}
		
		var history_record = document.createElement('p');
		history_record.innerHTML = "<h2>Your complaints: </h2>";
		for ( history_key in diagnosis.history ){
			var append_str = history_key + "：" + diagnosis.history[history_key] + "<br>";
			history_record.innerHTML += append_str ;
		}
		game.prepend(history_record);
		game.prepend("<hr>");
    },
	load: function(id){
		var selectedFile = $('#'+id)[0].files[0];
		var reader = new FileReader();
		reader.readAsText(selectedFile);
		reader.onload = function(){
			// 读取数据
			diagnosis.data = JSON.parse(reader.result);
			// 显示数据
			diagnosis.update();
			// 数据载入完毕，游戏开始
		};
	},
	read: function(filepath) {
		$.getJSON(filepath, function(data, status){
			if( status == 'success' ) {
				// 读取数据
				diagnosis.data = data;
				// 显示数据
				diagnosis.update();
				// 数据载入完毕，游戏开始
			}
		});
	}
}

if ( diagnosis.autoload ) {
	diagnosis.read("data/diagnosis.json");
}
