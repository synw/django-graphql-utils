{% include "graphql_utils/methods.js" %}
const app = new Vue({
	el: '#app',
	data () {
		return {
			users: [],
			user: undefined,
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
		getUser: function(username) {
			var q = '{user(username:"'+username+'"){username,email,dateJoined,lastLogin,isStaff}}';
			this.show = "userdetail";
			this.flush();
			this.runQuery(q, null, "user");
		},
		getUsers: function() {
			var q = "{allUsers(first:5){edges{node{username,email}cursor}pageInfo{startCursor,endCursor,hasNextPage,hasPreviousPage}}}";
			this.show = "allUsers";
			this.flush();
			this.runQuery(q, "forward", "allUsers");
			this.user = undefined;
		},
		goNextPage: function() {
			var q = '{allUsers(first:5,after:"'+this.endCursor+'"){edges{node{username,email}cursor}pageInfo{startCursor,endCursor,hasNextPage,hasPreviousPage}}}';
			this.show = "nextPage";
			this.flush();
			this.runQuery(q, "forward", "allUsers");
			this.previousPage = true;
			this.user = undefined;
			console.log(q);
		},
		goPreviousPage: function() {
			var q = '{allUsers(last:5,before:"'+this.startCursor+'"){edges{node{username,email}cursor}pageInfo{startCursor,endCursor,hasNextPage,hasPreviousPage}}}';
			this.show = "previousPage";
			this.flush();
			this.runQuery(q, "backward", "allUsers");
			this.user = undefined;
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
		runQuery: function(q, pagination, q_type) {
			var request = new XMLHttpRequest();
			var url = "/graphql/?query="+encodeURIComponent(q)+"&t={{ csrf_token }}";
			request.open('GET', url, true);
			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
					var data = JSON.parse(request.responseText).data;
					// process data
					// app is used instead of this because of the closure
					if (q_type === "user") {
						app.user = app.decodePayload(data, "user");
					} else {
						app.users = app.decodePayload(data); 
						app.setPagination(data, pagination)
					}
					app.rawData = JSON.stringify(data, null, 2);
				} else {
					console.log("ERROR runing query", q);
				}
			};
			request.onerror = function() {
				console.log("ERROR runing query", q);
			}
			request.send();
		},
		flush: function() {
			this.user = undefined;
			this.users = [];
			this.nextPage = undefined;
			this.previousPage = undefined;
		},
		decodePayload: function(payload, q_type) {
			var udata = {};
			if (q_type !== "user") {
				udata = payload.allUsers.edges;
				var users = [];
				for (i = 0; i < udata.length; i++) {
					var u = udata[i].node;
					var user = {"username": u.username, "email": u.email};
					users[users.length] = user;
				};
				return users
			} else {
				var u = {"username": payload.user.username,"email": payload.user.email,"last_login": payload.user.lastLogin,"date_joined": payload.user.dateJoined,"is_staff": payload.user.isStaff};
			}
			return u
			
		},
	},
});
