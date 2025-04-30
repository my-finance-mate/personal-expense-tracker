// ✅ 2. Updated Income.jsx to support update feature
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import moment from "moment";
import IncomeList from "../../components/Income/IncomeList";
import { handleDownloadIncomeDetails } from "../../utils/downloadIncomeDetails";
import { LuDownload } from "react-icons/lu";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [editIncome, setEditIncome] = useState(null); // ✅ state to manage editing

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      if (response.data) setIncomeData(response.data);
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    if (!source.trim()) return toast.error("Source is required.");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error("Amount should be a valid number greater than 0.");
    if (!date) return toast.error("Date is required.");

    try {
      if (editIncome) {
        await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(editIncome._id), { source, amount, date, icon });
        toast.success("Income updated successfully");
      } else {
        await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, { source, amount, date, icon });
        toast.success("Income added successfully");
      }
      setOpenAddIncomeModal(false);
      setEditIncome(null);
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error saving income:", error.response?.data?.message || error.message);
      toast.error("Failed to save income.");
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      toast.success("Income deleted successfully");
      setOpenDeleteAlert({ show: false, data: null });
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error deleting income:", error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (income) => {
    setEditIncome(income);
    setOpenAddIncomeModal(true);
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <IncomeOverview transactions={incomeData} onAddIncome={() => { setEditIncome(null); setOpenAddIncomeModal(true); }} />
        </div>

        <IncomeList
          transactions={incomeData}
          onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
          onDownload={handleDownloadIncomeDetails}
          onEdit={handleEdit} // ✅ pass handler to list
        />

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => { setOpenAddIncomeModal(false); setEditIncome(null); }}
          title={editIncome ? "Update Income" : "Add Income"}
        >
          <AddIncomeForm onAddIncome={handleAddIncome} initialData={editIncome} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
