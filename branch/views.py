from django.shortcuts import render

# Create your views here.


def log_in(request):
    return render(request, 'branch/signin.html')

def dashboard(request):
    return render(request, 'branch/dashboard.html')