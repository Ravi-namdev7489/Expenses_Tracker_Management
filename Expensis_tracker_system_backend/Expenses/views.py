from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *

@csrf_exempt
def signup(request):
    if request.method == 'POST':

        data = json.loads(request.body)

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if UserDetails.objects.filter(Email=email).exists():
            return JsonResponse({'message': 'Email already exists'}, status=400)

        user = UserDetails.objects.create(
            Name=name,
            Email=email,
            Password=password
        )

        return JsonResponse({
            'message': 'User Registered successfully',
            'user': {
                'name': user.Name,
                'email': user.Email
            }
        }, status=201)

    return JsonResponse({'error': 'Invalid request'}, status=400)
# Login
@csrf_exempt
def login(request):
    if request.method == 'POST':

        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        user = UserDetails.objects.get(Email=email, Password=password)

        if not user:
            return JsonResponse(
                {'message': 'User not registered or wrong password'},
                status=400
            )

        return JsonResponse({
            'message': 'User login successfully',
            'userId':user.id,
            "userName":user.Name
        }, status=200)

    return JsonResponse({'error': 'Invalid request'}, status=400)
@csrf_exempt
def add_expensis(request):
    if request.method == 'POST':
        try:
            
            data = json.loads(request.body)
            user_id=data.get('userId')
            ex_date= data.get('ex_date')
            ex_item = data.get('ex_item')
            ex_cost= data.get('ex_cost')

            user = UserDetails.objects.get(id=user_id)
            if not user:
                return JsonResponse(
                    {'message': 'User not Found'},
                    status=400
                )
            expense=Expenses.objects.create(User=user,Ex_Date=ex_date,Ex_Item=ex_item,Ex_cost=ex_cost)
            return JsonResponse({
                'message': 'expense add successfully',
               
            }, status=200)
        except Exception as e:
            return JsonResponse({"error":e})

    return JsonResponse({'error': 'Invalid request'}, status=400)
from django.http import JsonResponse
from .models import UserDetails, Expenses

def manage_expensis(request, user_id):
    if request.method == 'GET':
        try:
            user = UserDetails.objects.get(id=user_id)

            # ✅ get all expenses (not single)
            expenses = Expenses.objects.filter(User=user)

            if not expenses.exists():
                return JsonResponse({
                    'message': 'No expenses found'
                }, status=404)

            # ✅ convert queryset to list
            data = list(expenses.values())

            return JsonResponse({
                'message': 'success',
                'data': data
            }, status=200)

        except UserDetails.DoesNotExist:
            return JsonResponse({
                'error': 'User not found'
            }, status=404)

        except Exception as e:
            return JsonResponse({
                'error': str(e)
            }, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)
@csrf_exempt
def update_expensis(request,expense_id):
    if request.method == 'PUT':
       
        data = json.loads(request.body)
        try: 
            expense=Expenses.objects.get(id=expense_id)
            expense.Ex_Date=data.get('Ex_Date',expense.Ex_Date)
            expense.Ex_Item=data.get('Ex_Item',expense.Ex_Item)
            expense.Ex_cost=data.get('Ex_cost',expense.Ex_cost)
            expense.save()
            return JsonResponse({
                'message': 'expense add successfully'  
            }, status=201)
        except Exception as e:
            return JsonResponse({"error":e})

    return JsonResponse({'error': 'Invalid request'}, status=404)

@csrf_exempt
def delete_expense(request, expense_id):
    if request.method == "DELETE":
        try:
            expense = Expenses.objects.get(id=expense_id)
            expense.delete()

            return JsonResponse({
                "message": "Expense deleted successfully"
            }, status=200)

        except Expenses.DoesNotExist:
            return JsonResponse({"error": "Expense not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
from django.http import JsonResponse
from datetime import datetime
from .models import Expenses

def expense_report(request, userId):
    if request.method == 'GET':
        try:
            from_date = request.GET.get('from_date')
            to_date = request.GET.get('to_date')

            print("from_date:", from_date)
            print("to_date:", to_date)
            print("userId:", userId)

            # ✅ validation
            if not from_date or not to_date:
                return JsonResponse({'error': 'Dates required'}, status=400)

            # ✅ convert string → date
            from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
            to_date = datetime.strptime(to_date, "%Y-%m-%d").date()

            # ✅ ForeignKey FIX
            expenses = Expenses.objects.filter(
                User_id=userId,   # 🔥 THIS IS CORRECT (based on your model)
                Ex_Date__range=[from_date, to_date]
            ).values()

            data = list(expenses)
            from django.db.models import Sum

            total = expenses.aggregate(total=Sum('Ex_cost'))
            print("expenses:", data)

            return JsonResponse({
                "count": len(data),
                "data": data,
                "total":total
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserDetails

@csrf_exempt
def change_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            userId = data.get("userId")
            oldPassword = data.get("oldPassword")
            newPassword = data.get("newPassword")

            # ✅ validation
            if not userId or not oldPassword or not newPassword:
                return JsonResponse({"error": "All fields are required"}, status=400)

            # ✅ find user
            try:
                user = UserDetails.objects.get(id=userId)
            except UserDetails.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)

            # ❌ check old password
            if user.Password != oldPassword:
                return JsonResponse({"error": "Old password is incorrect"}, status=400)

            # ✅ update password
            user.Password = newPassword
            user.save()

            return JsonResponse({"message": "Password updated successfully ✅"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)