import React, { useState } from "react";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { Label } from "../../../shared/components/ui/Label";
import { Select, type SelectOption } from "../../../shared/components/ui/Select";
import { Textarea } from "../../../shared/components/ui/TextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { InputError } from "../../../shared/components/ui/InputError";
import { InputRadio } from "../../../shared/components/InputRadio";
import { useCreateCommunityMutation } from "../services/communitiesApi";
import type { ToastType } from "../../../shared/components/ui/Toast";
import Toast from "../../../shared/components/ui/Toast";

interface CreateCommunityFormProps {
  onClose: () => void;
}


const createCommunitySchema = z.object({
  communityType: z.enum(["public", "private", "restricted"]),  name: z
    .string()
    .min(3, "Community Name must be at least 3 characters"),
  description: z.string().optional(),
});

type CreateCommunityFormValues = z.infer<typeof createCommunitySchema>;

const stepFields: (keyof CreateCommunityFormValues)[][] = [
  ["communityType"], // Step 0
  ["name", "description"], // Step 1
];

const CreateCommunityForm: React.FC<CreateCommunityFormProps> = ({ onClose }) => {
  const [step, setStep] = React.useState(0);
  const [createCommunity, { isLoading }] = useCreateCommunityMutation();
   const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
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

  const onSubmit: SubmitHandler<CreateCommunityFormValues> = async(data) => {
 try {
      const response = await createCommunity(data).unwrap(); // send data to API
      console.log("Community created:", response);
            setToast({ message: 'Community created successfully!', type: 'success' });
      onClose(); // close form or reset
    } catch (err) {
            setToast({ message: err?.data?.message || 'Failed to create community', type: 'error' });
      console.error("Failed to create community:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      {/* Step 0: Community Type */}
{/* Step 0: Community Type */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
{step === 0 && (
  <div className="mb-4">

     <h2 className="text-xl font-bold mb-2">Choose your community type</h2>
    <p className="text-gray-600 mb-4">
      Each community type controls who can view and post in your community.
    </p>
    <Controller
      name="communityType"
      control={control}
      render={({ field }) => {
        const options = [
          { value: "public", title: "Public", description: "Anyone can view, post, and comment." },
          { value: "restricted", title: "Restricted", description: "Anyone can view, only approved users can post." },
          { value: "private", title: "Private", description: "Only approved users can view and post." },
        ];

        return (
          <div className="flex flex-col gap-3 mt-2">
            {options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition
                  ${field.value === option.value ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"}
                `}
                onClick={() => field.onChange(option.value)}
              >
                <InputRadio
                  checked={field.value === option.value}
                  onChange={() => field.onChange(option.value)}
                  size="md"
                  colorClass="bg-blue-500"
                />
                <div className="ml-3">
                  <div className="font-medium">{option.title}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
    <InputError message={errors.communityType?.message} />
  </div>
)}


      {/* Step 1: Community Info */}
      {step === 1 && (
        <>
                    <h2 className="text-xl font-bold mb-2">Tell us about your community</h2>
    <p className="text-gray-600 mb-4">
      Give your community a name and description so people know what it’s about.
    </p>
          <div className="mb-4">
  
            <Label htmlFor="name">Community Name:</Label>
            <Input id="name" {...register("name")} />
            <InputError message={errors.name?.message} />
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Description:</Label>
            <Textarea id="description" {...register("description")} rows={4} />
            <InputError message={errors.description?.message} />
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex gap-5 justify-end mt-4">
        {step > 0 && (
          <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}

        {step < 1 && (
          <Button
            type="button"
            onClick={async () => {
              const valid = await trigger(stepFields[step]);
              if (valid) setStep(step + 1);
            }}
          >
            Next
          </Button>
        )}

        {step === 1 && (
     <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Community"}
          </Button>        )}
      </div>
    </form>
  );
};

export default CreateCommunityForm;
