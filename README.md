# Django Graphql utils

- Protect your endpoint with a Django csrf token
- Ready to use javascript function to run queries client side

### Install


  ```bash
pip install graphene graphene_django django-filter
pip install git+https://github.com/synw/django-graphql-utils.git
  ```
  
Installed apps:

  ```python
"graphene",
"graphene_django",
"graphql_utils",
  ```

Urls:

  ```python
from graphene_django.views import GraphQLView
from graphql_utils.views import TGraphQLView

urlpatterns = [
	# ...
	# this is a normal graphql endpoint:
	url(r'^graphiql', GraphQLView.as_view(graphiql=True)),
	# this is a token protected endpoint:
    url(r'^graphql', TGraphQLView.as_view()),
]
  ```

Refer the the [Graphene documentation](http://docs.graphene-python.org/projects/django/en/latest/) for 
how to set up the backend schemas

### Client side querying

A javascript function to run queries is available: it will automaticly add the token to the request. 
Use `{% include "graphql_utils/methods.js" %}` then:

  ```javascript
var q = 'query{mymodel(field1:"name"){field1,field2,field3}}';
function error() {
	console.log("An error has occured");
}
function action(data) {
	console.log("Fetched json data: "+JSON.stringify(data));
}

runQuery(q, action, error, true);
// The last parameter is to set the verbosity of the function, false by default
  ```
