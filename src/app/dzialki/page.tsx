import CategoryPage from '../(shop)/_components/CategoryPage'
export default function Page({ searchParams }:{ searchParams:Record<string,string|undefined> }){
  return <CategoryPage title="Działki" category="DZIALKA" searchParams={searchParams}/>
}
