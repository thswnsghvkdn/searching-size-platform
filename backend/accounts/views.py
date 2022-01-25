from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView
from .serializers import SignupSerializer
from .models import Profile , WeightBias
from .serializers import ProfileSerializer
import requests
import json
from django.contrib.auth import authenticate , login , logout
from django.views.decorators.csrf import csrf_exempt
from django.http import (
    JsonResponse,
)  # django.http에서 서버의 요청에 대한 응답을 Json으로 응답하기 위해 JsonResponse 가져오기
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response



# 회원가입 view
class SignupView(CreateAPIView):
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
    
class LoginView(APIView):
    def post(self, request):
        # 넘어온 아이디와 비번으로 장고 authenticate가 로그인 성공시 모델 인스턴스를 반환해준다.
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user is not None:
            # 로그인이 성공했을 경우 토큰을 가져온다.
            token = Token.objects.get(user=user)
            return Response({"Token": token.key})
        else:
            return Response(status=401)
        
# height
Outseam = {}
Rise = {}
Back = {}
Arm = {}
# weight
Thigh = {}
Waist = {}
Chest = {}
Shoulder = {}


# 제일 유행하는 사이즈 찾기
@csrf_exempt
def mapping_size(request):
    if request.method == "GET":
        queryset = Profile.objects.all()
        # 키와 그에따른 총장 해당 총장을 검색한 사람들 횟수를 2차원 딕셔너리로 매핑
        for query in queryset :
            # 키에 해당하는 사이즈 (총장 , 밑위 , 등 , 소매)
            if(query.height > 0) :
                # 해당 키를 갖는 사용자들이 검색한 수치들
                cnt = {}
                try :
                    cnt = Outseam[query.height]
                except KeyError : # 키가 없을 경우 딕셔너리 생성
                    Outseam[query.height] = {}
                    cnt = {}
                if query.searchOutseam > 0 :
                    try :
                        Outseam[query.height][query.searchOutseam] = cnt[query.searchOutseam] + 1 
                    except KeyError : # 키가 없을 경우 딕셔너리 생성
                        Outseam[query.height][query.searchOutseam] = 1
                
                # 해당 키를 갖는 사용자들이 검색한 밑위 수치들
                cnt = {}
                try :
                    cnt = Rise[query.height]
                except KeyError : # 키가 없을 경우 딕셔너리 생성
                    Rise[query.height] = {}
                    cnt = {}
                if query.searchRise > 0 :
                    try :
                        Rise[query.height][query.searchRise] = cnt[query.searchRise] + 1 
                    except KeyError : # 키가 없을 경우 딕셔너리 생성
                        Rise[query.height][query.searchRise] = 1
                
                # 해당 키를 갖는 사용자들이 검색한 등(상의 총장) 수치들
                cnt = {}
                try :
                    cnt = Back[query.height]
                except KeyError : # 키가 없을 경우 딕셔너리 생성
                    Back[query.height] = {}
                    cnt = {}
                if query.searchBack > 0 :
                    try :
                        Back[query.height][query.searchBack] = cnt[query.searchBack] + 1 
                    except KeyError : # 키가 없을 경우 딕셔너리 생성
                        Back[query.height][query.searchBack] = 1
                
                # 해당 키를 갖는 사용자들이 검색한 소매 수치들
                cnt = {}
                try :
                    cnt = Arm[query.height]
                except KeyError : # 키가 없을 경우 딕셔너리 생성
                    Arm[query.height] = {}
                    cnt = {}
                if query.searchArm > 0 :
                    try :
                        Arm[query.height][query.searchArm] = cnt[query.searchArm] + 1 
                    except KeyError : # 키가 없을 경우 딕셔너리 생성
                        Arm[query.height][query.searchArm] = 1
            
            
            # 몸무게에 해당하는 사이즈 (허벅지, 허리, 가슴, 어깨)
            if(query.weight > 0) :
                # 해당 키를 갖는 사용자들이 검색한 수치들
                cnt = {}
                try :
                    cnt = Thigh[query.weight]
                except KeyError : # 키가 없을 경우 딕셔너리 생성
                    Thigh[query.weight] = {}
                    cnt = {}
                if query.searchThigh > 0 :
                    try :
                        Thigh[query.weight][query.searchThigh] = cnt[query.searchThigh] + 1 
                    except KeyError : # 키가 없을 경우 딕셔너리 생성
                        Thigh[query.weight][query.searchThigh] = 1
                
                # 해당 키를 갖는 사용자들이 검색한 허리 수치들
                cnt = {}
                try :
                    cnt = Waist[query.weight]
                except KeyError : # 키가 없을 경우 딕셔너리 생성
                    Waist[query.weight] = {}
                    cnt = {}
                if query.searchWaist > 0 :
                    try :
                        Waist[query.weight][query.searchWaist] = cnt[query.searchWaist] + 1 
                    except KeyError : # 키가 없을 경우 딕셔너리 생성
                        Waist[query.weight][query.searchWaist] = 1
                
                # 해당 키를 갖는 사용자들이 검색한 가슴 수치들
                cnt = {}
                try :
                    cnt = Chest[query.weight]
                except KeyError : # 키가 없을 경우 딕셔너리 생성
                    Chest[query.weight] = {}
                    cnt = {}
                if query.searchChest > 0 :
                    try :
                        Chest[query.weight][query.searchChest] = cnt[query.searchChest] + 1 
                    except KeyError : # 키가 없을 경우 딕셔너리 생성
                        Chest[query.weight][query.searchChest] = 1
                
                # 해당 키를 갖는 사용자들이 검색한 어깨 수치들
                cnt = {}
                try :
                    cnt = Shoulder[query.weight]
                except KeyError : # 키가 없을 경우 딕셔너리 생성
                    Shoulder[query.weight] = {}
                    cnt = {}
                if query.searchShoulder > 0 :
                    try :
                        Shoulder[query.weight][query.searchShoulder] = cnt[query.searchShoulder] + 1 
                    except KeyError : # 키가 없을 경우 딕셔너리 생성
                        Shoulder[query.weight][query.searchShoulder] = 1




        # 2차원 딕셔너리 정렬 , 해당 키에서 가장 많이 검색한 결과
        for height in Outseam :
            Outseam[height] = sorted(Outseam[height].items() , key = lambda x : x[1] , reverse=True)
        for height in Rise :
            Rise[height] = sorted(Rise[height].items() , key = lambda x : x[1] , reverse=True)
        for height in Back :
            Back[height] = sorted(Back[height].items() , key = lambda x : x[1] , reverse=True)
        for height in Arm :
            Arm[height] = sorted(Arm[height].items() , key = lambda x : x[1] , reverse=True)
        

        for weight in Thigh :
            Thigh[weight] = sorted(Thigh[weight].items() , key = lambda x : x[1] , reverse=True)
        for weight in Waist :
            Waist[weight] = sorted(Waist[weight].items() , key = lambda x : x[1] , reverse=True)
        for weight in Chest :
            Chest[weight] = sorted(Chest[weight].items() , key = lambda x : x[1] , reverse=True)
        for weight in Shoulder :
            Shoulder[weight] = sorted(Shoulder[weight].items() , key = lambda x : x[1] , reverse=True)
       
       
        # 가장 많이 검색된 수치가 저장되어 있는 인덱스 
        # for height in Outseam :
        #     print(Outseam[height][0][0])
        # print(request.user)
        
        wbModel = WeightBias.objects.get(model_pk = 1)
        a, b = getWeight( Outseam  ) 
        if b != 4044 : 
            wbModel.outseamW = a 
            wbModel.outseamB = b 
        a, b = getWeight( Rise ) 
        if b != 4044 : 
            wbModel.riseW = a 
            wbModel.riseB = b 
        a, b = getWeight( Back ) 
        if b != 4044 : 
            wbModel.backW = a 
            wbModel.backB = b 
        a, b = getWeight( Arm ) 
        if b != 4044 : 
            wbModel.armW = a 
            wbModel.armB = b 
        a, b = getWeight( Thigh ) 
        if b != 4044 : 
            wbModel.thighW = a 
            wbModel.thighB = b 
        a, b = getWeight( Waist ) 
        if b != 4044 : 
            wbModel.waistW = a 
            wbModel.waistB = b
        a, b = getWeight( Chest ) 
        if b != 4044 : 
            wbModel.chestW = a 
            wbModel.chestB = b 
        a, b = getWeight( Shoulder ) 
        if b != 4044 : 
            wbModel.shoulderW = a 
            wbModel.shoulderB = b
        wbModel.save()  
        return  JsonResponse({"message": "Hello World"}, status=200)


