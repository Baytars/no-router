var some = new Vue({
	el: '#whole',
	data: {
		patient: {
			"体温": 37.5,
			"收缩压": 160,
			"舒张压": 80
		}
	},
	// Feature
	computed: {
		ills: function() {
			var res = {
				"高血压": false,
				"低体温": false,
				"高体温": false
			}
			if ( this.patient['收缩压'] > 140 | this.patient['舒张压'] > 90 ) {
				res['高血压'] = true
			}
			if ( this.patient['体温'] > 37 ) {
				res['高体温'] = true
			}
			else if ( this.patient['体温'] < 36.1 ) {
				res['低体温'] = true
			}
			return res
		}
	},
	methods: {}
})