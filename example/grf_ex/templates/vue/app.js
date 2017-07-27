{% include "graphql_utils/methods.js" %}
const app = new Vue({
	el: '#app',
	data () {
		return {
			users: [],
			show: undefined,
			data: undefined,
			rawData: undefined,
			previousPage: undefined,
			nextPage: undefined,
			startCursor: undefined,
			endCursor: undefined,
		}
	},
	methods: {
		getUsers: function() {
			var q = "{allUsers(first:5){edges{node{username,email}cursor}pageInfo{startCursor,endCursor,hasNextPage,hasPreviousPage}}}";
			this.show = "allUsers";
			this.runQuery(q, "forward");
		},
		goNextPage: function() {
			var q = '{allUsers(first:5,after:"'+this.endCursor+'"){edges{node{username,email}cursor}pageInfo{startCursor,endCursor,hasNextPage,hasPreviousPage}}}';
			this.show = "nextPage";
			this.runQuery(q, "forward");
			this.previousPage = true;
			console.log(q);
		},
		goPreviousPage: function() {
			var q = '{allUsers(last:5,before:"'+this.startCursor+'"){edges{node{username,email}cursor}pageInfo{startCursor,endCursor,hasNextPage,hasPreviousPage}}}';
			this.show = "previousPage";
			this.runQuery(q, "backward");
			this.nextPage = true;
			console.log(q);
		},
		setPagination: function(payload, pagination) {
			if (pagination === "forward") {
				this.nextPage = payload.allUsers.pageInfo.hasNextPage;
			} else if (pagination === "backward") {
				this.previousPage = payload.allUsers.pageInfo.hasPreviousPage;
			}
			this.endCursor = payload.allUsers.pageInfo.endCursor;
			this.startCursor = payload.allUsers.pageInfo.startCursor;
		},
		runQuery: function(q, pagination) {
			var request = new XMLHttpRequest();
			var url = "/graphql/?query="+encodeURIComponent(q)+"&t={{ csrf_token }}";
			request.open('GET', url, true);
			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
					var data = JSON.parse(request.responseText).data;
					// process data
					// app is used instead of this because of the closure
					app.users = app.decodePayload(data); 
					app.rawData = JSON.stringify(data, null, 2);
					app.setPagination(data, pagination)
				} else {
					console.log("ERROR runing query", q);
				}
			};
			request.onerror = function() {
				console.log("ERROR runing query", q);
			}
			request.send();
		},
		decodePayload: function(payload) {
			var udata = payload.allUsers.edges;
			var users = [];
			for (i = 0; i < udata.length; i++) {
				var u = udata[i].node;
				var user = {"username": u.username, "email": u.email};
				users[users.length] = user;
			};
			return users
		},
	},
});
