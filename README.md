# 🔐 Django Authentication Module

This is a basic **Authentication Module** built with **Python & Django** as part of an assignment task. Focusing on user signup, login, and access control.

---

## 📋 Assignment Description

The assignment includes the development of the following features:

- **Signup Page** with the following fields:
  - First Name
  - Last Name
  - Mobile Number
  - Email ID

- **Email Verification**:
  - A verification email is sent to the registered email address.
  - Login is **only allowed** after the user clicks the verification link.

- **Login Page**:
  - Active only users.

- **About Page**:
  - A protected page that can only be accessed after a successful login.

---

## 🚀 Features

- ✅ User registration with email verification
- ✅ Restricts login for Inactive users
- ✅ Protected route (`/about`) accessible only post-login
- ✅ Proper form validation and error handling
- ✅ Modular and clean code structure for easy scalability

---

## 🧪 Edge Cases Handled

- Duplicate email and mobile number entries
- Invalid email formats
- Login attempts without verification
- Unauthorized access to protected routes

---

## ⚙️ Tech Stack

- **Backend:** Python, Django
- **Frontend:** HTML (Django Templates)
- **Database:** SQLite (default, can be changed)
- **Email:** Configurable via Django email backend (SMTP, Console, etc.)

---

## 📦 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/authentication_module.git
   cd authentication_module
```

### 2. Set Up Virtual Environment

```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Email Settings

Update your `settings.py` with SMTP configuration like:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your_email@example.com'
EMAIL_HOST_PASSWORD = 'your_app_password'
```

> For development (without real email), you can use:

```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

### 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Run the Development Server

```bash
python manage.py runserver
```

### 7. Access the App in Browser

- Signup: [http://localhost:8000/register/](http://localhost:8000/register/)
- Login: [http://localhost:8000/login/](http://localhost:8000/login/)
- About (protected): [http://localhost:8000/about/](http://localhost:8000/about/)

---

## 💡 Additional Notes

You can enhance this module by adding:

- Password reset via email  
- Resend verification email  
- User profile management and dashboard  
- Login throttling or CAPTCHA for brute-force protection  

---

## 📧 Contact

For any queries or suggestions, feel free to reach out.

