from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    # 기본 유저 모델과 OneToOne 연결
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_pk = models.IntegerField(blank=True)
    nickname = models.CharField(max_length=200, blank=True)
    height = models.IntegerField(default=0)
    weight = models.IntegerField(default=0)
    age = models.IntegerField(default=0)
    gender = models.CharField(default='m' , max_length = 10)
    # 검색한 선호치수
    searchHeight = models.IntegerField(default= 0)
    searchWeight = models.IntegerField(default= 0)
    searchThigh = models.IntegerField(default= 0)
    searchRise = models.IntegerField(default= 0)
    
    searchBack = models.IntegerField(default= 0)
    searchShoulder = models.IntegerField(default= 0)
    searchArm = models.IntegerField(default= 0)
    searchChest = models.IntegerField(default= 0)
    

# receiver 장식자는 기본 유저 모델과 매핑시킬 모델 인스턴스를 기본 유저 인스턴스가 생성되는 시점에 생성해주도록 한다 sender인 user 모델이 post_save signal을 보낸 후 동작
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, user_pk=instance.id)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()