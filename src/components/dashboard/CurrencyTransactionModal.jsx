import React from 'react';
import { X, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';

const CurrencyTransactionModal = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  const formatTransactionType = (type) => {
    const types = {
      deposit: { label: 'Deposit', icon: ArrowDownLeft, color: 'text-green-600', bgColor: 'bg-green-100' },
      withdrawal: { label: 'Withdrawal', icon: ArrowUpRight, color: 'text-red-600', bgColor: 'bg-red-100' },
      transfer_in: { label: 'Transfer In', icon: ArrowDownLeft, color: 'text-green-600', bgColor: 'bg-green-100' },
      transfer_out: { label: 'Transfer Out', icon: ArrowUpRight, color: 'text-red-600', bgColor: 'bg-red-100' },
      exchange: { label: 'Exchange', icon: RefreshCw, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      fee: { label: 'Fee', icon: ArrowUpRight, color: 'text-gray-600', bgColor: 'bg-gray-100' }
    };
    return types[type] || { label: type, icon: RefreshCw, color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const typeInfo = formatTransactionType(transaction.type);
  const Icon = typeInfo.icon;

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Transaction Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Transaction Type Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className={`p-4 rounded-full ${typeInfo.bgColor}`}>
            <Icon className={`${typeInfo.color}`} size={32} />
          </div>
        </div>

        {/* Transaction Info */}
        <div className="space-y-4">
          {/* Amount */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Amount</p>
            <p className={`text-3xl font-bold ${
              ['deposit', 'transfer_in'].includes(transaction.type) 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {transaction.formattedAmount?.formatted || `${transaction.currency} ${transaction.amount}`}
            </p>
          </div>

          {/* Details Grid */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-medium text-gray-900 text-right break-all">
                {transaction.transactionId}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Type</span>
              <span className="font-medium text-gray-900">{typeInfo.label}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Currency</span>
              <span className="font-medium text-gray-900">{transaction.currency}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-900">
                {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Balance After</span>
              <span className="font-medium text-gray-900">
                {transaction.currency} {transaction.balanceAfter?.toFixed(2)}
              </span>
            </div>

            {transaction.description && (
              <div className="flex justify-between">
                <span className="text-gray-600">Description</span>
                <span className="font-medium text-gray-900 text-right">
                  {transaction.description}
                </span>
              </div>
            )}

            {transaction.reference && (
              <div className="flex justify-between">
                <span className="text-gray-600">Reference</span>
                <span className="font-medium text-gray-900 text-right break-all">
                  {transaction.reference}
                </span>
              </div>
            )}

            {/* Metadata for exchange transactions */}
            {transaction.type === 'exchange' && transaction.metadata && (
              <>
                {transaction.metadata.fromCurrency && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">From Currency</span>
                    <span className="font-medium text-gray-900">
                      {transaction.metadata.fromCurrency}
                    </span>
                  </div>
                )}
                {transaction.metadata.toCurrency && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">To Currency</span>
                    <span className="font-medium text-gray-900">
                      {transaction.metadata.toCurrency}
                    </span>
                  </div>
                )}
                {transaction.metadata.exchangeRate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exchange Rate</span>
                    <span className="font-medium text-gray-900">
                      {transaction.metadata.exchangeRate}
                    </span>
                  </div>
                )}
                {transaction.metadata.originalAmount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Amount</span>
                    <span className="font-medium text-gray-900">
                      {transaction.metadata.fromCurrency} {transaction.metadata.originalAmount}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyTransactionModal;