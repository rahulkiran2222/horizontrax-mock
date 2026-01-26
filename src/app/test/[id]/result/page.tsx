import ResultClient from "./resultclient";

export function generateStaticParams() {
  return [
    { id: 'cpp-oops' },
    { id: 'java-oops' },
    { id: 'aptitude' }
  ];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ResultClient params={Promise.resolve(resolvedParams)} />;
}
