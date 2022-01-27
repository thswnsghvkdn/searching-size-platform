from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class Profile(models.Model):
    # 기본 유저 모델과 OneToOne 연결
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_pk = models.IntegerField(blank=True)
    username = models.CharField(max_length=200, blank=True)
    nickname = models.CharField(max_length=200, blank=True)
    height = models.IntegerField(default=0)
    weight = models.IntegerField(default=0)
    age = models.IntegerField(default=0)
    gender = models.CharField(default='m' , max_length = 10)
    # 검색한 선호치수
    searchOutseam = models.IntegerField(default= 0)
    searchWaist = models.IntegerField(default= 0)
    searchThigh = models.IntegerField(default= 0)
    searchRise = models.IntegerField(default= 0)
    
    searchBack = models.IntegerField(default= 0)
    searchShoulder = models.IntegerField(default= 0)
    searchArm = models.IntegerField(default= 0)
    searchChest = models.IntegerField(default= 0)

# 관계식 가중치와 편향값 
class WeightBias(models.Model) :
    model_pk = models.IntegerField(blank = True, default = -1)
    outseamW = models.FloatField(default = 0)
    outseamB = models.FloatField(default = 0)
    waistW = models.FloatField(default = 0)
    waistB = models.FloatField(default = 0)
    thighW = models.FloatField(default = 0)
    thighB = models.FloatField(default = 0)
    riseW = models.FloatField(default = 0)
    riseB = models.FloatField(default = 0)
    
    backW = models.FloatField(default = 0)
    backB = models.FloatField(default = 0)
    shoulderW = models.FloatField(default = 0)
    shoulderB = models.FloatField(default = 0)
    armW = models.FloatField(default = 0)
    armB = models.FloatField(default = 0)
    chestW = models.FloatField(default = 0)
    chestB = models.FloatField(default = 0)
    
    

# receiver 장식자는 기본 유저 모델과 매핑시킬 모델 인스턴스를 기본 유저 인스턴스가 생성되는 시점에 생성해주도록 한다 sender인 user 모델이 post_save signal을 보낸 후 동작
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, user_pk=instance.id)
        # 기본 유저모델이 생겼다면 토큰도 생성하기
        Token.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()