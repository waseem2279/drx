import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import FormPage from "@/components/FormPage";
import { getLanguageOptions, getServiceOptions } from "@/constants/options";
import { useFilters, useSetFilters } from "@/stores/useFilterStore";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

interface LanguageFormValues {
  providerLanguages: string[];
  services: string[];
}

const Page = () => {
  const { t } = useTranslation();
  const filters = useFilters();
  const setFilters = useSetFilters();

  const { control, formState, handleSubmit, reset } =
    useForm<LanguageFormValues>({
      defaultValues: {
        providerLanguages: filters.providerLanguages,
        services: filters.services,
      },
    });

  const { isDirty, isSubmitting } = formState;

  const onSubmit = (data: LanguageFormValues) => {
    const newFilters = {
      providerLanguages: data.providerLanguages,
      services: data.services,
    };

    setFilters(newFilters);
    reset(newFilters);
  };

  return (
    <FormPage
      canSubmit={isDirty}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit(onSubmit)}
    >
      <ControllerCheckBoxOptions
        label={t("form.provider-language")}
        control={control}
        name="providerLanguages"
        options={getLanguageOptions(t)}
      />
      <ControllerCheckBoxOptions
        label={"Provider services"}
        control={control}
        name="services"
        options={getServiceOptions(t)}
      />
    </FormPage>
  );
};

export default Page;
