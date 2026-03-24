import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS, validateFirestoreDocument } from '../config/firebaseSchema';

export function usePatients(ashaId = null, role = 'asha') {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ashaId && role === 'asha') return;

    let q = query(collection(db, COLLECTIONS.patients));

    // Filter by ASHA for ASHA dashboard
    if (role === 'asha' && ashaId) {
      q = query(
        collection(db, COLLECTIONS.patients),
        where('ashaWorkerId', '==', ashaId),
        orderBy('riskScore', 'desc')
      );
    }

    // Filter by PHC/Doctor for Doctor dashboard
    if (role === 'doctor') {
      q = query(collection(db, COLLECTIONS.patients), orderBy('riskScore', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPatients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Patients collection error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [ashaId, role]);

  const addPatient = async (data) => {
    const patientRef = doc(collection(db, COLLECTIONS.patients));
    const patientDoc = {
      id: patientRef.id,
      ...data,
      riskScore: 0,
      riskLevel: 'LOW',
      createdAt: serverTimestamp(),
      lastVisitDate: serverTimestamp()
    };
    validateFirestoreDocument('patients', patientDoc);
    await setDoc(patientRef, patientDoc);
    return patientRef.id;
  };

  return { patients, loading, addPatient };
}
