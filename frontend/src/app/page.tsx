import {Header} from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full bg-[url('/assets/cramble-background.svg')] bg-cover bg-center">
      <Header></Header>
      <div className="container mx-auto flex-grow border-red-500 border-4">CONTENT FOR THE WHOLE PAGE</div> 
      <Footer></Footer>
    </div>
  );
}
