import AboutUs from "@/components/Home/AboutUs";
import AtorGrid from "@/components/Home/AtorGrid";
import HomeSlider from "@/components/Home/HomeSlider";
import HoneyGrid from "@/components/Home/HoneyGird";
import KhejurGrid from "@/components/Home/KhejurGrid";
import ShopHome from "@/components/Home/ShopHome";

export default function Home() {
  return (
    <div>
      <HomeSlider />
      <KhejurGrid />
      <HoneyGrid />
      <AtorGrid />
      <ShopHome />
      <AboutUs />
    </div>
  );
}
