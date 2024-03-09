import Image from "next/image";
import Link from "next/link";
import NewTabLink from "~/components/new-tab-link";
import PoraLogo from "~/components/pora-logo";
import { buttonVariants } from "~/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <PoraLogo />
        <nav className="ml-auto flex gap-2">
          <NewTabLink
            className={buttonVariants({ variant: "ghost" })}
            href="https://github.com/mass2527/pora"
          >
            Github
          </NewTabLink>
        </nav>
      </header>
      <main className="flex-1 border">
        <section className="w-full py-12 h-full md:py-24 lg:py-32 grid place-items-center">
          <div className="container px-4 md:px-6">
            <div className="grid max-w-5xl gap-6 mx-auto lg:gap-12 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-zinc-100 px-3 py-1 text-sm">
                  Introducing
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  간편하게 블로그 생성
                </h1>
                <p className="text-zinc-500">
                  컨텐츠에만 집중하세요. 편리한 텍스트 에디터로 원하는 블로그
                  아티클을 손쉽게 작성하고 편집할 수 있도록 도와드립니다.
                </p>
                <div className="flex gap-2">
                  <Link className={buttonVariants()} href="/dashboard">
                    시작하기
                  </Link>

                  <NewTabLink
                    className={buttonVariants({ variant: "outline" })}
                    href="/blog/pora/article/introducing-pora"
                  >
                    소개
                  </NewTabLink>
                </div>
              </div>
              <div className="grid place-items-center">
                <Image
                  className="border rounded-md"
                  src="/introduction.png"
                  alt="Pora "
                  width={720}
                  height={530}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
