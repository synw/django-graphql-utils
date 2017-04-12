from django.http import JsonResponse
from django.middleware.csrf import CsrfViewMiddleware, _compare_salted_tokens, _sanitize_token
from graphene_django.views import GraphQLView


class TGraphQLView(GraphQLView):
    
    def dispatch(self, request, *args, **kwargs):
        csrf_token = request.GET.get("t")
        if csrf_token is None:
            return JsonResponse({})
        request_csrf_token = _sanitize_token(csrf_token)
        if not _compare_salted_tokens(request_csrf_token, csrf_token):
            return JsonResponse({})
        return super(TGraphQLView, self).dispatch(request, *args, **kwargs)