import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@shadcn/ui";
import Link from "next/link";
import { FaRocket } from "react-icons/fa"; // Example: Rocket icon for the logo

export default function Navbar() {
  return (
    <div className="bg-gray-800 text-white">
      <div className="container mx-auto py-4 flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center gap-2">
          <FaRocket className="w-6 h-6 text-blue-500" /> {/* App logo */}
          <span className="text-xl font-bold">e-sky</span>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/transfers" className="hover:underline">
                  Transfers
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/approvals" className="hover:underline">
                  Approvals
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/ownership-transfers" className="hover:underline">
                  Ownership Transfers
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
