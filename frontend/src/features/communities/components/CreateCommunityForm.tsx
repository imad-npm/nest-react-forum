import React from "react";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { Label } from "../../../shared/components/ui/Label";
import { Textarea } from "../../../shared/components/ui/TextArea";
import { Controller } from "react-hook-form";
import { InputError } from "../../../shared/components/ui/InputError";
import { InputRadio } from "../../../shared/components/ui/InputRadio";
import Toast from "../../../shared/components/ui/Toast";
import { useCreateCommunityForm } from "../hooks/useCreateCommunityForm";

interface CreateCommunityFormProps {
  onClose: () => void;
}

const CreateCommunityForm: React.FC<CreateCommunityFormProps> = ({
  onClose,
}) => {
  const { step, form, submission, navigation, toast: toastState } =
    useCreateCommunityForm(onClose);
  const { control, register, handleSubmit, errors } = form;
  const { onSubmit, isLoading } = submission;
  const { nextStep, prevStep } = navigation;
  const { toast, setToast } = toastState;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Step 0: Community Type */}
      {step === 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">
            Choose your community type
          </h2>
          <p className="text-gray-600 mb-4">
            Each community type controls who can view and post in your
            community.
          </p>
          <Controller
            name="communityType"
            control={control}
            render={({ field }) => {
              const options = [
                {
                  value: "public",
                  title: "Public",
                  description: "Anyone can view, post, and comment.",
                },
                {
                  value: "restricted",
                  title: "Restricted",
                  description:
                    "Anyone can view, only approved users can post.",
                },
                {
                  value: "private",
                  title: "Private",
                  description: "Only approved users can view and post.",
                },
              ];

              return (
                <div className="flex flex-col gap-3 mt-2">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition
                  ${
                    field.value === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }
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
                        <div className="text-sm text-gray-500">
                          {option.description}
                        </div>
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
          <h2 className="text-xl font-bold mb-2">
            Tell us about your community
          </h2>
          <p className="text-gray-600 mb-4">
            Give your community a name and description so people know what it’s
            about.
          </p>
          <div className="mb-4">
            <Label htmlFor="name">Community Name:</Label>
            <Input id="name" {...register("name")} />
            <InputError message={errors.name?.message} />
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Description:</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={4}
            />
            <InputError message={errors.description?.message} />
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex gap-5 justify-end mt-4">
        {step > 0 && (
          <Button type="button" variant="secondary" onClick={prevStep}>
            Back
          </Button>
        )}

        {step < 1 && (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        )}

        {step === 1 && (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Community"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default CreateCommunityForm;
