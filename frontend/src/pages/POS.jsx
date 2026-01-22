import { useAuth } from "../auth/AuthContext";

export default function POS() {
  const { business, activeBranch } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">RetailCore POS</h1>
      <p className="text-gray-600">
        {business.name} — {activeBranch.name}
      </p>
      <div className="mt-6 border p-6 rounded">
        POS Checkout Screen (Coming Next)
      </div>
    </div>
  );
}
