from django.urls import path
from . import views

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
]
