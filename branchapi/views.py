from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.settings import api_settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from . serializer import AuthTokenSerializer,UpdateTransferBooks,CustomerSerializer,InvoiceSerializer
from warehouse.models import branch,book,transferbooks,customer,invoice,book_transfer_details
from warehouse.serializer import GetTransferbooksSerializer
from rest_framework import status, viewsets
import json
from rest_framework.views import APIView
from rest_framework.response import Response

class CreateTokenView(ObtainAuthToken):
    """Create a new auth token for the user"""
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
    
class GetBooksToBranch(viewsets.ModelViewSet):
    serializer_class = GetTransferbooksSerializer
    queryset = transferbooks.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        barcode = self.request.query_params.get('barcode')
        if barcode != None:
            return self.queryset.filter(branch=self.request.user.branch,book__barcode=barcode)
        else:
            return self.queryset.filter(branch=self.request.user.branch)
    
    def update(self,request,*args,**kwargs):
        objId = kwargs['pk']
        trObjects = transferbooks.objects.get(id=objId)
        trObjects.quantity = int(trObjects.quantity) - int(self.request.POST['quantity'])
        trObjects.save()
        updateBookQuantity = book.objects.get(id=trObjects.book_id)
        updateBookQuantity.quantity = int(updateBookQuantity.quantity) + int(self.request.POST['quantity'])
        updateBookQuantity.save()
        bookEntry = book_transfer_details()
        bookEntry.book_id = trObjects.book_id
        bookEntry.transfer_type = 'Transfered to warehouse from '+self.request.user.branch.name +' branch'
        bookEntry.stock = self.request.POST['quantity']
        bookEntry.save()
        if trObjects.quantity <= 0:
            trDelObjects = transferbooks.objects.get(id=objId)
            trDelObjects.delete()
        return Response(status=status.HTTP_201_CREATED)

    def get_serializer_class(self):
        if self.action == 'update':
            return UpdateTransferBooks
        return GetTransferbooksSerializer

class Customer(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    queryset = customer.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        return self.queryset.filter(branch=self.request.user.branch)
    
    def perform_create(self, serializer):
        serializer.save(branch=self.request.user.branch)

    def get_serializer_class(self):
        return CustomerSerializer


class CreateInvoice(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self,request):
        data = json.loads(self.request.POST['data1'])
        for dic in data:
            updateStock = transferbooks.objects.get(id= dic['id'])
            updateStock.quantity = int(updateStock.quantity) - int(dic['quantity'])
            updateStock.save()
            if updateStock.quantity < 1 :
                deleteBook = transferbooks.objects.get(id= dic['id'])
                deleteBook.delete()
            createInvoice = invoice()
            createInvoice.customer_id = self.request.POST['customer']
            createInvoice.barcode = dic['barcode']
            createInvoice.book_name = dic['name']
            createInvoice.author = dic['author']
            createInvoice.sales_rate = dic['rate']
            createInvoice.quantity = dic['quantity']
            createInvoice.save()
        return Response({'msg':'success'},status=status.HTTP_201_CREATED)


class Invoices(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    queryset = invoice.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        customer = self.request.query_params.get('customer')
        return self.queryset.filter(customer=customer)


class User(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    def get(self,request,format=None):
        user = request.user.email
        branchName = request.user.branch.name
        userSplit = user.split('@')
        data = userSplit[0]
        return Response({'user':data,'email':user,'branch':branchName})

class Logout(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    def get(self, request, format=None):
        self,request.user.auth_token.delete()
        return Response({'true':'msg'})