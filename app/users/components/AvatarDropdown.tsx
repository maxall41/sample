import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../core/components/Dropdown"
import { Avatar, AvatarImage, AvatarFallback } from "../../core/components/Avatar"
import getCurrentUserRole from "app/core/hooks/getCurrentUserRole"
import { MembershipRole } from "@prisma/client"
import { Link } from "blitz"

const AvatarDropdown = () => {
  const role = getCurrentUserRole()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage
            src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
            alt="Pedro Duarte"
          />
          <AvatarFallback delayMs={600}>PD</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={5}>
        <DropdownMenuItem>
          {role == MembershipRole.OWNER && <Link href="/settings">Organization Settings</Link>}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/user">User Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Logout</DropdownMenuItem>
        <DropdownMenuArrow />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarDropdown
