from django.db import models

# Create your models here.
class UserDetails(models.Model):
    Name=models.CharField(max_length=100)
    Email=models.EmailField(max_length=100,unique=True)
    Password=models.CharField(max_length=100)
    RegDate=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.Name
class Expenses(models.Model):
    User=models.ForeignKey(UserDetails,on_delete=models.CASCADE)
    Ex_Date=models.DateField(null=True,blank=True)
    Ex_Item=models.CharField(max_length=100)
    Ex_cost=models.FloatField(default=10)
    NoteDate=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f" {self.Ex_Item} "