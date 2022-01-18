from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView
from .serializers import SignupSerializer
from .models import Profile
from .serializers import ProfileSerializer
import requests
from django.contrib.auth import authenticate , login , logout
from django.views.decorators.csrf import csrf_exempt
from django.http import (
    JsonResponse,
)  # django.http에서 서버의 요청에 대한 응답을 Json으로 응답하기 위해 JsonResponse 가져오기

# 회원가입 view
class SignupView(CreateAPIView):
    # 모델은 장고가 기본 제공하는 유저모델 (id 와 pw)
    model = get_user_model()
    # seliaizer 로 json 데이터를 db 인스턴스로 변환
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

@csrf_exempt
def login(request) :
    print(request.POST)
    if request.method == "POST" :
        name = request.POST['username']
        pw = request.POST['password']
        
        user = authenticate(username = name , password = pw)
        if user is not None :
            message = "로그인"
            login(request, user)
            print(request.user)
            print("login")
            return  JsonResponse({"name": request.user}, status=200)
        else :
            message = "로그인"
            return  JsonResponse({"message": message}, status=400) 
        


# 제일 유행하는 사이즈 찾기
@csrf_exempt
def mapping_size(request):
    if request.method == "GET":
        queryset = Profile.objects.all()
        # 키와 그에따른 총장 해당 총장을 검색한 사람들 횟수를 2차원 딕셔너리로 매핑
        heights = {}
        for query in queryset :
            if(query.height > 0) :
                # 해당 키를 갖는 사용자들이 검색한 수치들
                cnt = {}
                try :
                    cnt = heights[query.height]
                except KeyError : # 키가 없을 경우 딕셔너리 생성
                    heights[query.height] = {}
                    cnt = {}
                if query.searchHeight > 0 :
                    try :
                        heights[query.height][query.searchHeight] = cnt[query.searchHeight] + 1 
                    except KeyError : # 키가 없을 경우 딕셔너리 생성
                        heights[query.height][query.searchHeight] = 1
        # 2차원 딕셔너리 정렬 , 해당 키에서 가장 많이 검색한 결과
        for height in heights :
            heights[height] = sorted(heights[height].items() , key = lambda x : x[1] , reverse=True)
        # 가장 많이 검색된 수치가 저장되어 있는 인덱스 
        for height in heights :
            print(heights[height][0][0])
        print(request.user)



        return  JsonResponse({"message": "Hello World"}, status=200)

