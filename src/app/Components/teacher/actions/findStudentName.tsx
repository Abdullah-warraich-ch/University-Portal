import { FirebaseContext, UserRecord } from "@/app/Context";
import { useContext } from "react";

export const FindName = (id: string) => {
  const { students } = useContext(FirebaseContext)!;
  const student = students.find((s: UserRecord) => s.uid === id);
  return student ? student.name : "Unknown Student";
};