# 신체 종류에 대한 객체를 받아서 해당 신체치수와 가장 많이 검색된 사이즈를 토대로 직선의 가중치와 편향을 반환
def getWeight(size_obj ) :
    # 키 값을 저장
    x_data = []
    # 해당 키의 유저들이 가장 많이 검색한 사이즈
    t_data = []

    
    # 관계식 도출하기
    for heightOrWeight in size_obj :
        if len(size_obj[heightOrWeight]) :     
            t_data.append(size_obj[heightOrWeight][0][0])
            x_data.append(heightOrWeight)

    if(len(x_data) == 0 or len(t_data) == 0) :
        return  (4044 , 4044)

    x_bar = sum(x_data) / len(x_data)
    y_bar = sum(t_data) / len(t_data)

    a = sum([(y - y_bar) * (x - x_bar) for y, x in list(zip(t_data, x_data))])
    a /= sum([(x - x_bar) ** 2 for x in x_data])
    b = y_bar - a * x_bar
    # 가중치와 편향 반환
    return (a, b)

# 상의 사이즈 추천
# @csrf_exempt
# def recommend_top(request):
class recommend_top(APIView):

    def post(self, request, format = None):
        print(request.user)
        print(request.auth)
        
        # request body 로 넘어온 유저 이름을 이용하여 유저데이터를 가져온다
        name = request.user
        userModel = Profile.objects.get(username = name)
        # 가져온 유저데이터의 키, 몸무게
        height = userModel.height
        weight = userModel.weight

        # 도출한 직선의 방정식에 해당 유저의 키와 몸무게를 대입하여 결과 추천 값을 저장
        wbModel = WeightBias.objects.get(model_pk = 1)
        back = wbModel.backW * height + wbModel.backB
        arm = wbModel.armW * height + wbModel.armB
        chest = wbModel.chestW * weight + wbModel.chestB
        shoulder = wbModel.shoulderW * weight + wbModel.shoulderB
        

        # 키와 몸무게가 0 일 경우 해당 관련 사이즈는 0으로 추천된다
        if height == 0 :
             return  JsonResponse({"back": 0 ,"arm": 0 , "chest": chest ,"shoulder": shoulder , "height" : height , "weight" : weight }, status=200)
        
        if weight == 0 :
             return  JsonResponse({"back": back ,"arm": arm , "chest": 0 ,"shoulder": 0 , "height" : height , "weight" : weight }, status=200)
        


        #추천 사이즈 반환
        return  JsonResponse({"back": back ,"arm": arm , "chest": chest ,"shoulder": shoulder , "height" : height , "weight" : weight }, status=200)



                