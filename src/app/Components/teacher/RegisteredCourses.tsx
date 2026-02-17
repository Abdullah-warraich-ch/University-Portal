import React from "react";
import { FirebaseContext } from "@/app/Context";
function RegisteredCourses() {
  const { courses, currentUserRecord } = React.useContext(FirebaseContext)!;

  console.log("courses of this teacher", courses);
  console.log("current user record", currentUserRecord);

  const registeredCourses = courses.filter(
    (course) => course.teacherUid === currentUserRecord?.uid,
  );

  console.log("registered courses", registeredCourses);

  return registeredCourses;
}

export default RegisteredCourses;
