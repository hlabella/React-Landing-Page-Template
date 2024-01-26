import valid from "card-validator";

export default function validateInfo(values) {
  let errors = {};
  let creditCard = valid.number(values.cardNumber);

  creditCard.expirationDate = valid.expirationDate(values.cardExpiration);
  creditCard.cvv = valid.cvv(values.cardSecurityCode);
  creditCard.cardholderName = valid.cardholderName(values.cardName);
  creditCard.postalCode = valid.postalCode(values.billingZipCode);
  
  errors.show = true;
  errors.variant = "danger";
  errors.message = "Houve algum erro. Por favor tente novamente em breve."
  errors.cname = false;
  errors.cnumber = false;
  errors.cexp = false;
  errors.ccvv = false;
  errors.customerDocumentNumber = false;
  errors.customerPhone = false;
  errors.billingZipCode = false;
  errors.billingAddressLine1 = false;
  errors.billingCity = false;
  errors.billingState = false;

  //Card CVV expiration
  if (values.cardSecurityCode === null || !values.cardSecurityCode.trim()) {
    errors.message = "O CVV do cartão não está completo";
  } else if (creditCard.cvv.isValid) {
    errors.ccvv = true;
  } else {
    errors.message = "O CVV do cartão é inválido";
  }

  //CEP
  if (values.billingZipCode === null || !values.billingZipCode.trim()) {
    errors.message = "O CEP está incompleto";
  } else if (creditCard.postalCode.isValid) {
    errors.billingZipCode = true;
  } else {
    errors.message = "O CEP é inválido";
  }

  //billingAddressLine1
  if (values.billingAddressLine1 === null || !values.billingAddressLine1.trim()) {
    errors.message = "O Endereço está incompleto";
  } else {
    errors.billingAddressLine1 = true;
  }

  //billingCity
  if (values.billingCity === null || !values.billingCity.trim()) {
    errors.message = "A cidade está incompleta";
  } else {
    errors.billingCity = true;
  }

  //billingState
  if (values.billingState === null || !values.billingState.trim()) {
    errors.message = "O estado está incompleto";
  } else {
    errors.billingState = true;
  }


  //Card Expiration Verification
  if (values.cardExpiration === null || !values.cardExpiration.trim()) {
    errors.message = "A data de expiração do cartão não está completa";
  } else if (creditCard.expirationDate.isValid) {
    errors.cexp = true;
  } else {
    errors.message = "A data de expiração do cartão é inválida";
  }

  //Card Number Verification
  if (values.cardNumber === null || !values.cardNumber.trim()) {
    errors.message = "O número do cartão está incompleto";
  } else if (creditCard.isValid) {
    errors.cnumber = true;
  } else {
    errors.message = "O número do cartão é inválido";
  }

  //Cardholder Name Verification
  if (values.cardName === null || !values.cardName.trim()) {
    errors.message = "O nome no cartão está incompleto";
  } else if (creditCard.cardholderName.isValid) {
    errors.cname = true;
  } else {
    errors.message = "O nome no cartão é inválido";
  }

  //Cardholder Document Verification
  const regexTestDocument = (documentNumber) => {
      const regex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
      return regex.test(documentNumber);
  };
  if (values.customerDocumentNumber === null || !values.customerDocumentNumber.trim()) {
    errors.message = "O documento está incompleto";
  } else if (regexTestDocument(values.customerDocumentNumber)) {
    errors.customerDocumentNumber = true;
  } else {
    errors.message = "O documento é inválido";
  }

  //Cardholder Document Verification
  const regexTestPhone = (phoneNumber) => {
      const regex = /^\s*(\d{2}|\d{0})[-. ]?(\d{5}|\d{4})[-. ]?(\d{4})[-. ]?\s*$/;
      return regex.test(phoneNumber);
  };
  if (values.customerPhone === null || !values.customerPhone.trim()) {
    errors.message = "O telefone está incompleto";
  } else if (regexTestPhone(values.customerPhone)) {
    errors.customerPhone = true;
  } else {
    errors.message = "O telefone é inválido";
  }

  if (
    errors.cname &&
    errors.cnumber &&
    errors.cexp &&
    errors.billingZipCode &&
    errors.ccvv &&
    errors.customerPhone &&
    errors.customerDocumentNumber &&
    errors.billingZipCode &&
    errors.billingAddressLine1 &&
    errors.billingCity &&
    errors.billingState
  ) {
    errors.show = false;
    errors.variant = "sucesso";
    errors.message = "Cartão de crédito é válido";
  }

  return errors;
}
