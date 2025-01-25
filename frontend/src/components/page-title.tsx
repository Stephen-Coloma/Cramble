import { LucideIcon } from "lucide-react";

export type PageTitleProps = {
  title: string;
  desc: string;
  iconColor: string;
  iconBg: string;
  Icon: LucideIcon;
};

export function PageTitle({ 
    title, 
    desc, 
    iconColor,
    iconBg, 
    Icon 
}: PageTitleProps) {

  return (    
    <div className="w-full mb-8">
      <div className="flex items-center gap-4 mb-2">
        <div className={`${iconBg} p-2 rounded-md`}><Icon color={`${iconColor}`}/></div>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <h6 className="text-sm md:text-base text-muted-foreground">{desc}</h6>
    </div>
  );
}
