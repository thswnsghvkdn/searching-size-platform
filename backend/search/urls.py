from django.urls import path
from search import views

urlpatterns = [
    path("", views.size_search),
    path("top/", views.size_search2),
    # path("predict/", views.size_predict),
    path("predict2/", views.size_predict2),
]

