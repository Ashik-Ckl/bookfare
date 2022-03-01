from django.shortcuts import render

# Create your views here.


def log_in(request):
    return render(request, 'branch/signin.html')

def dashboard(request):
    return render(request, 'branch/dashboard.html')

def create_invoice(request):
    return render(request, 'branch/create-invoice.html')

def invoices(request):
    return render(request, 'branch/view_invoice.html')

def view_invoice(request):
    return render(request, 'branch/invoice.html')