import TestClient from "./testclient";

export function generateStaticParams() {
  return [
    { id: 'cpp-oops' },
    { id: 'java-oops' },
    { id: 'aptitude' }
  ];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <TestClient id={resolvedParams.id} />;
}
