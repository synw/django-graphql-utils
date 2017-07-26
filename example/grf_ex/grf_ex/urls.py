from django.conf.urls import url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from graphene_django.views import GraphQLView
from graphql_utils.views import TGraphQLView
from grf_ex.views import IndexView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^graphql', TGraphQLView.as_view()),
]

if settings.DEBUG:
    urlpatterns += [url(r'^graphiql', GraphQLView.as_view(graphiql=True)), ]
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

urlpatterns.append(url(r'^', IndexView.as_view()),)
