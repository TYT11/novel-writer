import Editor from "@/components/editor/editor";
import SignIn from "@/components/auth/sign-in";
import { auth } from "@/lib/auth/auth";

export default async function Document() {
  const session = await auth();
  return (
    <div className="p-5">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Editor />
        {session?.user ? session.user.email : <SignIn />}
      </main>
    </div>
  );
}
