import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConnection";

// Add a new document with a generated id.
async function UnknownError(code, message) {
  await addDoc(collection(db, "errors"), {
    code: code,
    message: message,
  });
}

export default UnknownError;
