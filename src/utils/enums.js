const Roles={
    ADMIN: "admin",
    AGENT:"agent",
    USER:"user",
}

const PaymentMethods = {
    CREDIT_CARD: 'Credit Cart', 
    DEBIT_CARD: 'Debit Cart', 
    INTERNET_BANKING: 'Internet Banking', 
    UPI: 'UPI', 
    COD: 'Cash on Delivery'
}

const OrderStatuses = {
    PENDING: 'Pending', 
    PLACED: 'Placed', 
    DELIVERED: 'Delivered'
}

module.exports={Roles, PaymentMethods, OrderStatuses};