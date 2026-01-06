"use server";

import { api } from "@/convex/_generated/api";
import { fetchAuthMutation } from "@/lib/auth-server";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { postSchema } from "./schemas/blog";

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error("Invalid post data");
    }
    const imageUrl = await fetchAuthMutation(
      api.posts.generateImageUploadUrl,
      {}
    );
    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      body: parsed.data.image,
      headers: {
        "Content-Type": parsed.data.image.type,
      },
    });

    if (!uploadResult.ok) {
      return {
        error: "Image upload failed",
      };
    }

    const { storageId } = await uploadResult.json();

    await fetchAuthMutation(api.posts.createPost, {
      title: parsed.data.title,
      body: parsed.data.content,
      imageStorageId: storageId,
    });
  } catch (error) {
    return {
      errorMessage: "Failed to create post",
      error,
    };
  }
  updateTag("blog");
  return redirect("/blog");
}
