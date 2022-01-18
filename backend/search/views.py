from typing import get_origin
import requests
import json
from bs4 import BeautifulSoup
from django.http import (
    JsonResponse,
)  # django.http에서 서버의 요청에 대한 응답을 Json으로 응답하기 위해 JsonResponse 가져오기
from django.views.decorators.csrf import csrf_exempt
from multiprocessing import Pool
from django.apps import apps


# 다른 앱 모델 가져오기
model = apps.get_model('accounts' , 'Profile')
queryset = model.objects.all()

# tensorflow 
# import tensorflow as tf
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Flatten, Dense
# from tensorflow.keras.optimizers import SGD , Adam

# import numpy as np

# # tensorflow 이용 치수 추천 
# @csrf_exempt
# def size_predict(request):
#    if request.method == "GET":
#         print("hi")
#         x_data = np.array([170, 172, 174 , 176])
#         t_data = np.array([100, 102, 104 , 106])
#         model = Sequential()
#         model.add(Dense(1, input_shape=(1,), activation = 'linear'))
#         model.compile(optimizer=SGD(learning_rate = 0.00003) , loss = 'mse')
#         model.fit(x_data , t_data , epochs= 100)
#         test_data = [178 ,180]
#         print(model.predict(np.array(test_data)))
#         return  JsonResponse({"message": "Hello World"}, status=200)

# 직접 최소제곱법으로 가중치와 편향 구하기
@csrf_exempt
def size_predict2(request):
   if request.method == "GET":
        print("hi")
        x_data = [170, 172, 174 , 176]
        t_data = [100, 102, 104 , 104]

        x_bar = sum(x_data) / len(x_data)
        y_bar = sum(t_data) / len(t_data)

        a = sum([(y - y_bar) * (x - x_bar) for y, x in list(zip(t_data, x_data))])
        a /= sum([(x - x_bar) ** 2 for x in x_data])
        b = y_bar - a * x_bar

        print("a:")
        print(a)
        print("b:")
        print(b)
        print("178 predict:")
        print(a * 178 + b)
        
        return  JsonResponse({"message": "Hello World"}, status=200)


@csrf_exempt
def size_search(request):
    if request.method == "GET":
        return  # JsonResponse({"message": "Hello World"}, status=200)
    elif request.method == "POST":
        # 멀티 프로세싱으로 크롤링을 빠르게
        with Pool(processes=8) as pool:
            # 여러 링크를 한번에 처리 하도록 링크 리스트와 처리함수를 pool 로 mapping 시킨다 
            goodsList = pool.map(filter_size, make_link(request))
            return JsonResponse({"message": goodsList}, status=200)

@csrf_exempt
def size_search2(request):
    if request.method == "GET":
        return  # JsonResponse({"message": "Hello World"}, status=200)
    elif request.method == "POST":
        # 멀티 프로세싱으로 크롤링을 빠르게
        with Pool(processes=8) as pool:
            # 여러 링크를 한번에 처리 하도록 링크 리스트와 처리함수를 pool 로 mapping 시킨다 
            goodsList = pool.map(filter_size2, make_link(request))
            return JsonResponse({"message": goodsList}, status=200)



# 크롤링 할 link들을 모아놓은 list 생성하는 함수 
def make_link(request) :
    data = json.loads(request.body)
    url = "https://search.musinsa.com/search/musinsa/goods?q=" + data["keyword"] +"&display_cnt=25&page=" + str(data["page"]) 
    res = requests.get(url)  # url 정보 get
    res.raise_for_status
    soup = BeautifulSoup(res.text, "lxml")  # lxml 변환
    totalTitle = soup.find_all(
        "a", attrs={"class": "img-block"}
    )  # image a 링크들을 가져온다
    obj = [] # 링크들을 담을 배열
    for title in totalTitle :
        titleObj = {
            "href" : title.get('href'),
            "img" : title.img["data-original"],
            "name" : title.img["alt"],
            "price" : title["data-bh-content-meta3"]
        }
        temp = {
            "title" : titleObj,
            "data" : json.loads(request.body)
        }
        obj.append(temp)
    return obj



