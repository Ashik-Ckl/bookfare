from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.settings import api_settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from . serializer import AuthTokenSerializer,AdminUser,BranchSerailizer,BookSerializer,TransferbooksSerializer,GetTransferbooksSerializer,UserSerializer,GetBooksQuantity,BookEntriesSerializer,GetBookEntriesSerializer
from . models import branch,book,transferbooks,book_transfer_details
from rest_framework import generics
from rest_framework import status, viewsets
import json
from rest_framework.views import APIView
from rest_framework.response import Response
# Create your views here.

class CreateAdminUserView(generics.CreateAPIView):
    """Create a new user in the system"""
    serializer_class = AdminUser

class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system"""
    serializer_class = UserSerializer

class CreateTokenView(ObtainAuthToken):
    """Create a new auth token for the user"""
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
    

class Branch(viewsets.ModelViewSet):
    serilizer_class = BranchSerailizer
    queryset = branch.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return GetBooksQuantity
        return BranchSerailizer


class Book(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    queryset = book.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,IsAdminUser)
   
    def get_serializer_class(self):
        return BookSerializer


class TransferBooksGet(viewsets.ModelViewSet):
    serializer_class = TransferbooksSerializer
    queryset = transferbooks.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,IsAdminUser)

    def get_queryset(self):
        bookId = self.request.query_params.get('book_id')
        if bookId != None:
            return self.queryset.filter(book=bookId)
        else:
            return self.queryset.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return GetTransferbooksSerializer
        return TransferbooksSerializer

class TransferBooks(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,IsAdminUser)

    def post(self,request):
        print(self.request.POST['branch'])
        data = json.loads(self.request.POST['data1'])
        branchName = branch.objects.get(id=self.request.POST['branch'])
        for dic in data:
            updateStock = book.objects.get(id= dic['id'])
            updateStock.quantity = int(updateStock.quantity) - int(dic['transfer_quantity'])
            updateStock.save()
            if transferbooks.objects.filter(book_id= dic['id'],branch=self.request.POST['branch']).exists():
                saveTRBook = transferbooks.objects.get(book_id = dic['id'],branch=self.request.POST['branch'])
                saveTRBook.quantity = int(dic['transfer_quantity']) + int(saveTRBook.quantity)
                saveTRBook.save()
                bookEntry = book_transfer_details()
                bookEntry.book_id = dic['id']
                bookEntry.transfer_type = 'Transfered to '+branchName.name+' branch'
                bookEntry.stock = dic['transfer_quantity']
                bookEntry.quantity = True
                bookEntry.save()
            else:
                saveTRBook = transferbooks()
                saveTRBook.branch_id = self.request.POST['branch']
                saveTRBook.book_id = dic['id']
                saveTRBook.quantity = dic['transfer_quantity']
                saveTRBook.save()
                bookEntry = book_transfer_details()
                bookEntry.book_id = dic['id']
                bookEntry.transfer_type = 'Transfered to '+branchName.name +' branch'
                bookEntry.stock = dic['transfer_quantity']
                bookEntry.quantity = True
                bookEntry.save()

        return Response({'msg':'success'},status=status.HTTP_201_CREATED)


class BookEntries(viewsets.ModelViewSet):
    serializer_class = BookEntriesSerializer
    queryset = book_transfer_details.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,IsAdminUser)

    def get_queryset(self):
        bookId = self.request.query_params.get('book_id')
        return self.queryset.filter(book=bookId)

    def get_serializer_class(self):
        if self.action == 'list':
            return GetBookEntriesSerializer
        return BookEntriesSerializer
    

class Logout(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get(self, request, format=None):
        self,request.user.auth_token.delete()
        return Response({'true':'msg'})