from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# Create your models here.



class branch(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(null=True,blank=True,max_length=100)
    phone = models.CharField(null=True,blank=True,max_length=50)
    place = models.CharField(null=True,blank=True,max_length=50)


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Create Save a User"""
        if not email:
            raise ValueError('User must have a Email')
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        if user:
            return user

    def create_superuser(self, email, password,**extra_fields):
        """Create and Save a super User"""

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user
        


class User(AbstractBaseUser, PermissionsMixin):
    """"Custom Model"""
    email     = models.EmailField(max_length=225, unique=True)
    full_name = models.CharField(max_length=225)
    is_active = models.BooleanField(default=True)
    is_staff  = models.BooleanField(default=False)
    branch = models.ForeignKey(branch, on_delete = models.CASCADE,null=True,blank=True)
    phone = models.CharField(max_length=50,null=True,blank=True)
    objects = UserManager()
    USERNAME_FIELD = 'email'

    def __str__(self):
        return str(self.email)
    
class book(models.Model):
    date = models.DateField(auto_now_add=True)
    name = models.CharField(max_length=150)
    author = models.CharField(max_length=200)
    purchase_rate = models.IntegerField(null=True)
    barcode = models.CharField(max_length=100,unique=True)
    sales_rate = models.IntegerField()
    quantity = models.IntegerField()

class transferbooks(models.Model):
    branch = models.ForeignKey(branch,on_delete=models.CASCADE)
    book = models.ForeignKey(book,on_delete=models.CASCADE)
    quantity = models.IntegerField()