from django.urls import path
from . import views


urlpatterns = [
    path("signup/" , views.SignupView.as_view() , name = "signup"),
    path("<int:user_pk>/update/", views.ProfileUpdateAPI.as_view()),
]