from django.urls import path
from . import views
from .views import (
    ChangeOwnPasswordView,
    AdminChangePasswordView,
)

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/<int:pk>/", views.NoteDelete.as_view(), name="note-delete"),
    path("user/roles/", views.UserRolesView.as_view(), name="user-roles"),
    path("news/", views.NewsListCreate.as_view(), name="news-list"),
    path("news/<int:pk>/", views.NewsDetail.as_view(), name="news-detail"),
    path("animals/", views.AnimalListCreate.as_view(), name="animal-list"),
    path("animals/<int:pk>/", views.AnimalDetail.as_view(), name="animal-detail"),
    path("messages/", views.MessageListCreate.as_view(), name="message-list"),
    path("messages/<int:pk>/", views.MessageDetail.as_view(), name="message-detail"),
    path(
        "volunteer-profile/",
        views.VolunteerProfileDetail.as_view(),
        name="volunteer-profile",
    ),
    path(
        "volunteer-profiles/",
        views.VolunteerProfileList.as_view(),
        name="volunteer-profiles",
    ),
    path(
        "volunteer-profiles/user/<int:user_id>/",
        views.VolunteerProfileDetail.as_view(),
        name="volunteer-profile-by-user",
    ),
    path(
        "choices/taxonomic/",
        views.TaxonomicRankChoicesView.as_view(),
        name="taxonomic-choices",
    ),
    path(
        "choices/news-types/",
        views.NewsTypeChoicesView.as_view(),
        name="news-type-choices",
    ),
    path(
        "choices/animal-status/",
        views.AnimalStatusChoicesView.as_view(),
        name="animal-status-choices",
    ),
    path(
        "choices/user-status/",
        views.UserStatusChoicesView.as_view(),
        name="user-status-choices",
    ),
    path("donations/", views.DonationListCreate.as_view(), name="donation-list"),
    path("funds/", views.FundsView.as_view(), name="funds"),
    path("expenses/", views.ExpenseListCreate.as_view(), name="expense-list"),
    path("users/<int:pk>/", views.ManageUserView.as_view(), name="user-management"),
    path(
        "change-password/", ChangeOwnPasswordView.as_view(), name="change-own-password"
    ),
    path(
        "admin/change-password/<int:user_id>/",
        AdminChangePasswordView.as_view(),
        name="admin-change-password",
    ),
]
