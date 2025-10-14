export const runtime = 'nodejs'
export const revalidate = 0

import CategoryPage from '../(shop)/_components/CategoryPage'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  return (
    <CategoryPage
      title="Domy"
      category="DOM"
      searchParams={searchParams}
    />
  )
}
