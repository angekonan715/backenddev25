// Message Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const newMessageForm = document.getElementById('newMessageForm');
    const replyMessageForm = document.getElementById('replyMessageForm');

    // New Message Form Validation
    if (newMessageForm) {
        newMessageForm.addEventListener('submit', function(e) {
            const messageTo = document.getElementById('message_to').value;
            const messageSubject = document.getElementById('message_subject').value.trim();
            const messageBody = document.getElementById('message_body').value.trim();
            
            let isValid = true;
            let errorMessage = '';
            
            if (!messageTo) {
                errorMessage += 'Please select a recipient.\n';
                isValid = false;
            }
            
            if (!messageSubject) {
                errorMessage += 'Please enter a subject.\n';
                isValid = false;
            }
            
            if (!messageBody) {
                errorMessage += 'Please enter a message.\n';
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fix the following errors:\n' + errorMessage);
                return false;
            }
        });
    }

    // Reply Message Form Validation
    if (replyMessageForm) {
        replyMessageForm.addEventListener('submit', function(e) {
            const messageSubject = document.getElementById('message_subject').value.trim();
            const messageBody = document.getElementById('message_body').value.trim();
            
            let isValid = true;
            let errorMessage = '';
            
            if (!messageSubject) {
                errorMessage += 'Please enter a subject.\n';
                isValid = false;
            }
            
            if (!messageBody) {
                errorMessage += 'Please enter a message.\n';
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fix the following errors:\n' + errorMessage);
                return false;
            }
        });
    }

    // Real-time validation feedback
    const messageInputs = document.querySelectorAll('#message_subject, #message_body');
    messageInputs.forEach(input => {
        input.addEventListener('input', function() {
            const length = this.value.length;
            
            if (this.id === 'message_subject') {
                if (length === 0) {
                    this.style.borderColor = '#dc3545';
                } else if (length > 255) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '#28a745';
                }
            } else if (this.id === 'message_body') {
                if (length === 0) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '#28a745';
                }
            }
        });
    });

    // Recipient dropdown validation
    const messageToSelect = document.getElementById('message_to');
    if (messageToSelect) {
        messageToSelect.addEventListener('change', function() {
            if (this.value) {
                this.style.borderColor = '#28a745';
            } else {
                this.style.borderColor = '#dc3545';
            }
        });
    }
}); 