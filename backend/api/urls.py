from django.urls import path
from . import views

urlpatterns = [
    path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    path('notes/<int:pk>/', views.NoteDelete.as_view(), name='note-delete'),
    path('user/roles/', views.UserRolesView.as_view(), name='user-roles'),
]