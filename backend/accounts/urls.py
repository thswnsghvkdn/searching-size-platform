from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token , verify_jwt_token
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views


urlpatterns = [
    path("signup/" , views.SignupView.as_view() , name = "signup"),
    path("<int:user_pk>/update/", views.ProfileUpdateAPI.as_view()),
    path("token/" , views.TokenView.as_view() ),
    path("mapping/" , views.mapping_size),
    path("token/refresh/" , refresh_jwt_token ),
    path("token/verify/", verify_jwt_token),
    path("login/", views.LoginView.as_view()),
    path("recommend/", views.recommend_top.as_view()),
    path("recommendBottom/", views.recommend_bottom.as_view())
]