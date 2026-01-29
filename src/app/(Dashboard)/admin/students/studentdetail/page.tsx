import React from "react";
import {auth, db} from "@/app/Firebase";
import {createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import {getDocs, doc, collection} from "firebase/firestore";
import { FirebaseContext } from "@/app/Context";

function StudentDetail() {

  return <div>StudentDetail</div>;
}

export default StudentDetail;
