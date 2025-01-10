from django.urls import path
from djoser.views import UserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import LogoutView, UserRoleView,LoginView
from . import views

urlpatterns = [
    # Djoser authentication endpoints
   # path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', UserViewSet.as_view({'post': 'create'}), name='user-register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/role/', UserRoleView.as_view(), name='user-role'),
    path('api/feedback/', views.submit_feedback, name='submit_feedback'),  # POST request to submit feedback
    path('api/feedbacks/', views.FeedbackListView.as_view(), name='feedbacks_list'),  # GET request to fetch feedback list
]
