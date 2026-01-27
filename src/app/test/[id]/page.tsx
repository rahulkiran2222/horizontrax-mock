import { examData } from "@/data/questions";
import TestClient from "./TestClient";

export async function generateStaticParams() {
  return Object.keys(examData).map((id) => ({ id }));
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const resolvedParams = await props.params;
  return <TestClient id={resolvedParams.id} />;
}
