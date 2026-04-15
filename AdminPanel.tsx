import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../lib/firebase";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type User = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
};

type Incident = {
  id: string;
  type?: string;
  description?: string;
  lat?: number;
  lng?: number;
  severity?: string;
  timestamp?: any;
};

export default function AdminPanel({
  isAuthenticated,
  userRole,
}: {
  isAuthenticated: boolean;
  userRole: string;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  // ================= USERS REALTIME =================
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") return;

    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const list: User[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as User);
      });
      setUsers(list);
    });

    return () => unsub();
  }, [isAuthenticated, userRole]);

  // ================= INCIDENTS REALTIME =================
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") return;

    const q = query(
      collection(db, "incidents"),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: Incident[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Incident);
      });
      setIncidents(list);
    });

    return () => unsub();
  }, [isAuthenticated, userRole]);

  // ================= DELETE USER =================
  const deleteUser = async (id: string) => {
    await deleteDoc(doc(db, "users", id));
  };

  // ================= DELETE INCIDENT =================
  const deleteIncident = async (id: string) => {
    await deleteDoc(doc(db, "incidents", id));
  };

  if (!isAuthenticated || userRole !== "admin") {
    return (
      <div className="p-6 text-center text-red-500">
        Access Denied (Admin Only)
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">

      {/* ================= USERS ================= */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">
            👥 Users ({users.length})
          </h2>

          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 bg-gray-100 rounded"
              >
                <div>
                  <p className="font-medium">{u.name || "No Name"}</p>
                  <p className="text-sm text-gray-500">
                    {u.email || "No Email"}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteUser(u.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ================= INCIDENTS ================= */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">
            🚨 Incidents ({incidents.length})
          </h2>

          <div className="space-y-3">
            {incidents.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between p-3 bg-gray-100 rounded"
              >
                <div>
                  <p className="font-medium">
                    {i.type || "Unknown Type"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {i.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {i.lat}, {i.lng}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteIncident(i.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}