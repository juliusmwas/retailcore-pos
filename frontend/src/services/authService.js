export function mockLogin(email, password) {
  return {
    user: {
      id: "u1",
      fullName: "John Cashier",
      email
    },
    business: {
      id: "b1",
      name: "RetailCore Supermarket"
    },
    branches: [
      { id: "br1", name: "Main Branch", role: "CASHIER" },
      { id: "br2", name: "Westlands Branch", role: "ADMIN" }
    ]
  };
}

export function mockRegisterOwner(data) {
  return {
    success: true
  };
}
