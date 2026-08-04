"use client";

import dynamic from "next/dynamic";

// lottie-web reaches for `window` on import, so keep it off the server entirely.
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Props = {
  data: unknown;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
};

export default function LottieBox({ data, className, loop = true, autoplay = true }: Props) {
  return (
    <div aria-hidden className={className}>
      <Lottie animationData={data} loop={loop} autoplay={autoplay} />
    </div>
  );
}
