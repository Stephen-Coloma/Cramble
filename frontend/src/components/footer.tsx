import { Facebook, Linkedin, Github } from "lucide-react"

export function Footer(){
    return (
      <div className="p-4 justify-items-center text-xs text-balance md:text-sm">
         <h1 className="mb-2">Developed by <a href="https://www.linkedin.com/in/stephen-coloma/" className="font-extrabold hover:text-primary">Stephen Coloma</a></h1>

         <div className="flex gap-2" >
            {/* facebook */}
            <a href="https://www.facebook.com/profile.php?id=100085431541752" className="flex items-center justify-items-center transition-transform duration-300 ease-out hover:scale-125 hover:text-primary">
                <Facebook className="h-5 w-5"></Facebook>
            </a>
            {/* linkedin */}
            <a href="https://www.linkedin.com/in/stephen-coloma/" className="flex items-center justify-items-center transition-transform duration-300 ease-out hover:scale-125 hover:text-primary">
                <Linkedin className="h-5 w-5"></Linkedin>
            </a>
            {/* github */}
            <a href="https://github.com/Stephen-Coloma" className="flex items-center justify-items-center transition-transform duration-300 ease-out hover:scale-125 hover:text-primary">
                <Github className="h-5 w-5"></Github>
            </a>
         </div>
      </div>
    )
}