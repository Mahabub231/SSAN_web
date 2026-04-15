import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

/* ========================
   READ USERS (REAL TIME)
======================== */
export const listenUsers = (callback: any) => {
  return onSnapshot(collection(db, "users"), (snapshot) => {
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(users);
  });
};

/* ========================
   READ REPORTS
======================== */
export const getReports = async () => {
  const snap = await getDocs(collection(db, "reports"));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/* ========================
   ADD ALERT (ADMIN CREATE)
======================== */
export const addAlert = async (data: any) => {
  return await addDoc(collection(db, "alerts"), {
    ...data,
    createdAt: new Date(),
  });
};

/* ========================
   UPDATE USER ROLE
======================== */
export const updateUserRole = async (userId: string, role: string) => {
  return await updateDoc(doc(db, "users", userId), {
    role,
  });
};

/* ========================
   DELETE REPORT
======================== */
export const deleteReport = async (id: string) => {
  return await deleteDoc(doc(db, "reports", id));
};