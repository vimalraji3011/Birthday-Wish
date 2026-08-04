import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
};

export default function SectionHeading({ eyebrow, title, sub, align = "center" }: Props) {
  const centered = align === "center";

  return (
    <header
      className={`relative z-10 flex flex-col gap-4 ${
        centered ? "mx-auto max-w-3xl items-center text-center" : "items-start text-left"
      }`}
    >
      {eyebrow ? (
        <Reveal delay={0.05} y={16}>
          <span className="inline-flex items-center gap-2.5 text-[0.68rem] font-medium tracking-[0.32em] text-accent uppercase">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent/70" />
            {eyebrow}
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-accent/70" />
          </span>
        </Reveal>
      ) : null}

      <Reveal delay={0.12}>
        <h2 className="text-gradient text-[clamp(2.1rem,6vw,4rem)] leading-[1.08] font-medium">
          {title}
        </h2>
      </Reveal>

      {sub ? (
        <Reveal delay={0.2}>
          <p
            className={`text-base leading-relaxed text-fg-muted sm:text-lg ${
              centered ? "mx-auto max-w-xl" : "max-w-xl"
            }`}
          >
            {sub}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
