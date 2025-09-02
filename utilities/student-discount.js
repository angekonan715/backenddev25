const utilities = {}

/* **************************************
* Student Discount Configuration
* ************************************ */
const STUDENT_DISCOUNT_RATE = 0.15 // 15% discount for students
const MIN_DISCOUNT_AMOUNT = 1000 // Minimum purchase amount to qualify for discount
const MAX_DISCOUNT_AMOUNT = 5000 // Maximum discount amount

/* **************************************
* Calculate student discount amount
* ************************************ */
utilities.calculateStudentDiscount = function(originalPrice, isStudent = false) {
  if (!isStudent) {
    return {
      originalPrice: originalPrice,
      discountAmount: 0,
      discountedPrice: originalPrice,
      discountRate: 0,
      isEligible: false
    }
  }

  // Check if price meets minimum requirement
  if (originalPrice < MIN_DISCOUNT_AMOUNT) {
    return {
      originalPrice: originalPrice,
      discountAmount: 0,
      discountedPrice: originalPrice,
      discountRate: 0,
      isEligible: false,
      reason: `Minimum purchase of $${MIN_DISCOUNT_AMOUNT.toLocaleString()} required for student discount`
    }
  }

  const discountAmount = Math.min(originalPrice * STUDENT_DISCOUNT_RATE, MAX_DISCOUNT_AMOUNT)
  const discountedPrice = originalPrice - discountAmount

  return {
    originalPrice: originalPrice,
    discountAmount: discountAmount,
    discountedPrice: discountedPrice,
    discountRate: STUDENT_DISCOUNT_RATE,
    isEligible: true,
    savings: `You save $${discountAmount.toLocaleString()}`
  }
}

/* **************************************
* Format price with student discount display
* ************************************ */
utilities.formatStudentPrice = function(price, isStudent = false) {
  const discount = utilities.calculateStudentDiscount(price, isStudent)
  
  if (!discount.isEligible) {
    return {
      displayPrice: `$${price.toLocaleString()}`,
      hasDiscount: false,
      discount: discount
    }
  }

  return {
    displayPrice: `$${discount.discountedPrice.toLocaleString()}`,
    originalPrice: `$${price.toLocaleString()}`,
    hasDiscount: true,
    discount: discount,
    savingsText: `Student Discount: Save $${discount.discountAmount.toLocaleString()}`
  }
}

/* **************************************
* Check if student discount is active/valid
* ************************************ */
utilities.isStudentDiscountValid = function(account) {
  if (!account || !account.is_student) {
    return false
  }

  // Check if student verification is recent (within 1 year)
  if (account.student_verification_date) {
    const verificationDate = new Date(account.student_verification_date)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    return verificationDate >= oneYearAgo
  }

  return false
}

/* **************************************
* Get student discount configuration
* ************************************ */
utilities.getStudentDiscountInfo = function() {
  return {
    discountRate: STUDENT_DISCOUNT_RATE,
    discountPercentage: `${(STUDENT_DISCOUNT_RATE * 100)}%`,
    minAmount: MIN_DISCOUNT_AMOUNT,
    maxDiscount: MAX_DISCOUNT_AMOUNT,
    requirements: [
      'Valid .edu email address required',
      `Minimum purchase of $${MIN_DISCOUNT_AMOUNT.toLocaleString()}`,
      `Maximum discount of $${MAX_DISCOUNT_AMOUNT.toLocaleString()}`,
      'Student verification expires after 1 year'
    ]
  }
}

module.exports = utilities