# 링크로 접속하여 해당 상품에서 사이즈 필터링 후 차이가 최소인 사이즈를 반환해주는 함수
def filter_size(obj) :
    data = obj["data"]
    title = obj["title"]
    print(title)
    # 각 상품의 정보 (링크 , 이미지 , 수치오차)
    goodsInfo = {"image": "", "link": "", "diff": 0, "title": "", "price": "" , "size" : [0,0,0,0]}
    # 10개까지 받아오기
    # useragent 로 불순한 의도가 아님을 증명하기
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
    }
    # 상세페이지 이동
    res = requests.get(title["href"], headers=headers)
    res.raise_for_status
    soup = BeautifulSoup(res.text, "lxml")
    # try :
    sizeTitle = soup.find_all(
        "th", attrs={"class": "item_val"}
    )  # 총장 , 어깨,  가슴 title
    goodsSize = soup.find_all(
        "td", attrs={"class": "goods_size_val"}
    )  # 사이즈들을 1차원 배열로 한번에 받아오기


    # 사이즈별 인덱스찾기
    if len(sizeTitle) <= 0:
        return  # 임시방편 NameError 예외처리

    osIndex = -1
    wsIndex = -1
    thIndex = -1
    rsIndex = -1
    index = 0  # 현재 인덱스

    # 인덱스별 사이즈 종류 파악
    for i in sizeTitle:
        text = i.get_text()
        # size table title에 각 단어가 있는지 판별하여 index위치를 찾아내기
        if text.find("총") >= 0 and text.find("장") >= 0:
            osIndex = index
        elif text.find("허벅지") >= 0:
            thIndex = index
        elif text.find("밑위") >= 0:
            rsIndex = index
        elif text.find("허리") >= 0:
            wsIndex = index
        index += 1
    # 해당 제품의 정보 링크 , 이미지 , 수치 오차

    # 상품정보저장
    row = len(sizeTitle)
    tot = 0
    index = 0
    min_tot = 100000  # 오차 중 가장 작은 오차값
    minSize = [0,0,0,0]
    for size in goodsSize:

        # 각 부위별 인덱스에 대한 분기 사용자가 특정 부위에 대한 입력을 하지 않을 경우 스킵( abs(data[]) > 1 )
        if index == osIndex :
            minSize[0] = float(size.get_text())
            print(minSize[0])
            if abs(data["os"] > 1) :
                tot += abs(data["os"] - float(size.get_text()))
        elif index == rsIndex :
            minSize[3] = float(size.get_text())
            if abs(data["rs"] > 1) :
                tot += abs(data["rs"] - float(size.get_text()))
        elif index == wsIndex :                 
            minSize[2] = float(size.get_text())
            if abs(data["ws"] > 1) :
                tot += abs(data["ws"] - float(size.get_text()))
        elif index == thIndex :
            minSize[1] = float(size.get_text())
            if abs(data["th"] > 1) :
                tot += abs(data["th"] - float(size.get_text()))

        index += 1
        if index >= row:
            if(tot <= min_tot) : # 가장 차이가 작은 값을 갱신하며 가장 차이가 작은 적합 사이즈를 추천해주기 위해 저장한다.
                min_tot = tot
                goodsInfo["size"][0] = minSize[0]
                goodsInfo["size"][1] = minSize[1]
                goodsInfo["size"][2] = minSize[2]
                goodsInfo["size"][3] = minSize[3]
            index = 0
            tot = 0
    goodsInfo["diff"] = min_tot
    goodsInfo["link"] = title["href"]
    goodsInfo["image"] = title["img"]
    goodsInfo["title"] = title["name"]
    goodsInfo["price"] = title["price"]
    # 해당 제품의 정보들을 리스트에 담아 response
    return goodsInfo



