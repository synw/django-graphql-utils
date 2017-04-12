function runQuery(q, action, error, verbose) {
	var request = new XMLHttpRequest();
	var url = "/graphql/?query="+encodeURIComponent(q)+"&t={{ csrf_token }}";
	if (verbose === true) {
		console.log("Fetching query: "+q);
	}
	request.open('GET', url, true);
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText);
			if (verbose === true) {
				console.log("Fetched data: "+JSON.stringify(data, null, 2));
			}
			action(data.data)
		} else {
			error();
		}
	};
	request.onerror = function() {
		error();
	}
	request.send();
}