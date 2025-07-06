import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import ExpenseList from "../../components/Expense/ExpenseList";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import DeleteAlert from "../../components/DeleteAlert";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import Tesseract from "tesseract.js";

const Expense = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [extractedData, setExtractedData] = useState({ category: "", amount: "", date: "", icon: "" });
  const [isEmojiPending, setIsEmojiPending] = useState(false);
  const [pendingExpense, setPendingExpense] = useState(null);

  // Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses.");
    }
    setLoading(false);
  };

  // Handle Image Upload and OCR Processing
  const handleImageUpload = async (file) => {
    if (!file || !file.type.includes("image")) {
      toast.error("Please upload a valid image (PNG or JPEG).");
      return;
    }

    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m), // Log OCR progress
      });

      // Parse receipt text
      const extracted = parseReceiptText(text);
      setExtractedData(extracted);
      setOpenAddExpenseModal(true); // Open form with extracted data
    } catch (error) {
      console.error("Error processing receipt:", error);
      toast.error("Failed to process receipt. Please try again.");
    }
    setLoading(false);
  };

  // Parse Receipt Text
  const parseReceiptText = (text) => {
    const lines = text.split("\n").map(line => line.trim().toLowerCase()).filter(line => line);

    // Extract amount (e.g., Total: $50.00, Amount: 50.00)
    const amountRegex = /(?:total|amount|paid)[:\s]*\$?(\d+\.?\d{0,2})/i;
    const amountMatch = lines.map(line => line.match(amountRegex)).find(match => match)?.[1] || "";

    // Extract date (e.g., MM/DD/YYYY, YYYY-MM-DD)
    const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2})/;
    let dateMatch = lines.map(line => line.match(dateRegex)).find(match => match)?.[0] || "";
    // Normalize date to YYYY-MM-DD for HTML date input
    if (dateMatch && dateMatch.includes("/")) {
      const [month, day, year] = dateMatch.split("/");
      dateMatch = `${year.length === 2 ? "20" + year : year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Extract category based on keywords
    const categoryKeywords = {
      groceries: ["grocery", "supermarket", "walmart", "target", "safeway"],
      dining: ["restaurant", "cafe", "dining", "food", "pizza", "burger"],
      fuel: ["gas", "fuel", "station", "exxon", "shell"],
      shopping: ["shop", "store", "mall", "retail"],
      transport: ["uber", "lyft", "taxi", "bus", "train"],
    };
    let category = "unknown";
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (lines.some(line => keywords.some(keyword => line.includes(keyword)))) {
        category = cat;
        break;
      }
    }

    return {
      category,
      amount: amountMatch,
      date: dateMatch,
      icon: "",
    };
  };

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // Validation Checks
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }
    if (!date) {
      toast.error("Date is required.");
      return;
    }
    if (!icon) {
      setPendingExpense(expense); // Store expense data
      setIsEmojiPending(true); // Trigger emoji picker
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });
      setOpenAddExpenseModal(false);
      setIsEmojiPending(false);
      setPendingExpense(null);
      setExtractedData({ category: "", amount: "", date: "", icon: "" });
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error adding expense:", error.response?.data?.message || error.message);
      toast.error("Failed to add expense.");
      setIsEmojiPending(false); // Reset emoji pending state
    }
  };

  // Handle Emoji Selection
  const handleEmojiSelect = (selectedIcon) => {
    if (pendingExpense) {
      handleAddExpense({ ...pendingExpense, icon: selectedIcon }); // Submit with selected emoji
    }
    setIsEmojiPending(false);
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error deleting expense:", error.response?.data?.message || error.message);
      toast.error("Failed to delete expense.");
    }
  };

  // Handle Download Expense Details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details.");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="mb-4 p-2 border rounded"
              disabled={loading}
            />
            {loading && <p className="text-sm text-gray-500">Processing receipt...</p>}
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
          />

          <Modal
            isOpen={openAddExpenseModal}
            onClose={() => {
              setOpenAddExpenseModal(false);
              setExtractedData({ category: "", amount: "", date: "", icon: "" });
              setPendingExpense(null);
              setIsEmojiPending(false);
            }}
            title="Add Expense"
          >
            <AddExpenseForm
              onAddExpense={handleAddExpense}
              initialData={extractedData}
              showEmojiPicker={isEmojiPending}
              onEmojiSelect={handleEmojiSelect}
            />
          </Modal>

          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure you want to delete this expense detail?"
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
          </Modal>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;