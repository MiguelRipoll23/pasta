import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useInfiniteBills, useInvalidateQueries, useBillCategories, useServerSettings } from "../../../hooks/useFinanceData";
import { saveBill, updateBill, deleteBill } from "../../../services/api/bills";
import type { Bill } from "../../../interfaces/bill-interface";
import { getDefaultCurrencyCode } from "../../../constants/currency-constants";

interface BillInput {
  name: string;
  date: string;
  category: string;
  totalAmount: string;
  currencyCode: string;
  recurrence?: string;
  bankAccountId?: number | null;
}

export function useBillsEditor() {
  const { 
    data: billsData, 
    isLoading: loading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
  } = useInfiniteBills();
  
  const bills = billsData?.pages.flatMap(page => page.results) || [] as Bill[];
  const { data: categories = [] } = useBillCategories();
  const { data: serverSettings } = useServerSettings();
  const invalidate = useInvalidateQueries();

  const defaultBankAccountId = serverSettings?.defaultCheckingAccountId ?? null;

  const saveMutation = useMutation<Bill, unknown, BillInput>({
    mutationFn: (data) => saveBill(data),
  });

  const updateMutation = useMutation<Bill, unknown, { id: number; data: BillInput }>({
    mutationFn: (payload) => updateBill(payload.id, payload.data),
  });

  const deleteMutation = useMutation<void, unknown, number>({
    mutationFn: (id: number) => deleteBill(id),
    onSuccess: () => invalidate.invalidateBills(),
  });

  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingBillIds, setDeletingBillIds] = useState<Set<number>>(new Set());
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState(getDefaultCurrencyCode());
  const [formRecurrence, setFormRecurrence] = useState<string>("");
  const [formBankAccountId, setFormBankAccountId] = useState<number | null>(null);

  const handleCreate = () => {
    setEditingBill(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormName("");
    setFormCategory(categories.length > 0 ? categories[0].name : "");
    setFormAmount("");
    setFormCurrency(getDefaultCurrencyCode());
    setFormRecurrence("");
    setFormBankAccountId(defaultBankAccountId);
    setShowModal(true);
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setFormDate(bill.date.split('T')[0]);
    setFormName(bill.name);
    setFormCategory(bill.category);
    setFormAmount(bill.totalAmount);
    setFormCurrency(bill.currencyCode);
    setFormRecurrence(bill.recurrence || "");
    setFormBankAccountId((bill as Bill & { bankAccountId?: number | null }).bankAccountId ?? defaultBankAccountId);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (pendingDeleteId === null) return;
    const id = pendingDeleteId;
    setDeletingBillIds((prev) => new Set(prev).add(id));
    deleteMutation.mutate(id, {
      onSettled: () => {
        setPendingDeleteId(null);
        setDeletingBillIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      },
    });
  };

  const cancelDelete = () => setPendingDeleteId(null);

  const handleSave = async () => {
    if (!formDate || !formName || !formCategory || !formAmount || !formCurrency) return;
    setIsSaving(true);
    
    const data = {
      name: formName,
      date: formDate,
      category: formCategory,
      totalAmount: formAmount,
      currencyCode: formCurrency,
      recurrence: formRecurrence || undefined,
      bankAccountId: formBankAccountId ?? undefined,
    };

    if (editingBill) {
      updateMutation.mutate({ id: editingBill.id, data }, {
        onSuccess: async () => {
          await invalidate.invalidateBills();
          setShowModal(false);
        },
        onSettled: () => setIsSaving(false),
      });
    } else {
      saveMutation.mutate(data, {
        onSuccess: async () => {
          await invalidate.invalidateBills();
          setShowModal(false);
        },
        onSettled: () => setIsSaving(false),
      });
    }
  };

  return {
    bills,
    categories,
    loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    showModal,
    setShowModal,
    editingBill,
    isSaving,
    deletingBillIds,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSave,
    pendingDeleteId,
    confirmDelete,
    cancelDelete,
    formDate,
    setFormDate,
    formName,
    setFormName,
    formCategory,
    setFormCategory,
    formAmount,
    setFormAmount,
    formCurrency,
    setFormCurrency,
    formRecurrence,
    setFormRecurrence,
    formBankAccountId,
    setFormBankAccountId,
    defaultBankAccountId,
  };
}

export default useBillsEditor;
