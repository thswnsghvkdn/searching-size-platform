from typing import get_origin
import requests
import json
from bs4 import BeautifulSoup
from django.http import (
    JsonResponse,
)  # django.http에서 서버의 요청에 대한 응답을 Json으로 응답하기 위해 JsonResponse 가져오기
from django.views.decorators.csrf import csrf_exempt
import concurrent.futures
from multiprocessing import Pool

data = {}

def size_search_bottom(request):
        data = json.loads(request.body)
        url = "https://search.musinsa.com/search/musinsa/goods?q=" + data["keyword"]
        res = requests.get(url)  # url 정보 get
        res.raise_for_status
        soup = BeautifulSoup(res.text, "lxml")  # lxml 변환
        totalTitle = soup.find_all(
            "a", attrs={"class": "img-block"}
        )  # image a 링크들을 가져온다
        number = 0
        goodsList = []
        # 각 상품페이지로 접속하기
        for title in totalTitle:
            # 각 상품의 정보 (링크 , 이미지 , 수치오차)
            goodsInfo = {"image": "", "link": "", "diff": 0, "title": "", "price": "" , "size" : [0,0,0,0]}
            # 10개까지 받아오기
            if number > 5:
                break
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
            )  # 총장 , 밑위,  허벅지 title
            goodsSize = soup.find_all(
                "td", attrs={"class": "goods_size_val"}
            )  # 사이즈들을 1차원 배열로 한번에 받아오기


            # 사이즈별 인덱스찾기
            if len(sizeTitle) <= 0:
                break  # 임시방편 NameError 예외처리

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
            goodsInfo["image"] = title.img["data-original"]
            goodsInfo["title"] = title.img["alt"]
            goodsInfo["price"] = title["data-bh-content-meta3"]
            # 해당 제품의 정보들을 리스트에 담아 response
            goodsList.append(goodsInfo)
            number += 1
        goodsList = sorted(goodsList, key=(lambda x: x["diff"]))  # 오차값 기준으로 정렬
        return goodsList
@csrf_exempt
def size_search(request):
    if request.method == "GET":
        return  # JsonResponse({"message": "Hello World"}, status=200)
    elif request.method == "POST":
        # requset body 를 data로 받을 수 있도록 json 형식을 파싱한다.
        with Pool(processes=8) as pool:
            data = json.loads(request.body)
            goodsList = pool.map(filter_size, make_link(request))
            print("goods :")
            print(goodsList)
            return JsonResponse({"message": goodsList}, status=200)


# 상의 사이즈 검색 
@csrf_exempt
def size_search_top(request):
    if request.method == "GET":
        return  # JsonResponse({"message": "Hello World"}, status=200)
    elif request.method == "POST":
        # requset body 를 data로 받을 수 있도록 json 형식을 파싱한다.
        data = json.loads(request.body)
        url = "https://search.musinsa.com/search/musinsa/goods?q=" + data["keyword"]
        res = requests.get(url)  # url 정보 get
        res.raise_for_status
        soup = BeautifulSoup(res.text, "lxml")  # lxml 변환
        totalTitle = soup.find_all(
            "a", attrs={"class": "img-block"}
        )  # image a 링크들을 가져온다

        number = 0
        goodsList = []
        # 각 상품헤이지로 접속하기
        for title in totalTitle:
            print(title)
            # 각 상품의 정보 (링크 , 이미지 , 수치오차)
            goodsInfo = {"image": "", "link": "", "diff": 0, "title": "", "price": "" , "size" : [0,0,0,0]}
            # 10개까지 받아오기
            if number > 5:
                break
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
                break  # 임시방편 NameError 예외처리

            osIndex = -1 # 총장 인덱스
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
            goodsInfo["image"] = title.img["data-original"]
            goodsInfo["title"] = title.img["alt"]
            goodsInfo["price"] = title["data-bh-content-meta3"]
            # 해당 제품의 정보들을 리스트에 담아 response
            goodsList.append(goodsInfo)
            number += 1
        goodsList = sorted(goodsList, key=(lambda x: x["diff"]))  # 오차값 기준으로 정렬
        return JsonResponse({"message": goodsList}, status=200)


# 크롤링 할 link들을 모아놓은 list 생성하는 함수 
def make_link(request) :
    data = json.loads(request.body)
    url = "https://search.musinsa.com/search/musinsa/goods?q=" + data["keyword"]
    res = requests.get(url)  # url 정보 get
    res.raise_for_status
    soup = BeautifulSoup(res.text, "lxml")  # lxml 변환
    totalTitle = soup.find_all(
        "a", attrs={"class": "img-block"}
    )  # image a 링크들을 가져온다
    index = 0
    obj = [] # 링크들을 담을 배열
    for title in totalTitle :
        if index > 11 :
            break
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
        index += 1
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

