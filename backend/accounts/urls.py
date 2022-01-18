from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token , verify_jwt_token
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views


urlpatterns = [
    path("signup/" , views.SignupView.as_view() , name = "signup"),
    path("<int:user_pk>/update/", views.ProfileUpdateAPI.as_view()),
    path("token/" , obtain_jwt_token ),
    path("mapping/" , views.mapping_size),
    path("token/refresh/" , refresh_jwt_token ),
    path("token/verify/", verify_jwt_token),
    path("login/", views.login),
]