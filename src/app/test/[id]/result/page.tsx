import ResultClient from "./resultclient";

export function generateStaticParams() {
  return [{ id: 'cpp-oops' }, { id: 'java-oops' }, { id: 'aptitude' }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResultClient id={id} />;
}
