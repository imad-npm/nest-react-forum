import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useCreateCommunityMutation } from "../services/communitiesApi";
import type { ToastType } from "../../../shared/components/ui/Toast";

const createCommunitySchema = z.object({
  communityType: z.enum(["public", "private", "restricted"]),
  name: z.string().min(3, "Community Name must be at least 3 characters"),
  description: z.string().optional(),
});

type CreateCommunityFormValues = z.infer<typeof createCommunitySchema>;

const stepFields: (keyof CreateCommunityFormValues)[][] = [
  ["communityType"], // Step 0
  ["name", "description"], // Step 1
];

export const useCreateCommunityForm = (onClose: () => void) => {
  const [step, setStep] = React.useState(0);
  const [createCommunity, { isLoading }] = useCreateCommunityMutation();
  const [toast, setToast] =
    useState<{ message: string; type: ToastType } | null>(null);

  const {
    control,
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCommunityFormValues>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<CreateCommunityFormValues> = async (data) => {
    try {
      const response = await createCommunity(data).unwrap();
      setToast({ message: "Community created successfully!", type: "success" });
      onClose();
    } catch (err) {
      setToast({
        message: (err as any).data?.message || "Failed to create community",
        type: "error",
      });
      console.error("Failed to create community:", err);
    }
  };

  const nextStep = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return {
    step,
    form: {
      control,
      register,
      handleSubmit,
      errors,
    },
    submission: {
      onSubmit,
      isLoading,
    },
    navigation: {
      nextStep,
      prevStep,
    },
    toast: {
      toast,
      setToast,
    },
  };
};
