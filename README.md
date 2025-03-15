# Nostray Network

A full-stack web application for managing and tracking stray animals. This project consists of a Django backend API and a React frontend.

## Project Setup

### Backend Setup

1. Navigate to the `backend` directory

2. Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:

   - Copy the `.env.example` file to create a new `.env` file
   - Configure your environment variables as needed

5. Initialize the database:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Initialize user roles:

   ```bash
   python manage.py create_roles
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```
   The API will be available at http://127.0.0.1:8000

### Frontend Setup

1. Navigate to the `frontend` directory

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy the `.env.example` file to create a new `.env` file
   - Configure your environment variables as needed

4. Available Scripts:
   - Start development server: `npm run dev`
   - Build for production: `npm run build`
   - Preview production build: `npm run preview`

## Key Dependencies

### Backend

- Django
- Django REST Framework
- Simple JWT for authentication
- Python-dotenv for environment variables

### Frontend

- React
- Vite
- React Router DOM for routing
- Axios for API requests
- Recharts for data visualization
- Tailwind CSS for styling

## Resources

- [Authentication/Users](https://www.youtube.com/watch?v=c-QsfbznSXI)

- [User roles in Django](https://medium.com/@farad.dev/managing-user-permissions-and-roles-in-django-a-hands-on-guide-f0ac6fa1f354)

- [Using decoractors in Django backend for permissions](https://www.youtube.com/watch?v=eBsc65jTKvw)
- [JWT token and Role based permissions](https://www.youtube.com/watch?v=5JG5PyU1CXI)
- [Decorators user roles](https://medium.com/@farad.dev/managing-user-permissions-and-roles-in-django-a-hands-on-guide-f0ac6fa1f354)

- [Database Planning](https://www.drawdb.app/)
- [extending user class](https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html)
- [React DOM router w/ netlify](https://answers.netlify.com/t/netlify-page-not-found-when-sharing-react-router-dom-based-links/11744/8)
- [fixing hosting on python anywhere breaking the css on the django admin center](https://stackoverflow.com/questions/76985252/pythonanywhere-admin-site-css-is-broken-in-django)

- [Error handling with axios](https://stackoverflow.com/questions/49967779/axios-handling-errors)
- [Responsive design](https://stackoverflow.com/questions/68723590/how-to-set-an-element-to-show-on-medium-screen-and-below-in-tailwind)
