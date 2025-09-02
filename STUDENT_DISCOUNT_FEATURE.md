# Student Discount Feature

This document describes the student discount functionality added to the CSE 340 car dealership application.

## Overview

The student discount feature provides verified students with a 15% discount on eligible vehicles. Students must provide a valid .edu email address for verification.

## Features

### 1. Student Verification
- Students can register with their .edu email address
- Existing users can add student status to their account
- Student verification expires after 1 year and requires re-verification

### 2. Discount Rules
- **Discount Rate**: 15% off regular price
- **Minimum Purchase**: $1,000 (vehicles under this amount don't qualify)
- **Maximum Discount**: $5,000 (cap on total discount amount)
- **Email Requirement**: Valid .edu email address

### 3. User Interface
- Student discount fields in registration form
- Student status management in account update form
- Discounted pricing display on vehicle detail pages
- Student pricing indicators in vehicle listings
- Visual badges and styling for student discounts

## Database Changes

The following columns were added to the `account` table:

```sql
is_student boolean DEFAULT FALSE
student_email character varying
student_verification_date date
```

## Files Modified/Added

### Models
- `models/account-model.js` - Added student status handling functions
- `utilities/student-discount.js` - New utility for discount calculations

### Controllers
- `controllers/accountController.js` - Updated registration and account update
- `controllers/invController.js` - Added student pricing to vehicle displays

### Views
- `views/account/register.ejs` - Added student registration fields
- `views/account/update-account.ejs` - Added student status management
- `views/inventory/detail.ejs` - Added student pricing display

### Assets
- `public/js/student-discount.js` - Client-side form handling
- `public/css/student-discount.css` - Student discount styling

### Utilities
- `utilities/index.js` - Updated grid builder for student pricing

### Database
- `database/db-sql-code.sql` - Updated schema with student fields
- `database/student-discount-migration.sql` - Migration script for existing installations

## Installation

### For New Installations
The student discount functionality is included in the main database schema (`database/db-sql-code.sql`).

### For Existing Installations
Run the migration script:
```sql
\i database/student-discount-migration.sql
```

## Usage

### For Students
1. **Registration**: Check "I am a student" and provide your .edu email
2. **Account Update**: Add student status to existing account
3. **Shopping**: Eligible vehicles will show discounted pricing automatically

### For Administrators
- Student status is tracked in the account table
- Verification dates help ensure current student status
- Discount rules can be modified in `utilities/student-discount.js`

## Configuration

Discount settings can be modified in `utilities/student-discount.js`:

```javascript
const STUDENT_DISCOUNT_RATE = 0.15 // 15% discount
const MIN_DISCOUNT_AMOUNT = 1000   // $1,000 minimum
const MAX_DISCOUNT_AMOUNT = 5000   // $5,000 maximum discount
```

## Security Features

- Email validation ensures .edu domain
- Student verification date tracking
- Account-based discount application
- Server-side discount calculations

## Testing

Test the feature with:
1. Register a new account with student status
2. Use a .edu email address (e.g., `test@university.edu`)
3. Browse vehicles to see student pricing
4. Update account to add/remove student status

## Future Enhancements

Potential improvements:
- Integration with student verification services
- Bulk student import functionality
- Reporting on student discount usage
- Seasonal discount modifications
- Student ID verification requirements