import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePostStore } from "../store/postStore";

const postSchema = z
  .object({
    text: z.string().max(1000).optional(),
    imageUrl: z.union([z.string().url("Use a valid image URL"), z.literal("")]).optional()
  })
  .refine((value) => value.text?.trim() || value.imageUrl?.trim(), {
    message: "Write something or add an image URL",
    path: ["text"]
  });

function PostComposer() {
  const createPost = usePostStore((state) => state.createPost);
  const isSubmittingPost = usePostStore((state) => state.isSubmittingPost);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      text: "",
      imageUrl: ""
    },
    resolver: zodResolver(postSchema)
  });

  const onSubmit = async (values) => {
    const result = await createPost({
      text: values.text?.trim() || "",
      imageUrl: values.imageUrl?.trim() || ""
    });

    if (result.success) {
      reset();
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Create Post</h2>
        <p>Text, image URL, or both.</p>
      </div>

      <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
        <label className="field-group">
          <span>Post Text</span>
          <textarea
            rows="4"
            placeholder="Share an update with everyone..."
            {...register("text")}
          />
          {errors.text && <small className="field-error">{errors.text.message}</small>}
        </label>

        <label className="field-group">
          <span>Image URL</span>
          <input
            placeholder="https://example.com/image.jpg"
            type="url"
            {...register("imageUrl")}
          />
          {errors.imageUrl && (
            <small className="field-error">{errors.imageUrl.message}</small>
          )}
        </label>

        <button className="primary-button" disabled={isSubmittingPost} type="submit">
          {isSubmittingPost ? "Posting..." : "Publish Post"}
        </button>
      </form>
    </section>
  );
}

export default PostComposer;
