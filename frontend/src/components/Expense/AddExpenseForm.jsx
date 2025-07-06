import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup.jsx";

const AddExpenseForm = ({ onAddExpense, initialData, showEmojiPicker, onEmojiSelect }) => {
  const [income, setIncome] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  useEffect(() => {
    if (initialData) {
      setIncome({
        category: initialData.category || "",
        amount: initialData.amount || "",
        date: initialData.date || "",
        icon: initialData.icon || "",
      });
    }
  }, [initialData]);

  const handleChange = (key, value) => setIncome({ ...income, [key]: value });

  const handleSubmit = () => {
    onAddExpense(income); // Trigger parent logic (emoji picker or submission)
  };

  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => {
          handleChange("icon", selectedIcon);
          onEmojiSelect(selectedIcon); // Notify parent of emoji selection
        }}
        isOpen={showEmojiPicker} // Control visibility via parent
      />

      <Input
        value={income.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="Rent, Groceries, etc"
        type="text"
      />

      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
        step="0.01"
      />

      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleSubmit}
        >
          {income.icon ? "Add Expense" : "Proceed to Emoji"}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;