
import { api } from "@/trpc/server";
import { Button } from "../components/ui/button"

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <div>
      <Button className="m-40">
        Home here
      </Button>
    </div>
  );
}
