# Authorization CRUD

## Steps to run locally

### Backend setup

In the `backend` directory...

It is recommended to use a virtual environment. You can create one
with:

```sh
python -m venv .venv
```

Then, install the dependencies from the included `requirements.txt` file:

```sh
pip install -r requirements.txt
```

Try to make migrations, in case any were missed:

```sh
python manage.py makemigrations
```

Then apply the migrations to the database:

```sh
python manage.py migrate
```

Ensure the user roles are initialized:

```sh
python manage.py create_roles
```

Then start the server with:

```sh
python manage.py runserver
```

## Resources Used

- [Authentication/Users](https://www.youtube.com/watch?v=c-QsfbznSXI)

- [User roles in Django](https://medium.com/@farad.dev/managing-user-permissions-and-roles-in-django-a-hands-on-guide-f0ac6fa1f354)

- [Using decoractors in Django backend for permissions](https://www.youtube.com/watch?v=eBsc65jTKvw)
- [JWT token and Role based permissions](https://www.youtube.com/watch?v=5JG5PyU1CXI)
- [Decorators user roles](https://medium.com/@farad.dev/managing-user-permissions-and-roles-in-django-a-hands-on-guide-f0ac6fa1f354)

- [Database Planning](https://www.drawdb.app/)
- [extending user class](https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html)
- [React DOM router w/ netlify](https://answers.netlify.com/t/netlify-page-not-found-when-sharing-react-router-dom-based-links/11744/8)
