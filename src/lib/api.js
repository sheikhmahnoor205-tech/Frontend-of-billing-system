const API_BASE = "https://backend-of-billing-system.onrender.com/api";

export async function getCustomers() {
  const response = await fetch(`${API_BASE}/customers`);
  return response.json();
}

export async function createCustomer(customer) {
  const response = await fetch(`${API_BASE}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  return response.json();
}

export async function updateCustomer(id, customer) {
  const response = await fetch(`${API_BASE}/customers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  return response.json();
}

export async function deleteCustomer(id) {
  const response = await fetch(`${API_BASE}/customers/${id}`, {
    method: "DELETE",
  });

  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_BASE}/products`);
  return response.json();
}

export async function getProduct(id) {
  const response = await fetch(`${API_BASE}/products/${id}`);
  return response.json();
}

export async function getProductByBarcode(barcode) {
  const response = await fetch(
    `${API_BASE}/products/barcode/${barcode}`
  );
  return response.json();
}

export async function createProduct(product) {
  const response = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return response.json();
}

export async function updateProduct(id, product) {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });

  return response.json();
}

export async function getSales() {
  const response = await fetch(`${API_BASE}/sales`);
  return response.json();
}

export async function getSale(id) {
  const response = await fetch(`${API_BASE}/sales/${id}`);
  return response.json();
}

export async function getSaleByInvoice(invoiceNo) {
  const response = await fetch(
    `${API_BASE}/sales/invoice/${invoiceNo}`
  );
  return response.json();
}

export async function verifySale(invoiceNo) {
  const response = await fetch(
    `${API_BASE}/sales/verify/${invoiceNo}`
  );
  return response.json();
}

export async function createSale(sale) {
  const response = await fetch(`${API_BASE}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sale),
  });

  return response.json();
}

export async function updateSale(id, sale) {
  const response = await fetch(`${API_BASE}/sales/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sale),
  });

  return response.json();
}

export async function deleteSale(id) {
  const response = await fetch(`${API_BASE}/sales/${id}`, {
    method: "DELETE",
  });

  return response.json();
}

export async function getStats() {
  const response = await fetch(`${API_BASE}/stats/dashboard`);
  return response.json();
}

export async function getShop() {
  const response = await fetch(`${API_BASE}/shop`);
  return response.json();
}