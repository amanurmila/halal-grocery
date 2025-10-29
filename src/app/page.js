import AtorGrid from "@/components/Home/AtorGrid";
import HomeSlider from "@/components/Home/HomeSlider";
import HoneyGrid from "@/components/Home/HoneyGird";
import KhejurGrid from "@/components/Home/KhejurGrid";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HomeSlider />
      <KhejurGrid />
      <HoneyGrid />
      <AtorGrid />
    </div>
  );
}
