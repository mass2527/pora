import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export default function Home() {
  return (
    <div className="grid place-items-center min-h-screen">
      <div>
        <Link href="/dashboard" className={buttonVariants()}>
          블로그 생성
        </Link>
      </div>
    </div>
  );
}
