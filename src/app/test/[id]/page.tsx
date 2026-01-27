import { examData } from "@/data/questions";
import TestClient from "./TestClient";

export async function generateStaticParams() {
  return Object.keys(examData).map((id) => ({
    id: id,
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <TestClient id={resolvedParams.id} />;
}
