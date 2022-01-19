from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

class SignupSerializer(serializers.ModelSerializer):
    # 비밀번호는 암호화하여 저장하여야 한다
    password = serializers.CharField(write_only = True)
    def create(self, validated_data) :
        user = User.objects.create(username = validated_data['username'])
        # 비밀번호의 경우는 set_password라는 메소드를 이용하여 저장하여야 한다
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta :
        model = User
        fields = ["pk" , "username" , "password"]




# 프로필 시리얼라이저
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("username" , "user_pk", "nickname", "height", "weight" , "age"  )
