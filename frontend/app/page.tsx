import CardRow from '@/components/CardRow';
import Search from '@/components/Search';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1E201E] flex-column items-center justify-center p-8">
      
      <Search />

      <CardRow />
      <CardRow />
      <CardRow />
      <CardRow />

    </main>
  );
}
