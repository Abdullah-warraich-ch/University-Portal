"use client";
import { useContext } from "react";
import { FirebaseContext } from "@/app/Context";
import { updateDoc, doc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import Kpicard from "@/app/Components/student/Kpi-card";
import Heading from "@/app/Components/universal/Heading";
import AverageAttendance from "@/app/Components/student/divs/AverageAttendance";
import UpcomingAssignments from "@/app/Components/student/divs/UpcommingAssignments";
import { BookOpen, Sparkles } from "lucide-react";

function Student() {
  const { currentUserRecord, enrolledCourses, availableCourses } = useContext(
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

  async function RegisterCourse(code: string) {
    if (!currentUserRecord || typeof currentUserRecord.uid !== "string") return;

    const userRef = doc(db, "users", String(currentUserRecord.uid));
    const courseRef = doc(
      db,
      "courses",
      String(code),
      "students",
      String(currentUserRecord.uid),
    );
    await updateDoc(userRef, {
      registeredCourses: arrayUnion(String(code)),
    });
    await setDoc(
      courseRef,
      {
        name: String(currentUserRecord.name),
        email: String(currentUserRecord.email),
        uid: String(currentUserRecord.uid),
        timestamp: new Date(),
      },
      { merge: true },
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-6 md:p-10 border border-primary/10">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles size={18} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Student Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">
            Welcome back, <span className="text-primary">{currentUserRecord?.name?.split(' ')[0] || "Student"}!</span>
          </h1>
          <p className="text-text-muted mt-2 max-w-md">
            Check your latest grades, upcoming assignments, and keep track of your attendance.
          </p>
        </div>
        <div className="absolute top-0 right-0 -m-10 h-64 w-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
      </section>

      {availableCourses.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-border/40 pb-4">
            <div>
              <Heading>Available Courses</Heading>
              <p className="text-sm text-text-muted mt-1">Explore new subjects and expand your knowledge</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map((course) => (
              <div
                key={String(course.code)}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <BookOpen size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-background-secondary border border-border/40 text-text-muted uppercase tracking-tighter">
                      {String(course.code)}
                    </span>
                  </div>
                  <h3 className="text-text-primary font-bold text-lg leading-snug group-hover:text-primary transition-colors">
                    {String(course.title)}
                  </h3>
                  <p className="text-text-muted text-sm mt-1">
                    Prof. {String(course.teacher)}
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => RegisterCourse(String(course.code))}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <section className="xl:col-span-2 space-y-6">
          <div className="flex items-end justify-between border-b border-border/40 pb-4">
            <div>
              <Heading>Enrolled Courses</Heading>
              <p className="text-sm text-text-muted mt-1">Your active academic path</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <Kpicard
                  key={String(course.code)}
                  title={String(course.title)}
                  teacher={String(course.teacher)}
                  to={`/student/course/${String(course.code)}`}
                  code={String(course.code)}
                />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-border/60 p-10 text-center">
                <p className="text-text-muted">No courses enrolled yet. Start by exploring available courses above.</p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-border/40 pb-4">
            <div>
              <Heading>Deadlines</Heading>
              <p className="text-sm text-text-muted mt-1">Upcoming tasks</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border/40 p-1 shadow-sm overflow-hidden">
            <UpcomingAssignments />
          </div>
        </section>
      </div>

      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-border/40 pb-4">
          <div>
            <Heading>Attendance Insights</Heading>
            <p className="text-sm text-text-muted mt-1">Track your presence across all courses</p>
          </div>
        </div>
        <div className="bg-card rounded-3xl border border-border/40 p-2 md:p-6 lg:p-10 shadow-sm overflow-x-auto">
          <AverageAttendance />
        </div>
      </section>
    </div>
  );
}

export default Student;
