import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "../components/layout";
import { useState, useEffect } from "react";
import { api } from "../core/api";
import type { ExpenseAnalysisResult } from "../core/api/services/openai";

// Define the route
export const Route = createFileRoute("/transactions")({
  component: Transactions,
});

function Transactions() {
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseAnalysis, setExpenseAnalysis] = useState<ExpenseAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Handle server-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (description.trim()) {
      setLoading(true);
      setError(null);
      
      try {
        // Call the OpenAI service to analyze the expense
        const analysis = await api.openai.analyzeExpense(description);
        console.log("Expense analysis result:", analysis);
        
        setExpenseAnalysis(analysis);
        setSubmitted(true);
      } catch (err) {
        console.error("Error analyzing expense:", err);
        setError("Failed to analyze expense. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setDescription("");
    setSubmitted(false);
    setExpenseAnalysis(null);
    setError(null);
  };

  // Only render interactive UI elements when the component is mounted client-side
  const renderClientSideUI = () => {
    if (!isMounted) {
      return (
        <div className="animate-pulse">
          <div className="h-10 w-full bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="h-20 w-full bg-gray-200 rounded mt-4 dark:bg-gray-700"></div>
          <div className="h-10 w-40 bg-gray-200 rounded mt-4 dark:bg-gray-700"></div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="expense-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Expense Description
          </label>
          <textarea
            id="expense-description"
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-400"
            placeholder="Describe your expense here... (e.g., 'Paid $56.42 for dinner at Luigi's Restaurant with my credit card from Chase')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          ></textarea>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Please provide a detailed description of your expense for better tracking.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            type="submit"
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-primary-700 dark:hover:bg-primary-600"
            disabled={!description.trim() || loading}
          >
            {loading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              "Analyze Expense"
            )}
          </button>
          
          {submitted && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Reset
            </button>
          )}
        </div>
      </form>
    );
  };

  const renderAnalysisResults = () => {
    if (!isMounted) return null;
    
    if (error) {
      return (
        <div className="mt-4 rounded-md bg-danger-50 p-4 dark:bg-danger-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              {/* Error icon */}
              <svg className="h-5 w-5 text-danger-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-danger-800 dark:text-danger-200">
                {error}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (submitted && expenseAnalysis) {
      return (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">Expense Analysis</h3>
          
          <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Date</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {expenseAnalysis.date || "Not specified"}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {expenseAnalysis.amount !== null 
                      ? `${expenseAnalysis.currencySymbol || ''}${expenseAnalysis.amount}` 
                      : "Not specified"}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Description</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{expenseAnalysis.description}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {expenseAnalysis.paymentMethod || "Not specified"}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Bank/FinTech</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {expenseAnalysis.bank || "Not specified"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-success-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2 dark:bg-success-700 dark:hover:bg-success-600"
            >
              Save Transaction
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">Transactions</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage and track your financial transactions
          </p>
        </div>
        
        {/* Expense description form */}
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            Describe an Expense
          </h2>
          
          {renderClientSideUI()}
          {renderAnalysisResults()}
        </div>
      </div>
    </MainLayout>
  );
} 