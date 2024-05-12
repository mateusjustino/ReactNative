import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConnection";

const notesOrder = async () => {
  let order = 0;
  const q = query(collection(db, "notes"), orderBy("order"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (item) => {
    // console.log(doc.id, " => ", doc.data());
    order += 1;
    const noteRef = doc(db, "notes", item.id);
    await updateDoc(noteRef, {
      order: order,
    });
  });
  return order + 1;
};

export default notesOrder;
