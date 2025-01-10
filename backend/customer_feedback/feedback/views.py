from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .models import CustomUser
from .models import Feedback
from .serializers import FeedbackSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from .permissions import IsAdmin, IsStaff 


class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Validate the email and password
        if not email or not password:
            return Response(
                {"detail": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate the user
        user = authenticate(request, email=email, password=password)
        if user is None:
            raise AuthenticationFailed("Invalid email or password.")

        if not user.is_active:
            return Response(
                {"detail": "This account is inactive."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Update last login timestamp
        update_last_login(None, user)

        # Return tokens and user details
        return Response({
            "access": access_token,
            "refresh": refresh_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_staff": user.is_staff,
            }
        }, status=status.HTTP_200_OK)



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklisting the token to invalidate it
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = "Admin" if user.is_staff else "Staff"
        return Response({"role": role})



#POST FEEDBACK

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Enforce authentication here
def submit_feedback(request):
    if request.method == 'POST':
        serializer = FeedbackSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)  # Save the feedback with the logged-in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
  #GET FEEDBACK  
@permission_classes([IsStaff])
class FeedbackListView(ListAPIView):
    queryset = Feedback.objects.all()  # Fetch all feedback from the database
    serializer_class = FeedbackSerializer
    pagination_class = None  # Optional: You can implement pagination here if needed
    
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by feedback type
        feedback_type = self.request.query_params.get('feedback_type', None)
        if feedback_type:
            queryset = queryset.filter(feedback_type=feedback_type)
        
        # Filter by sentiment
        sentiment = self.request.query_params.get('sentiment', None)
        if sentiment:
            queryset = queryset.filter(sentiment=sentiment)
        
        
        return queryset    