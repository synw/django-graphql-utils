{% include "graphql_utils/methods.js" %}
const app = new Vue({
	el: '#app',
	data () {
		return {
			users: [],
			show: undefined,
			rawData: undefined,
			previousPage: undefined,
			nextPage: undefined,
			endCursor: undefined,
		}
	},
	methods: {
		error: function() {
			console.log("An error has occured");
		},
		action: function(data) {
			this.users = this.decodePayload(data);
			this.rawData = JSON.stringify(data, null, 2);
			this.setPagination(data);
		},
		getUsers: function() {
			var q = "{allUsers(first:5){edges{node{username,email}cursor}pageInfo{startCursor,endCursor,hasNextPage,hasPreviousPage}}}";
			this.show = "allUsers";
			//runQuery is from graphql_utils/methods.js
			runQuery(q, this.action, this.error);
		},
		goNextPage: function() {
			var q = '{allUsers(first:5,after:"'+this.endCursor+'"){edges{node{username,email}cursor}pageInfo{startCursor,endCursor,hasNextPage,hasPreviousPage}}}';
			this.show = "nextPage";
			//runQuery is from graphql_utils/methods.js
			runQuery(q, this.action, this.error);
			console.log(q);
		},
		setPagination: function(payload) {
			this.nextPage = payload.allUsers.pageInfo.hasNextPage;
			this.previousPage = payload.allUsers.pageInfo.hasPreviousPage;
			this.endCursor = payload.allUsers.pageInfo.endCursor;
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
