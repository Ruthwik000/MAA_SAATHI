import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';

export function useVitals(patientId) {
  const [vitals, setVitals] = useState([]);
  const [latestVitals, setLatestVitals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    // Latest Vitls (Timeline view for Dashboards)
    const q = query(
      collection(db, 'vitals'),
      where('patientId', '==', patientId),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVitals(docs);
      setLatestVitals(docs[0] || null);
      setLoading(false);
    }, (error) => {
      console.error("Vitals collection error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [patientId]);

  const addVitalsManually = async (data) => {
    if (!patientId) return;
    const vitalsRef = collection(db, 'vitals');
    await addDoc(vitalsRef, {
      patientId,
      ...data,
      source: 'manual',
      timestamp: serverTimestamp()
    });
  };

  return { vitals, latestVitals, loading, addVitalsManually };
}
