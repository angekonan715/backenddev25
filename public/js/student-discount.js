// Student discount form functionality

document.addEventListener('DOMContentLoaded', function() {
    const studentCheckbox = document.getElementById('is_student');
    const studentEmailGroup = document.getElementById('student_email_group');
    const studentEmailInput = document.getElementById('student_email');

    if (studentCheckbox && studentEmailGroup) {
        // Show/hide student email field based on checkbox
        studentCheckbox.addEventListener('change', function() {
            if (this.checked) {
                studentEmailGroup.style.display = 'block';
                studentEmailInput.required = true;
            } else {
                studentEmailGroup.style.display = 'none';
                studentEmailInput.required = false;
                studentEmailInput.value = '';
            }
        });

        // Validate .edu email format
        if (studentEmailInput) {
            studentEmailInput.addEventListener('blur', function() {
                if (this.value && !this.value.toLowerCase().endsWith('.edu')) {
                    this.setCustomValidity('Please enter a valid .edu email address');
                    this.reportValidity();
                } else {
                    this.setCustomValidity('');
                }
            });

            studentEmailInput.addEventListener('input', function() {
                this.setCustomValidity('');
            });
        }

        // Set initial state
        if (studentCheckbox.checked) {
            studentEmailGroup.style.display = 'block';
            studentEmailInput.required = true;
        }
    }
});