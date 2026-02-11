""
import React from "react";
import Heading from "../../universal/Heading";
import { useContext } from "react";
import { FirebaseContext } from "@/app/Context";
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/Firebase";
function AverageAttendance() {
  const { currentUserRecord, enrolledCourses } = useContext(
    FirebaseContext,
  ) as unknown as {
    currentUserRecord: {
      uid?: string;
      name?: string;
      email?: string;
      registeredCourses?: string[];
    } | null;
    enrolledCourses: { code?: string; title?: string; teacher?: string }[];
    availableCourses: { code?: string; title?: string; teacher?: string }[];
  };
  const [currentUserAttendance, setCurrentUserAttendance] = React.useState<
    AttendanceRecord[]
  >([]);

  type StudentAttendance = {
    present: boolean;
    remarks: string;
  };

  type AttendanceRecord = {
    id: string;
    code: string;
    data: Record<string, StudentAttendance | boolean | number>;
  };
  useEffect(() => {
    if (
      !Array.isArray(currentUserRecord?.registeredCourses) ||
      currentUserRecord.registeredCourses.length === 0
    )
      return;

    const fetchUserAttendance = async () => {
      const userAttendanceArray: AttendanceRecord[] = [];
      const courses = currentUserRecord.registeredCourses ?? [];

      await Promise.all(
        (Array.isArray(courses) ? courses : []).map(async (code: string) => {
          const AttendanceRef = collection(db, "courses", code, "attendance");
          const snapshot = await getDocs(AttendanceRef);
          let presentCount = 0;
          let totalCount = 0;

          snapshot.forEach((doc) => {
            const data = doc.data();
            if (
              typeof currentUserRecord.uid === "string" &&
              currentUserRecord.uid in data
            ) {
              const raw = data[String(currentUserRecord.uid)];
              let value: number | null = null;

              if (typeof raw === "boolean") {
                value = raw ? 1 : 0;
              } else if (typeof raw === "number" && Number.isFinite(raw)) {
                value = raw;
              } else if (
                typeof raw === "object" &&
                raw !== null &&
                "present" in raw &&
                typeof (raw as StudentAttendance).present === "boolean"
              ) {
                value = (raw as StudentAttendance).present ? 1 : 0;
              }

              if (value !== null) {
                presentCount += value;
                totalCount += 1;
                userAttendanceArray.push({
                  id: doc.id,
                  code: String(code),
                  data: { [String(currentUserRecord.uid)]: value },
                });
              }
            }
          });
          // Store average for this course
          if (totalCount > 0) {
            userAttendanceArray.push({
              id: `average-${String(code)}`,
              code: String(code),
              data: { average: presentCount / totalCount },
            });
          }
        }),
      );

      setCurrentUserAttendance(userAttendanceArray);
    };

    fetchUserAttendance();
  }, [currentUserRecord]);
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-5 ">
        <Heading>Attendance</Heading>
        <span className="text-xs text-text-muted">Per subject attendance</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {enrolledCourses.map((course) => {
          const avgRecord = currentUserAttendance.find(
            (record) => record.id === `average-${String(course.code)}`,
          );
          const avg = avgRecord?.data?.average;
          const percent =
            typeof avg === "number" ? Math.max(0, Math.min(100, avg * 100)) : 0;
          return (
            <div
              key={String(course.code)}
              className="rounded-2xl border border-border/40 bg-background-secondary/30 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-base text-text-primary">
                  {String(course.title)}
                </h2>
                <span className="text-xs text-text-muted">
                  {String(course.code)}
                </span>
              </div>
              <div className="mt-4">
                {typeof avg === "number" ? (
                  <>
                    <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                      <span>Average</span>
                      <span className="font-semibold text-text-primary">
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-secondary/30 overflow-hidden">
                      <div
                        style={{ width: `${percent.toFixed(2)}%` }}
                        className={`h-full rounded-full transition-all ${
                          avg < 0.8 ? "bg-danger" : "bg-primary"
                        }`}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-text-muted">
                      {avg < 0.8 ? "Below target" : "On track"}
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/50 p-3 text-xs text-text-muted text-center">
                    No attendance data yet
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AverageAttendance;
