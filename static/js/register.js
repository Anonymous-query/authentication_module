class RegisterForm {
  constructor() {
    this.form = document.getElementById("registerForm");
    this.firstNameInput = document.getElementById("first_name");
    this.lastNameInput = document.getElementById("last_name");
    this.mobileInput = document.getElementById("mobile");
    this.emailInput = document.getElementById("email");
    this.passwordInput = document.getElementById("password");
    this.submitBtn = document.getElementById("submitBtn");
    this.loading = document.getElementById("loading");
    this.backendError = document.getElementById("backendError");
    this.successMessage = document.getElementById("successMessage");
    // this.passwordRequirements = document.getElementById("passwordRequirements");

    this.init();
  }

  init() {
    // Add event listeners
    this.firstNameInput.addEventListener("input", () =>
      this.validateFirstName()
    );
    this.firstNameInput.addEventListener("blur", () =>
      this.validateFirstName()
    );

    this.lastNameInput.addEventListener("input", () => this.validateLastName());
    this.lastNameInput.addEventListener("blur", () => this.validateLastName());

    this.mobileInput.addEventListener("input", () => this.validateMobile());
    this.mobileInput.addEventListener("blur", () => this.validateMobile());

    this.emailInput.addEventListener("input", () => this.validateEmail());
    this.emailInput.addEventListener("blur", () => this.validateEmail());

    this.passwordInput.addEventListener("input", () => this.validatePassword());
    this.passwordInput.addEventListener("blur", () => this.validatePassword());
    // this.passwordInput.addEventListener("focus", () =>
    //   this.showPasswordRequirements()
    // );

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Initial validation check
    this.checkFormValidity();
  }

  validateFirstName() {
    const firstName = this.firstNameInput.value.trim();
    const errorElement = document.getElementById("firstNameError");
    let isValid = true;

    this.clearFieldState(this.firstNameInput, errorElement);

    if (!firstName) {
      this.setFieldError(
        this.firstNameInput,
        errorElement,
        "First name is required"
      );
      isValid = false;
    } else if (firstName.length < 2) {
      this.setFieldError(
        this.firstNameInput,
        errorElement,
        "First name must be at least 2 characters"
      );
      isValid = false;
    } else if (firstName.length > 50) {
      this.setFieldError(
        this.firstNameInput,
        errorElement,
        "First name is too long"
      );
      isValid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(firstName)) {
      this.setFieldError(
        this.firstNameInput,
        errorElement,
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      );
      isValid = false;
    } else {
      this.setFieldSuccess(this.firstNameInput);
    }

    this.checkFormValidity();
    return isValid;
  }

  validateLastName() {
    const lastName = this.lastNameInput.value.trim();
    const errorElement = document.getElementById("lastNameError");
    let isValid = true;

    this.clearFieldState(this.lastNameInput, errorElement);

    if (!lastName) {
      this.setFieldError(
        this.lastNameInput,
        errorElement,
        "Last name is required"
      );
      isValid = false;
    } else if (lastName.length < 2) {
      this.setFieldError(
        this.lastNameInput,
        errorElement,
        "Last name must be at least 2 characters"
      );
      isValid = false;
    } else if (lastName.length > 50) {
      this.setFieldError(
        this.lastNameInput,
        errorElement,
        "Last name is too long"
      );
      isValid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(lastName)) {
      this.setFieldError(
        this.lastNameInput,
        errorElement,
        "Last name can only contain letters, spaces, hyphens, and apostrophes"
      );
      isValid = false;
    } else {
      this.setFieldSuccess(this.lastNameInput);
    }

    this.checkFormValidity();
    return isValid;
  }

  validateMobile() {
    const mobile = this.mobileInput.value.trim();
    const errorElement = document.getElementById("mobileError");
    let isValid = true;

    this.clearFieldState(this.mobileInput, errorElement);

    if (!mobile) {
      this.setFieldError(
        this.mobileInput,
        errorElement,
        "Mobile number is required"
      );
      isValid = false;
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(mobile)) {
      this.setFieldError(
        this.mobileInput,
        errorElement,
        "Please enter a valid mobile number"
      );
      isValid = false;
    } else {
      const digitsOnly = mobile.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        this.setFieldError(
          this.mobileInput,
          errorElement,
          "Mobile number must be at least 10 digits"
        );
        isValid = false;
      } else if (digitsOnly.length > 15) {
        this.setFieldError(
          this.mobileInput,
          errorElement,
          "Mobile number is too long"
        );
        isValid = false;
      } else {
        this.setFieldSuccess(this.mobileInput);
      }
    }

    this.checkFormValidity();
    return isValid;
  }

  validateEmail() {
    const email = this.emailInput.value.trim();
    const errorElement = document.getElementById("emailError");
    let isValid = true;

    this.clearFieldState(this.emailInput, errorElement);

    if (!email) {
      this.setFieldError(
        this.emailInput,
        errorElement,
        "Email address is required"
      );
      isValid = false;
    } else if (!this.isValidEmail(email)) {
      this.setFieldError(
        this.emailInput,
        errorElement,
        "Please enter a valid email address"
      );
      isValid = false;
    } else if (email.length > 254) {
      this.setFieldError(
        this.emailInput,
        errorElement,
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
    const errorElement = document.getElementById("passwordError");
    const strengthElement = document.getElementById("passwordStrength");
    let isValid = true;

    this.clearFieldState(this.passwordInput, errorElement);

    if (!password) {
      this.setFieldError(
        this.passwordInput,
        errorElement,
        "Password is required"
      );
      isValid = false;
    } else {
      const strength = this.checkPasswordStrength(password);

      if (password.length < 8) {
        this.setFieldError(
          this.passwordInput,
          errorElement,
          "Password must be at least 8 characters long"
        );
        isValid = false;
      } else if (strength.score < 3) {
        this.setFieldError(
          this.passwordInput,
          errorElement,
          "Password is too weak. Please meet all requirements."
        );
        isValid = false;
      } else {
        this.setFieldSuccess(this.passwordInput);
      }

      this.updatePasswordStrength(strength);
      this.updatePasswordRequirements(password);
    }

    this.checkFormValidity();
    return isValid;
  }

  checkPasswordStrength(password) {
    let score = 0;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(requirements).forEach((met) => {
      if (met) score++;
    });

    let strength = "weak";
    if (score >= 4) strength = "strong";
    else if (score >= 3) strength = "medium";

    return { score, strength, requirements };
  }

  updatePasswordStrength(strengthData) {
    const strengthElement = document.getElementById("passwordStrength");
    const strengthText = {
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
    };

    strengthElement.textContent = `Password strength: ${
      strengthText[strengthData.strength]
    }`;
    strengthElement.className = `password-strength strength-${strengthData.strength}`;
  }

  updatePasswordRequirements(password) {
    const requirements = {
      "req-length": password.length >= 8,
      "req-uppercase": /[A-Z]/.test(password),
      "req-lowercase": /[a-z]/.test(password),
      "req-number": /\d/.test(password),
    };
  }

  showPasswordRequirements() {
    this.passwordRequirements.classList.add("show");
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
    const isFirstNameValid = this.firstNameInput.value.trim().length >= 2;
    const isLastNameValid = this.lastNameInput.value.trim().length >= 2;
    const isMobileValid =
      this.mobileInput.value.trim() &&
      /^\+?[\d\s\-\(\)]+$/.test(this.mobileInput.value.trim());
    const isEmailValid =
      this.emailInput.value.trim() &&
      this.isValidEmail(this.emailInput.value.trim());
    const isPasswordValid =
      this.passwordInput.value &&
      this.checkPasswordStrength(this.passwordInput.value).score >= 3;

    this.submitBtn.disabled = !(
      isFirstNameValid &&
      isLastNameValid &&
      isMobileValid &&
      isEmailValid &&
      isPasswordValid
    );
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Clear previous messages
    this.hideMessage(this.backendError);
    this.hideMessage(this.successMessage);

    // Validate all fields
    const isFirstNameValid = this.validateFirstName();
    const isLastNameValid = this.validateLastName();
    const isMobileValid = this.validateMobile();
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();

    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isMobileValid ||
      !isEmailValid ||
      !isPasswordValid
    ) {
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      // Prepare form data
      const formData = {
        first_name: this.firstNameInput.value.trim(),
        last_name: this.lastNameInput.value.trim(),
        mobile: this.mobileInput.value.trim(),
        email: this.emailInput.value.trim(),
        password: this.passwordInput.value,
      };

      // Make AJAX request
      const response = await fetch("/create_account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show success message
        this.showMessage(
          this.successMessage,
          data.message || "Registration successful! Redirecting..."
        );

        // Reset form
        this.form.reset();

        // Clear all field states
        document.querySelectorAll(".input-field").forEach((field) => {
          field.classList.remove("error", "success");
        });

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = data.redirectUrl || "/login";
        }, 2000);
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
      const errorMappings = {
        first_name: { field: this.firstNameInput, error: "firstNameError" },
        last_name: { field: this.lastNameInput, error: "lastNameError" },
        mobile: { field: this.mobileInput, error: "mobileError" },
        email: { field: this.emailInput, error: "emailError" },
        password: { field: this.passwordInput, error: "passwordError" },
      };

     Object.entries(errorMappings).forEach(([fieldName, mapping]) => {
    const errorData = data[fieldName];
    if (errorData && typeof errorData === 'object') {
      let errorMessage = '';

      // Handle nested user_message
      if (errorData.user_message) {
        errorMessage = errorData.user_message;
      }
      // Handle array of objects with user_message
      else if (Array.isArray(errorData) && errorData[0]?.user_message) {
        errorMessage = errorData[0].user_message;
      }
      // Handle plain string error
      else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }

      if (errorMessage) {
        this.setFieldError(
          mapping.field,
          document.getElementById(mapping.error),
          errorMessage
        );
      }
    }
  });

  // General error message
  let generalMessage = 'Registration failed. Please check your information and try again.';

  if (data.message) {
    generalMessage = data.message;
  } else if (data.error_code) {
    switch (data.error_code) {
      case 'duplicate-email':
        generalMessage = 'This email is already registered. Please use a different email or try logging in.';
        break;
      case 'duplicate-mobile':
        generalMessage = 'This mobile number is already registered. Please use a different number.';
        break;
      case 'duplicate-email-mobile':
        generalMessage = 'Both email and mobile number are already registered. Please use different credentials.';
        break;
      case 'validation-error':
        generalMessage = 'Please check your information and try again.';
        break;
      case 'forbidden-request':
        generalMessage = 'Too many registration attempts. Please try again later.';
        break;
      default:
        generalMessage = 'Registration failed. Please try again.';
    }
  }

  this.showMessage(this.backendError, generalMessage);
}

  setLoadingState(isLoading) {
    if (isLoading) {
      this.loading.classList.add("show");
      this.submitBtn.disabled = true;
      this.submitBtn.value = "Creating Account...";
    } else {
      this.loading.classList.remove("show");
      this.checkFormValidity();
      this.submitBtn.value = "Register";
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
  new RegisterForm();
});
