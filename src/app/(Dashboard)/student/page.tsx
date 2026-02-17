"use client";
import { useContext } from "react";
import { FirebaseContext } from "@/app/Context";
import { updateDoc, doc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import Kpicard from "@/app/Components/student/Kpi-card";
import Heading from "@/app/Components/universal/Heading";
import AverageAttendance from "@/app/Components/student/divs/AverageAttendance";
import UpcomingAssignments from "@/app/Components/student/divs/UpcommingAssignments";
import { BookOpen, Sparkles, LayoutDashboard, GraduationCap, Target, Clock, ArrowRight } from "lucide-react";

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
      <section className="relative overflow-hidden rounded-[2.5rem] bg-card/40 backdrop-blur-xl p-8 md:p-12 border border-border/40 shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em]">
            <LayoutDashboard size={14} className="animate-pulse" />
            Student Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight leading-none">
            Hello, <span className="text-primary">{currentUserRecord?.name?.split(' ')[0] || "Student"}!</span>
          </h1>
          <p className="text-text-muted text-sm font-medium max-w-sm opacity-60 leading-relaxed">
            Overview of your active courses, upcoming tasks, and academic progress.
          </p>
        </div>

        {/* Decorative element */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <GraduationCap size={200} />
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      </section>

      {availableCourses.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <h2 className="text-lg font-black tracking-tight text-text-primary uppercase">Discover</h2>
            </div>
            <p className="hidden sm:block text-[10px] text-text-muted font-black tracking-[0.2em] uppercase opacity-40">Expand your knowledge.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map((course) => (
              <div
                key={String(course.code)}
                className="group relative flex flex-col justify-between rounded-[2rem] border border-border/40 bg-card/30 backdrop-blur-xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div className="p-4 rounded-2xl border border-primary/20 bg-primary/10 text-primary group-hover:scale-110 transition-all duration-500 shadow-lg shadow-primary/5">
                      <BookOpen size={22} />
                    </div>
                    <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-background-secondary/50 border border-border/40 text-text-muted/60 uppercase tracking-widest group-hover:border-primary/40 group-hover:text-primary transition-colors">
                      {String(course.code)}
                    </span>
                  </div>
                  <h3 className="text-text-primary font-black text-xl leading-snug group-hover:text-primary transition-colors tracking-tight">
                    {String(course.title)}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/40 mt-1">
                    Prof. {String(course.teacher)}
                  </p>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => RegisterCourse(String(course.code))}
                    className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-95"
                  >
                    Join Course
                  </button>
                </div>
                <div className="absolute -top-6 -right-6 h-24 w-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <section className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border/10 pb-4">
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-primary" />
              <h2 className="text-lg font-black tracking-tight text-text-primary uppercase">My Courses</h2>
            </div>
            <p className="hidden sm:block text-[10px] text-text-muted font-black tracking-[0.2em] uppercase opacity-40">Current studies.</p>
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
          <div className="flex items-center justify-between border-b border-border/10 pb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              <h2 className="text-lg font-black tracking-tight text-text-primary uppercase">To-Do</h2>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border/40 p-1 shadow-sm overflow-hidden">
            <UpcomingAssignments />
          </div>
        </section>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/10 pb-4">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-primary" />
            <h2 className="text-lg font-black tracking-tight text-text-primary uppercase">Attendance</h2>
          </div>
          <p className="hidden sm:block text-[10px] text-text-muted font-black tracking-[0.2em] uppercase opacity-40">Weekly Summary.</p>
        </div>
        <div className="bg-card rounded-3xl border border-border/40 p-2 md:p-6 lg:p-10 shadow-sm overflow-x-auto">
          <AverageAttendance />
        </div>
      </section>
    </div>
  );
}

export default Student;
