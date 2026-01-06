import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";

// export const dynamic = "force-static";
// export const revalidate = 30;

export const metadata: Metadata = {
  title: `Blog - Scriptr`,
  description: "Read the latest articles and updates from Scriptr.",
  category: "Web development",
  authors: [{ name: "Seraaj de Villiers" }],
};

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts, and trends from our team
        </p>
      </div>
      {/* <Suspense fallback={<SkeletonLoadingUi />}> */}
      <LoadBlogList />
      {/* </Suspense> */}
    </div>
  );
}

async function LoadBlogList() {
  await connection();
  const data = await fetchQuery(api.posts.getPosts);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <Card
          key={post._id}
          className="pt-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              className="rounded-t-lg object-cover"
              src={
                post.imageUrl ??
                "https://images.unsplash.com/photo-1763688506555-c73c1b944080"
              }
              fill
              alt="image"
            />
          </div>
          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary">
                {post.title}
              </h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.body}</p>
          </CardContent>
          <CardFooter>
            <Link
              href={`/blog/${post._id}`}
              className={buttonVariants({ className: "w-full" })}>
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
