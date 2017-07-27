from rest_framework import serializers
from django.contrib.auth.models import User


class UsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ("username", "email", "fist_name",
                  "last_name", "date_joined", "last_login", "is_staff")
        read_only_fields = fields

    def get_url(self, obj):
        return obj.get_absolute_url()

    def get_content_type(self, obj):
        return "user"
