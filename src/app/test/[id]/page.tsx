import { examData } from "@/data/questions";
import TestClient from "./TestClient";

export async function generateStaticParams() {
  return [
    { id: 'cpp-oops' },
    { id: 'java-oops' },
    { id: 'aptitude' }
  ];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const resolvedParams = await props.params;
  return <TestClient id={resolvedParams.id} />;
}
