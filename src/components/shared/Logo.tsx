import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative h-10 w-10 shrink-0">
        <Image
          src="/brand-logo.png"
          alt="TaskOrbit"
          fill
          sizes="40px"
          priority
          className="object-contain py-1"
        />
      </div>
      <span className="text-primary font-bold text-lg tracking-tight whitespace-nowrap">
        TaskOrbit
      </span>
    </div>
  );
}
