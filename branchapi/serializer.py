from django.db.models import fields
from rest_framework import serializers
from rest_framework.response import Response
from django.contrib.auth import get_user_model,authenticate
from warehouse.models import User,branch,book,transferbooks,customer,invoice



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
                    msg = ('Unable to authenticate with provided credentials')
                    raise serializers.ValidationError(msg, code='authorization') 
                    
                else:
                    attrs['user'] = user
                    return attrs    
        else:
            msg = ('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authorization')

class UpdateTransferBooks(serializers.ModelSerializer):
    class Meta:
        model = transferbooks
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    total_amount = serializers.SerializerMethodField()
    class Meta:
        model = customer
        fields = '__all__'
        read_only_fields = ('branch',)
    
    def get_total_amount(self,obj):
        total = []
        if invoice.objects.filter(customer=obj.id).exists():
            invoiceObjects =invoice.objects.filter(customer=obj.id)
            for i in invoiceObjects:
                subTotal = int(i.sales_rate) * int(i.quantity)
                total.append(subTotal)
            return total

