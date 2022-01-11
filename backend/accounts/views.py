from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView
from .serializers import SignupSerializer
from .models import Profile
from .serializers import ProfileSerializer

# 회원가입 view
class SignupView(CreateAPIView):
    # 모델은 장고가 기본 제공하는 유저모델 (id 와 pw)
    model = get_user_model()
    # seliaizer 로 유저모델을 직렬화 한다
    serializer_class = SignupSerializer
    # 회원가입페이지 접근권한
    permission_classes = [
        AllowAny,
    ]
    
# accounts/views.py
class ProfileUpdateAPI(generics.UpdateAPIView):
    lookup_field = "user_pk"
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer 

