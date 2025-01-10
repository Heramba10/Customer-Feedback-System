from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings 
from django.contrib.auth import get_user_model
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class CustomUser(AbstractUser):
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # Additional fields like email, address, phone, etc.
    email = models.EmailField(unique=True)  # Ensure email is unique
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    # Use email as the username field
    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = ['username','first_name', 'last_name',]  # username is still required for user creation

    def __str__(self):
        return self.email


class Feedback(models.Model):
    # Basic details of the feedback
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, default=None, null=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    feedback_type = models.CharField(
        max_length=50, 
        choices=[('Complaint', 'Complaint'), ('Suggestion', 'Suggestion'), ('Praise', 'Praise')]
    )
    comments = models.TextField()

    # Sentiment and tags (optional)
    sentiment = models.CharField(max_length=50, blank=True)  # Positive, Neutral, Negative
    tags = models.CharField(max_length=100, blank=True)  # e.g., Delivery, Product Quality

    # Timestamp when feedback is created
    created_at = models.DateTimeField(auto_now_add=True)
    
    REQUIRED_FIELDS = ['tags']
    def save(self, *args, **kwargs):
        analyzer = SentimentIntensityAnalyzer()
        sentiment_score = analyzer.polarity_scores(self.comments)['compound']

        if sentiment_score > 0.2:
            self.sentiment = 'Positive'
        elif sentiment_score < -0.2:
            self.sentiment = 'Negative'
        else:
            self.sentiment = 'Neutral'

        # Debugging: Check if sentiment is calculated correctly
        print(f"Sentiment: {self.sentiment}")

        # Call the function to assign tags based on sentiment
        self.tags = self.assign_tags_based_on_sentiment(self.comments, self.sentiment)
        
        # Debugging: Check if tags are assigned correctly
        print(f"Tags: {self.tags}")

        # Save the feedback instance
        super().save(*args, **kwargs)

    def assign_tags_based_on_sentiment(self, comments, sentiment):
        tags = []
        
        if sentiment == 'Positive':
            if "service" in comments.lower():
                tags.append("Customer Service")
            if "product" in comments.lower():
                tags.append("Product Quality")
            if "delivery" in comments.lower():
                tags.append("Delivery")
            if "packaging" in comments.lower():
                tags.append("Packaging")
            if "support" in comments.lower():
                tags.append("Customer Support")
            if "recommend" in comments.lower():
                tags.append("Recommendation")
            tags.append("Praise")  # Generic praise tag

        # Negative Sentiment
        elif sentiment == 'Negative':
            if "service" in comments.lower():
                tags.append("Customer Service")
            if "product" in comments.lower():
                tags.append("Product Quality")
            if "delivery" in comments.lower():
                tags.append("Delivery")
            if "packaging" in comments.lower():
                tags.append("Packaging")
            if "support" in comments.lower():
                tags.append("Customer Support")
            if "refund" in comments.lower():
                tags.append("Refund")
            if "return" in comments.lower():
                tags.append("Return Process")
            tags.append("Complaint")  # Generic complaint tag

        # Neutral Sentiment
        elif sentiment == 'Neutral':
            if "suggestion" in comments.lower():
                tags.append("Suggestion")
            if "improvement" in comments.lower():
                tags.append("Improvement")
            if "feedback" in comments.lower():
                tags.append("General Feedback")

        # Optional: Combine tags into a single string separated by commas
        return ", ".join(tags)

    def __str__(self):
        return f"Feedback from {self.name} - {self.feedback_type}"
