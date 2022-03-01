from django.shortcuts import render
from django.contrib.auth import get_user_model

def log_in(request):
    return render(request,'warehouse/signin.html')

def dashboard(request):
    return render(request,'warehouse/dashboard.html')

def branch(request):
    return render(request,'warehouse/branches.html')

def add_user(request,pk):
    userDetails = get_user_model().objects.filter(branch_id = pk)
    return render(request, 'warehouse/add-user.html',{'pk':pk,'users':userDetails})

def book(request):
    return render(request,'warehouse/books.html')

def entries(request):
    return render (request, 'warehouse/book-transfer-details.html')