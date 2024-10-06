import React, { useState, useEffect } from 'react';
import { Trash2, Link, Edit, Plus, X, Save, Upload, Download } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import localforage from 'localforage';
import InvoiceLog from './InvoiceLog';

// ... (keep existing interfaces)

const CreateInvoice: React.FC = () => {
  // ... (keep existing state variables)

  useEffect(() => {
    const fetchCustomers = async () => {
      const storedCustomers = await localforage.getItem<Customer[]>('customers');
      if (storedCustomers) {
        setCustomers(storedCustomers);
      }
    };
    fetchCustomers();
    generateInvoiceNumber();
  }, []);

  // ... (keep existing functions)

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Create Invoice</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Invoice Information</h2>
        <p className="mb-2">Invoice Number: {invoiceNumber}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <select
              id="customer"
              value={selectedCustomerId}
              onChange={handleCustomerChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a client</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="delivery" className="block text-sm font-medium text-gray-700 mb-1">Delivery Location</label>
            <select
              id="delivery"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="KINSHASA">KINSHASA</option>
              <option value="LUBUMBASHI">LUBUMBASHI</option>
            </select>
          </div>
          <div>
            <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">Customer Address</label>
            <input
              type="text"
              id="customerAddress"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
            <input
              type="text"
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="deliveryMethod" className="block text-sm font-medium text-gray-700 mb-1">Delivery Method</label>
            <select
              id="deliveryMethod"
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="AVION">AVION</option>
              {/* Add other delivery methods as needed */}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Invoice Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Image", "Description", "Quantity", "Unit Price", "Weight", "Total", "Link", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={item.imageUrl} alt={item.description} className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${item.unitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.weight} kg</td>
                  <td className="px-6 py-4 whitespace-nowrap">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-900">
                      <Link className="w-5 h-5" />
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(item.id)} className="text-green-600 hover:text-green-900 mr-2">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => openModal()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Invoice Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Subtotal: ${calculateSubtotal().toFixed(2)}</p>
            <p className="font-medium">Total Quantity: {calculateTotalQuantity()} pcs</p>
          </div>
          <div>
            <label htmlFor="fees" className="block text-sm font-medium text-gray-700 mb-1">Fees (%)</label>
            <input
              type="number"
              id="fees"
              value={fees}
              onChange={(e) => setFees(parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="transport" className="block text-sm font-medium text-gray-700 mb-1">Transport & Customs (AIR)</label>
            <input
              type="number"
              id="transport"
              value={transportAndCustoms}
              onChange={(e) => setTransportAndCustoms(parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        <p className="text-xl font-bold mt-4">Total: ${calculateTotal().toFixed(2)}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-700">General Conditions</h2>
        <textarea
          value={generalConditions}
          onChange={(e) => setGeneralConditions(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 h-32"
          placeholder="Enter general conditions..."
        ></textarea>
      </div>

      <div className="flex justify-end space-x-4">
        <button onClick={handleSaveInvoice} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <Save className="w-5 h-5 mr-2" />
          Save Invoice
        </button>
        <button onClick={handleLoadInvoice} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <Upload className="w-5 h-5 mr-2" />
          Load Invoice
        </button>
        <button onClick={handleGeneratePDF} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <Download className="w-5 h-5 mr-2" />
          Generate PDF
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{editingItemId ? 'Edit Item' : 'Add Item'}</h2>
            <form onSubmit={handleAddOrUpdateItem} className="space-y-4">
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                <input
                  type="number"
                  id="unitPrice"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  value={newItem.weight}
                  onChange={(e) => setNewItem({ ...newItem, weight: parseFloat(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Item Link</label>
                <input
                  type="text"
                  id="link"
                  value={newItem.link}
                  onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  {editingItemId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Invoice Log</h2>
        <InvoiceLog entries={logEntries} />
      </div>
    </div>
  );
};

export default CreateInvoice;