from djoser.serializers import UserSerializer, UserCreateSerializer
from .models import CustomUser
from .models import Feedback
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password


class CustomUserSerializer(UserSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'is_staff', 'phone', 'address')


class CustomUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    re_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'password', 're_password', 'is_staff', 'phone', 'address')

    def validate(self, attrs):
        password = attrs.get('password')
        re_password = attrs.get('re_password')

        if password != re_password:
            raise serializers.ValidationError({"re_password": "Passwords must match."})

        # Validate the password (optional)
        validate_password(password)

        return attrs

    def create(self, validated_data):
        # Remove the re_password field before creating the user
        validated_data.pop('re_password', None)
        user = CustomUser.objects.create_user(**validated_data)
        return user






class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'name', 'email', 'feedback_type', 'comments', 'sentiment', 'tags', 'created_at']
    