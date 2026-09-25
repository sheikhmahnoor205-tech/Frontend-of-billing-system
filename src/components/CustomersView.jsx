import React, { useState } from "react";
import { Search, Pencil, Trash2, Plus, X } from "lucide-react";
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../lib/api.js";
import { money } from "../lib/utils.js";

export default function CustomersView({ customers, sales }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    const value = search.toLowerCase();

    return (
      (customer.name || "").toLowerCase().includes(value) ||
      (customer.phone || "").toLowerCase().includes(value)
    );
  });

  const getCustomerSales = (customerId) => {
    return sales.filter((sale) => {
      if (!sale.customer) return false;

      const saleCustomerId =
        typeof sale.customer === "object"
          ? sale.customer._id
          : sale.customer;

      return saleCustomerId === customerId;
    });
  };

  const openCreateForm = () => {
    setEditingCustomer(null);
    setName("");
    setPhone("");
    setAddress("");
    setShowForm(true);
  };

  const openEditForm = (customer) => {
    setEditingCustomer(customer);
    setName(customer.name || "");
    setPhone(customer.phone || "");
    setAddress(customer.address || "");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setName("");
    setPhone("");
    setAddress("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Customer name is required");
      return;
    }

    try {
      const customerData = {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      };

      if (editingCustomer) {
        const response = await updateCustomer(
          editingCustomer._id,
          customerData
        );

        if (!response.success) {
          alert(response.message || "Failed to update customer");
          return;
        }

        window.location.reload();
      } else {
        const response = await createCustomer(customerData);

        if (!response.success) {
          alert(response.message || "Failed to create customer");
          return;
        }

        window.location.reload();
      }
    } catch (error) {
      console.error("Customer operation failed:", error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteCustomer(id);

      if (!response.success) {
        alert(response.message || "Failed to delete customer");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Delete customer failed:", error);
      alert("Failed to delete customer");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Customers</div>
          <div className="card-subtitle">
            Manage your customers
          </div>
        </div>

        <button className="primary-button" onClick={openCreateForm}>
          <Plus size={17} />
          Add Customer
        </button>
      </div>

      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="customer-form">
          <div className="form-header">
            <div>
              <div className="card-title">
                {editingCustomer ? "Edit Customer" : "Add Customer"}
              </div>
            </div>

            <button onClick={closeForm}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Customer name"
                />
              </div>

              <div>
                <label>Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label>Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={closeForm}>
                Cancel
              </button>

              <button type="submit">
                {editingCustomer ? "Update Customer" : "Save Customer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredCustomers.length === 0 ? (
        <div className="empty-state">
          No customers found.
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Total Spent</th>
                <th>Purchases</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => {
                const customerSales = getCustomerSales(customer._id);

                return (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.phone || "-"}</td>
                    <td>{customer.address || "-"}</td>
                    <td>{money(customer.totalSpent || 0)}</td>
                    <td>{customerSales.length}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openEditForm(customer)}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(customer._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}