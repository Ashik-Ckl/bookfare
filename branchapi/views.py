from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.settings import api_settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from . serializer import AuthTokenSerializer,UpdateTransferBooks
from warehouse.models import branch,book,transferbooks
from warehouse.serializer import GetTransferbooksSerializer
from rest_framework import status, viewsets
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
            return self.queryset.filter(book__barcode=barcode)
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
        if trObjects.quantity <= 0:
            trDelObjects = transferbooks.objects.get(id=objId)
            trDelObjects.delete()
        return Response(status=status.HTTP_201_CREATED)

    def get_serializer_class(self):
        if self.action == 'update':
            return UpdateTransferBooks
        return GetTransferbooksSerializer


