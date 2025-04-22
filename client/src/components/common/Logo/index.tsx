import { Link } from "react-router-dom";
import LogoIcon from "@/assets/logo.svg?react";

function WaveText({ text }: { text: string }) {
  return (
    <span className="inline-flex text-2xl font-extralight text-current">
      {text.split("").map((char, idx, arr) => {
        const phase = (idx / (arr.length - 1)) * Math.PI * 2;
        const offset = Math.sin(phase) * 10;
        return (
          <span
            key={idx}
            className="inline-block"
            style={{ transform: `translateY(${offset}px)` }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <LogoIcon width={30} height={30} className="fill-current"/>
      <WaveText text="HummingTrack" />
    </Link>
  );
}
