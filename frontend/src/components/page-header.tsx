import { CircleHelp, Compass, LibraryBig, LucideIcon, MessageSquareText, Sparkles, UserCog } from "lucide-react";

type PageHeaderInfo = {
  title: string;
  desc: string;
  iconColor: string;
  iconBg: string;
  Icon: LucideIcon;
};

const pageHeaderInfoRec: Record<string, PageHeaderInfo> = {
  '/dashboard/mydecks': {
    title: 'My Decks',
    desc: 'Manage your decks and flashcards easily here',
    iconColor: '#303030',
    iconBg: 'bg-gray-200',
    Icon: LibraryBig
  },
  '/dashboard/explore': {
    title: 'Explore Decks',
    desc: 'Discover new decks and flashcards and content coming soon to enhance your experience',
    iconColor: 'darkcyan',
    iconBg: 'bg-cyan-100',
    Icon: Compass
  },
  '/dashboard/faqs': {
    title: 'FAQs',
    desc: ' Find answers to common questions and get helpful information here',
    iconColor: 'darkorange',
    iconBg: 'bg-orange-100',
    Icon: CircleHelp
  },
  '/dashboard/feedback': {
    title: 'Your Feedbacks',
    desc: 'Report bugs or share your thoughts with us to help improve the experience',
    iconColor: 'darkviolet',
    iconBg: 'bg-violet-100',
    Icon: MessageSquareText
  },
  '/dashboard/generate': {
    title: 'Generate Flashcards',
    desc: 'Create flashcards effortlessly with the power of AI, using the Gemini model',
    iconColor: 'darkgreen',
    iconBg: 'bg-green-100',
    Icon: Sparkles
  },
  '/dashboard/settings': {
    title: 'Profile Settings',
    desc: 'Update your account settings, change your password, and manage personal preferences here',
    iconColor: '#303030',
    iconBg: 'bg-gray-200',
    Icon: UserCog
  }
} 


export function PageHeader({route}: {route: string}) {
  
  const pageHeader: PageHeaderInfo = pageHeaderInfoRec[route];

  return (    
    <div className="w-full mb-8">
      <div className="flex items-center gap-4 mb-2">
        <div className={`${pageHeader.iconBg} p-2 rounded-md`}><pageHeader.Icon color={`${pageHeader.iconColor}`}/></div>
        <h1 className="text-2xl sm:text-3xl font-bold">{pageHeader.title}</h1>
      </div>
      <h6 className="text-sm md:text-base text-muted-foreground">{pageHeader.desc}</h6>
    </div>
  );
}
