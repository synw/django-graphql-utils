# Django Graphql utils

- Protect your endpoint with a Django csrf token
- Ready to use javascript function to run queries client side

An [example](#graphql-app-example) of a graphql implementation is available. It covers how to query on lists of objects and
single objects, using pagination.

### Install


  ```bash
pip install django-graphql_utils
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

A javascript function to run queries is available: it will automaticaly add the token to the request. 

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

### Graphql app example

This example uses the `User` model and a Vue.js frontend. To install go into the destination directory and:

   ```bash
   git clone https://github.com/synw/django-graphql-utils
   cp -R django-graphql-utils/example/grf_ex .
   virtualenv -p python3 .
   source bin/activate
   pip install -r django-graphql-utils/example/requirements.txt
   cd grf_ex
   python3 manage.py runserver
   ```
   
 Note: the database is populated with fake data