# 링크로 접속하여 해당 상품에서 사이즈 필터링 후 차이가 최소인 사이즈를 반환해주는 함수
def filter_size2(obj) :
    data = obj["data"]
    title = obj["title"]
    print(title)
    # 각 상품의 정보 (링크 , 이미지 , 수치오차)
    goodsInfo = {"image": "", "link": "", "diff": 0, "title": "", "price": "" , "size" : [0,0,0,0]}
    # 10개까지 받아오기
    # useragent 로 불순한 의도가 아님을 증명하기
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
    }
    # 상세페이지 이동
    res = requests.get(title["href"], headers=headers)
    res.raise_for_status
    soup = BeautifulSoup(res.text, "lxml")
    # try :
    sizeTitle = soup.find_all(
        "th", attrs={"class": "item_val"}
    )  # 총장 , 어깨,  가슴 title
    goodsSize = soup.find_all(
        "td", attrs={"class": "goods_size_val"}
    )  # 사이즈들을 1차원 배열로 한번에 받아오기


    # 사이즈별 인덱스찾기
    if len(sizeTitle) <= 0:
        return  # 임시방편 NameError 예외처리

    osIndex = -1 # 총장
    shIndex = -1 # 어깨 인덱스
    chIndex = -1 # 가슴 인덱스
    arIndex = -1 # 소매 인덱스

    index = 0  # 현재 인덱스

    # 인덱스별 사이즈 종류 파악
    for i in sizeTitle:
        text = i.get_text()
        # size table title에 각 단어가 있는지 판별하여 index위치를 찾아내기
        if text.find("총") >= 0 and text.find("장") >= 0:
            osIndex = index
        elif text.find("어깨") >= 0:
            shIndex = index
        elif text.find("가슴") >= 0:
            chIndex = index
        elif text.find("소매") >= 0:
            arIndex = index
        index += 1
    # 해당 제품의 정보 링크 , 이미지 , 수치 오차

    # 상품정보저장
    row = len(sizeTitle)
    tot = 0
    index = 0
    min_tot = 100000  # 오차 중 가장 작은 오차값
    minSize = [0,0,0,0]
    for size in goodsSize:

        # 각 부위별 인덱스에 대한 분기 사용자가 특정 부위에 대한 입력을 하지 않을 경우 스킵( abs(data[]) > 1 )
        if index == osIndex :
            minSize[0] = float(size.get_text())
            print(minSize[0])
            if abs(data["os"] > 1) :
                tot += abs(data["os"] - float(size.get_text()))
        elif index == arIndex :
            minSize[3] = float(size.get_text())
            if abs(data["ar"] > 1) :
                tot += abs(data["ar"] - float(size.get_text()))
        elif index == chIndex :                 
            minSize[2] = float(size.get_text())
            if abs(data["ch"] > 1) :
                tot += abs(data["ch"] - float(size.get_text()))
        elif index == shIndex :
            minSize[1] = float(size.get_text())
            if abs(data["sh"] > 1) :
                tot += abs(data["sh"] - float(size.get_text()))

        index += 1
        if index >= row:
            if(tot <= min_tot) : # 가장 차이가 작은 값을 갱신하며 가장 차이가 작은 적합 사이즈를 추천해주기 위해 저장한다.
                min_tot = tot
                goodsInfo["size"][0] = minSize[0]
                goodsInfo["size"][1] = minSize[1]
                goodsInfo["size"][2] = minSize[2]
                goodsInfo["size"][3] = minSize[3]
            index = 0
            tot = 0
    goodsInfo["diff"] = min_tot
    goodsInfo["link"] = title["href"]
    goodsInfo["image"] = title["img"]
    goodsInfo["title"] = title["name"]
    goodsInfo["price"] = title["price"]
    # 해당 제품의 정보들을 리스트에 담아 response
    return goodsInfo

