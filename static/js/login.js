class SignInForm {
  constructor() {
    this.form = document.getElementById("signinForm");
    this.emailInput = document.getElementById("email");
    this.passwordInput = document.getElementById("password");
    this.submitBtn = document.getElementById("submitBtn");
    this.loading = document.getElementById("loading");
    this.backendError = document.getElementById("backendError");
    this.successMessage = document.getElementById("successMessage");

    this.init();
  }

  init() {
    // Add event listeners
    this.emailInput.addEventListener("input", () => this.validateEmail());
    this.emailInput.addEventListener("blur", () => this.validateEmail());

    this.passwordInput.addEventListener("input", () => this.validatePassword());
    this.passwordInput.addEventListener("blur", () => this.validatePassword());

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Initial validation check
    this.checkFormValidity();
  }

    getCSRFToken(){
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

  validateEmail() {
    const email = this.emailInput.value.trim();
    const emailError = document.getElementById("emailError");
    let isValid = true;

    // Clear previous states
    this.clearFieldState(this.emailInput, emailError);

    if (!email) {
      this.setFieldError(
        this.emailInput,
        emailError,
        "Email address is required"
      );
      isValid = false;
    } else if (!this.isValidEmail(email)) {
      this.setFieldError(
        this.emailInput,
        emailError,
        "Please enter a valid email address"
      );
      isValid = false;
    } else if (email.length > 254) {
      this.setFieldError(
        this.emailInput,
        emailError,
        "Email address is too long"
      );
      isValid = false;
    } else {
      this.setFieldSuccess(this.emailInput);
    }

    this.checkFormValidity();
    return isValid;
  }

  validatePassword() {
    const password = this.passwordInput.value;
    const passwordError = document.getElementById("passwordError");
    let isValid = true;

    // Clear previous states
    this.clearFieldState(this.passwordInput, passwordError);

    if (!password) {
      this.setFieldError(
        this.passwordInput,
        passwordError,
        "Password is required"
      );
      isValid = false;
    } else if (password.length < 6) {
      this.setFieldError(
        this.passwordInput,
        passwordError,
        "Password must be at least 6 characters long"
      );
      isValid = false;
    } else if (password.length > 128) {
      this.setFieldError(
        this.passwordInput,
        passwordError,
        "Password is too long"
      );
      isValid = false;
    } else {
      this.setFieldSuccess(this.passwordInput);
    }

    this.checkFormValidity();
    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  setFieldError(field, errorElement, message) {
    field.classList.add("error");
    field.classList.remove("success");
    errorElement.textContent = message;
    errorElement.classList.add("show");
  }

  setFieldSuccess(field) {
    field.classList.add("success");
    field.classList.remove("error");
  }

  clearFieldState(field, errorElement) {
    field.classList.remove("error", "success");
    errorElement.classList.remove("show");
    errorElement.textContent = "";
  }

  checkFormValidity() {
    const isEmailValid =
      this.emailInput.value.trim() &&
      this.isValidEmail(this.emailInput.value.trim());
    const isPasswordValid =
      this.passwordInput.value && this.passwordInput.value.length >= 6;

    this.submitBtn.disabled = !(isEmailValid && isPasswordValid);
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Clear previous messages
    this.hideMessage(this.backendError);
    this.hideMessage(this.successMessage);

    // Validate all fields
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      // Prepare form data
      const formData = new URLSearchParams();
        formData.append("email", this.emailInput.value.trim());
        formData.append("password", this.passwordInput.value);

      // Make AJAX request
      const response = await fetch("/login_ajax", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": this.getCSRFToken(),
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show success message
        this.showMessage(
          this.successMessage,
          data.message || "Sign in successful! Redirecting..."
        );

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = data.redirectUrl || "/about/";
        }, 1500);
      } else {
        // Handle backend validation errors
        this.handleBackendErrors(data);
      }
    } catch (error) {
      console.error("Network error:", error);
      this.showMessage(
        this.backendError,
        "Network error. Please check your connection and try again."
      );
    } finally {
      this.setLoadingState(false);
    }
  }

  handleBackendErrors(data) {
    // Handle field-specific validation errors from backend
    if (data.errors) {
      if (data.errors.email) {
        this.setFieldError(
          this.emailInput,
          document.getElementById("emailError"),
          data.errors.email
        );
      }
      if (data.errors.password) {
        this.setFieldError(
          this.passwordInput,
          document.getElementById("passwordError"),
          data.errors.password
        );
      }
    }

    // Handle general error message
    if (data.value) {
      this.showMessage(this.backendError, data.value);
    } else {
      this.showMessage(
        this.backendError,
        "Sign in failed. Please check your credentials and try again."
      );
    }
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.loading.classList.add("show");
      this.submitBtn.disabled = true;
      this.submitBtn.value = "Signing In...";
    } else {
      this.loading.classList.remove("show");
      this.checkFormValidity(); // Re-enable button based on form validity
      this.submitBtn.value = "Sign In";
    }
  }

  showMessage(element, message) {
    element.textContent = message;
    element.classList.add("show");
  }

  hideMessage(element) {
    element.classList.remove("show");
    element.textContent = "";
  }
}

// Initialize the form when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SignInForm();
});
