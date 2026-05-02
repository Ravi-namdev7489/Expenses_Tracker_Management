from . import views
from django.urls import path
urlpatterns = [
    path('signup/',views.signup,name='signup'),
    path('login/',views.login,name='login'),
    path('add-expense',views.add_expensis,name='add_expensis'),
    path('manage-expense/<int:user_id>',views.manage_expensis,name='manage_expensis'),
    path('update-expense/<int:expense_id>',views.update_expensis,name='update_expensis'),
    path('delete-expense/<int:expense_id>', views.delete_expense),
    path('expense-report/<int:userId>', views.expense_report),
    path('change-password', views.change_password)
]
