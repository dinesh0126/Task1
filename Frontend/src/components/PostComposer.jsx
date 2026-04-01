import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
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
  const currentUser = useAuthStore((state) => state.user);
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
    <section className="panel composer-panel">
      <div className="panel-header composer-header">
        <div>
          <span className="badge composer-badge">Share your post</span>
          <h2>Drop a quick update for the community</h2>
          <p>Share what you finished, what you learned, or what others should see.</p>
        </div>
        <div className="composer-user">
          {currentUser?.profileImage ? (
            <img
              alt={currentUser.name}
              className="avatar"
              src={currentUser.profileImage}
            />
          ) : (
            <div className="avatar avatar-fallback">
              {currentUser?.name?.charAt(0).toUpperCase() || "Y"}
            </div>
          )}
          <div>
            <strong>{currentUser?.name || "You"}</strong>
            <p>Say something useful and keep it easy to scan.</p>
          </div>
        </div>
      </div>

      <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
        <label className="field-group">
          <span>Post text</span>
          <textarea
            rows="5"
            placeholder="Share your post type update here..."
            {...register("text")}
          />
          {errors.text && <small className="field-error">{errors.text.message}</small>}
        </label>

        <label className="field-group">
          <span>Image URL</span>
          <input
            placeholder="Paste an image link if this update needs a visual"
            type="url"
            {...register("imageUrl")}
          />
          {errors.imageUrl && (
            <small className="field-error">{errors.imageUrl.message}</small>
          )}
        </label>

        <div className="composer-actions">
          <p className="muted-text">Text-only posts work great too.</p>
          <button className="primary-button" disabled={isSubmittingPost} type="submit">
            {isSubmittingPost ? "Posting..." : "Share post"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default PostComposer;
