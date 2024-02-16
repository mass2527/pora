import Image from "next/image";
import Link from "next/link";
import PoraLogo from "~/components/pora-logo";
import { buttonVariants } from "~/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center p-4">
        <PoraLogo />
      </header>

      <div className="grid place-items-center h-[calc(100vh-60px)] p-4">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
            블로그를 생성하고 생각과 경험을 공유하세요.
          </h1>

          <Link href="/dashboard" className={buttonVariants()}>
            시작하기
          </Link>
          <Image
            className="border rounded-md"
            src="/introduction.png"
            alt="Pora "
            width={720}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
