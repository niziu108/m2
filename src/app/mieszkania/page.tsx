export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import CategoryPage from '../(shop)/_components/CategoryPage'
export default function Page({ searchParams }:{ searchParams:Record<string,string|undefined> }){
  return <CategoryPage title="Mieszkania" category="MIESZKANIE" searchParams={searchParams}/>
}
