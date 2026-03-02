import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSubscriptions, useInvalidateQueries } from "../../../hooks/useFinanceData";
import { createSubscription, updateSubscription, deleteSubscription } from "../../../services/api/subscriptions";
import type { Subscription } from "../../../interfaces/subscription-interface";

interface SubscriptionInput {
  name: string;
  category: string;
  recurrence: string;
  amount: string;
  currencyCode: string;
  effectiveFrom: string;
  effectiveUntil?: string | null;
  plan?: string | null;
}

export function useSubscriptionsEditor() {
  const { data: subscriptionsData = [], isLoading: loading, error } = useSubscriptions();
  const subscriptions = (subscriptionsData || []) as Subscription[];
  const invalidate = useInvalidateQueries();

  const createMutation = useMutation<Subscription, unknown, SubscriptionInput>({
    mutationFn: (data) => createSubscription(data),
    onSuccess: () => invalidate.invalidateSubscriptions(),
  });

  const updateMutation = useMutation<Subscription, unknown, { id: number; data: SubscriptionInput }>({
    mutationFn: (payload) => updateSubscription(payload.id, payload.data),
    onSuccess: () => invalidate.invalidateSubscriptions(),
  });

  const deleteMutation = useMutation<void, unknown, number>({
    mutationFn: (id: number) => deleteSubscription(id),
    onSuccess: () => invalidate.invalidateSubscriptions(),
  });

  const [showModal, setShowModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formRecurrence, setFormRecurrence] = useState("monthly");
  const [formAmount, setFormAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState("EUR");
  const [formEffectiveFrom, setFormEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);
  const [formEffectiveUntil, setFormEffectiveUntil] = useState<string>("");
  const [formPlan, setFormPlan] = useState("");

  const [availableCurrencies] = useState<string[]>(["USD", "EUR", "GBP"]);

  const handleCreate = () => {
    setEditingSubscription(null);
    setFormName("");
    setFormCategory("");
    setFormRecurrence("monthly");
    setFormAmount("");
    setFormCurrency("EUR");
    setFormEffectiveFrom(new Date().toISOString().split('T')[0]);
    setFormEffectiveUntil("");
    setFormPlan("");
    setShowModal(true);
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSubscription(sub);
    setFormName(sub.name);
    setFormCategory(sub.category);
    setFormRecurrence(sub.recurrence);
    setFormAmount(sub.amount);
    setFormCurrency(sub.currencyCode);
    setFormEffectiveFrom(sub.effectiveFrom.split('T')[0]);
    setFormEffectiveUntil(sub.effectiveUntil?.split('T')[0] || "");
    setFormPlan(sub.plan || "");
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this subscription?")) return;
    deleteMutation.mutate(id);
  };

  const handleSave = async () => {
    if (!formName || !formCategory || !formAmount || !formCurrency || !formEffectiveFrom) return;
    setIsSaving(true);
    
    const data = {
      name: formName,
      category: formCategory,
      recurrence: formRecurrence,
      amount: formAmount,
      currencyCode: formCurrency,
      effectiveFrom: formEffectiveFrom,
      effectiveUntil: formEffectiveUntil || null,
      plan: formPlan || null,
    };

    if (editingSubscription) {
      updateMutation.mutate({ id: editingSubscription.id, data }, { onSettled: () => setIsSaving(false) });
    } else {
      createMutation.mutate(data, { onSettled: () => setIsSaving(false) });
    }
    setShowModal(false);
  };

  return {
    subscriptions,
    loading,
    error,
    showModal,
    setShowModal,
    editingSubscription,
    isSaving,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSave,
    formName,
    setFormName,
    formCategory,
    setFormCategory,
    formRecurrence,
    setFormRecurrence,
    formAmount,
    setFormAmount,
    formCurrency,
    setFormCurrency,
    formEffectiveFrom,
    setFormEffectiveFrom,
    formEffectiveUntil,
    setFormEffectiveUntil,
    formPlan,
    setFormPlan,
    availableCurrencies,
  };
}

export default useSubscriptionsEditor;
