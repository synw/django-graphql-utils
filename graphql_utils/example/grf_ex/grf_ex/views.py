from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer
from django.views.generic import TemplateView
from django.contrib.auth.models import User
from grf_ex.serializers import UserSerializer


class IndexView(TemplateView):
    template_name = "index.html"


class JSONResponse(HttpResponse):

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


def usersView(request):
    q = User.objects.filter(active=True)
    serializer = UserSerializer(q, many=True)
    return JSONResponse(serializer.data)
