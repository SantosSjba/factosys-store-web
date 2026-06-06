export const ROLE_ICONS: Record<string, string> = {
  admin: 'lucide:shield-check',
  manager: 'lucide:briefcase',
  support: 'lucide:headphones',
  warehouse: 'lucide:warehouse',
  customer: 'lucide:shopping-bag',
}

export function getRoleIcon(slug: string): string {
  return ROLE_ICONS[slug] ?? 'lucide:user-cog'
}
