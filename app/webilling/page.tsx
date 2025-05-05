import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { CircleGauge } from 'lucide-react';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex justify-center row-start-1 pt-35">
        <Image
          className="dark:invert"
          src="/icon512_rounded.png"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
      </header>
      <main className="grid grid-cols-2 gap-4 row-start-2">
        <Button
          variant="ghost"
          className="flex flex-col items-center h-full w-full aspect-square p-5"
        >
          <CircleGauge style={{ width: "50px !important", height: "50px !important" }} />
          <span className="text-sm mt-2 flex wrap">
            Water & Electricity Bill
          </span>
        </Button>
        <Button disabled
          variant="ghost"
          className="flex flex-col items-center h-full w-full aspect-square p-5"
        >
          <Loader2 className="animate-spin" style={{ width: "50px !important", height: "50px !important" }} />
          <span className="text-sm mt-2 flex wrap">
          AI working (Task Mgmt)
          </span>
        </Button>
        <Button disabled
          variant="ghost"
          className="flex flex-col items-center h-full w-full aspect-square p-5"
        >
          <Loader2 className="animate-spin" style={{ width: "50px !important", height: "50px !important" }} />
          <span className="text-sm mt-2 flex wrap">
          AI working (Reminders)
          </span>
        </Button>
        <Button disabled
          variant="ghost"
          className="flex flex-col items-center h-full w-full aspect-square p-5"
        >
          <Loader2 className="animate-spin" style={{ width: "50px !important", height: "50px !important" }} />
          <span className="text-sm mt-2 flex wrap">
          AI working (Ideation)
          </span>
        </Button>
      </main>
      <footer className="row-start-3 text-center">
        These functions are created with Axcelion AI authored by JPP
      </footer>
    </div>
  );
}
