from django.db.models import fields
from rest_framework import serializers
from rest_framework.response import Response
from django.contrib.auth import get_user_model,authenticate
from .models import User,branch,book,transferbooks,book_transfer_details
from django.db.models.aggregates import Count
from django.forms.models import model_to_dict
from django.db.models import Sum

class AdminUser(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id','email', 'password','phone')
        extra_kwargs = {'password': {'write_only': True}}
        read_only_fields = ('id',)

    def create(self, validated_data):
         return get_user_model().objects.create_superuser(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the users object"""

    class Meta:
        model = get_user_model()
        fields = ('id','email', 'password','branch','phone')
        extra_kwargs = {'password': {'write_only': True}}
        read_only_fields = ('id',)

    def create(self, validated_data):
        """Create a new user with encrypted password and return it"""
        return get_user_model().objects.create_user(**validated_data,)
        

class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user authentication object"""
    email = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        """Validate and authenticate the user"""
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )
        if user:
                if user.is_superuser:
                    attrs['user'] = user
                    return attrs
                else:
                    msg = ('Unable to authenticate with provided credentials')
                    raise serializers.ValidationError(msg, code='authorization')     
        else:
            msg = ('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authorization')
        
class BranchSerailizer(serializers.ModelSerializer):
    class Meta:
        model = branch
        fields = '__all__'
        
class BookSerializer(serializers.ModelSerializer):
    stock = serializers.SerializerMethodField()
    entry = serializers.SerializerMethodField()
    class Meta:
        model = book
        fields = '__all__'

    def get_stock(self,obj):
        if transferbooks.objects.filter(book=obj).exists():
            return True
        else:
            return False

    def get_entry(self,obj):
        if book_transfer_details.objects.filter(book=obj).exists():
            return True
        else:
            return False
            
class TransferbooksSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = transferbooks
        fields = '__all__'

class GetTransferbooksSerializer(serializers.ModelSerializer):
    branch = BranchSerailizer()
    book = BookSerializer()
    class Meta:
        model = transferbooks
        fields = '__all__'


class GetBooksQuantity(serializers.ModelSerializer):
    stocks = serializers.SerializerMethodField()
    class Meta:
        model = branch
        fields = '__all__'

    def get_stocks(self,obj):
        print(obj.id)
        clients = branch.objects.filter(id=obj.id).select_related('transferbooks_set').annotate(quantity=Sum('transferbooks__quantity'),bkcnt=Count('transferbooks__book')).values('id','quantity','bkcnt')
        return clients

class BookEntriesSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model = book_transfer_details
        fields = '__all__'