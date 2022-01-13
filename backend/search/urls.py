from django.urls import path
from search import views

urlpatterns = [
    path("", views.size_search),
    path("top/", views.size_search_top),
]

