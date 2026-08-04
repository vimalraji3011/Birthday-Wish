import StarField from "@/components/fx/StarField";
import SparkleCursor from "@/components/fx/SparkleCursor";
import ControlDock from "@/components/ui/ControlDock";
import ScrollProgress from "@/components/ui/ScrollProgress";
import LoadingScene from "@/components/scenes/LoadingScene";
import WelcomeScene from "@/components/scenes/WelcomeScene";
import MessageScene from "@/components/scenes/MessageScene";
import GiftScene from "@/components/scenes/GiftScene";
import MemoriesScene from "@/components/scenes/MemoriesScene";
import TimelineScene from "@/components/scenes/TimelineScene";
import ReasonsScene from "@/components/scenes/ReasonsScene";
import CakeScene from "@/components/scenes/CakeScene";
import FireworksScene from "@/components/scenes/FireworksScene";
import LetterScene from "@/components/scenes/LetterScene";
import { friend } from "@/config/content";

export default function Home() {
  return (
    <>
      <StarField />
      <SparkleCursor />
      <ScrollProgress />
      <ControlDock />
      <LoadingScene />

      <main>
        <WelcomeScene />
        <MessageScene />
        <GiftScene />
        <MemoriesScene />
        <TimelineScene />
        <ReasonsScene />
        <CakeScene />
        <FireworksScene />
        <LetterScene />
      </main>

      <footer className="relative border-t border-hairline px-6 py-10 text-center">
        <p className="text-xs tracking-[0.2em] text-fg-faint uppercase">
          Made with love for {friend.name}
        </p>
      </footer>
    </>
  );
}
