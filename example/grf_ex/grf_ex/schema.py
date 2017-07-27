import graphene
from graphene import relay
from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.debug import DjangoDebug
from django.contrib.auth.models import User


class UserNode(DjangoObjectType):
    class Meta:
        model = User
        only_fields = ("username", "email", "fist_name",
                       "last_name", "date_joined", "last_login", "is_staff")

        filter_fields = {
            'username': ['exact'],
            'first_name': ['exact', 'icontains', 'istartswith'],
            'last_name': ['exact', 'icontains', 'istartswith'],
            'email': ['exact', 'icontains', 'istartswith']
        }
        interfaces = (relay.Node, )


class UQuery(graphene.AbstractType):
    all_users = DjangoFilterConnectionField(UserNode)
    user = graphene.Field(UserNode,
                          username=graphene.String())

    def resolve_all_users(self, args, context, info):
        return User.objects.filter(is_active=True)

    def resolve_user(self, args, context, info):
        username = args.get('username')
        if username is not None:
            return User.objects.get(username=username)
        return None


class Query(UQuery, graphene.ObjectType):
    debug = graphene.Field(DjangoDebug, name='__debug')


schema = graphene.Schema(query=Query)
