import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function AuthForm({
  schema,
  fields,
  onSubmit,
  title,
  subtitle,
  submitLabel,
  footer
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema)
  });

  const selectedFile = watch("profileImage");

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field) => (
          <label className="field-group" key={field.name}>
            <span>{field.label}</span>
            <input
              type={field.type}
              placeholder={field.placeholder}
              accept={field.accept}
              {...register(field.name)}
            />
            {errors[field.name] && (
              <small className="field-error">{errors[field.name].message}</small>
            )}
            {field.type === "file" && selectedFile?.[0] && (
              <small className="file-hint">Selected: {selectedFile[0].name}</small>
            )}
          </label>
        ))}

        <button className="primary-button full-width" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Please wait..." : submitLabel}
        </button>
      </form>

      {footer}
    </div>
  );
}

export default AuthForm;
