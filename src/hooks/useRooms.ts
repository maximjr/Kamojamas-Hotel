import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface RoomData {
  id?: string;
  name: string;
  price: string;
  image: string;
  features: string[];
  size: string;
  offset?: number;
}

export const fallbackRooms: RoomData[] = [
  {
    name: "KINGS Suite",
    price: "45000",
    image: "https://i.imgur.com/5bQA2kX.jpeg",
    features: ["King Bed", "Premium Decor", "Free WiFi", "Smart TV"],
    size: "45 sqm",
    offset: 1
  },
  {
    name: "EXECUTIVE ROYALE",
    price: "52000",
    image: "https://i.imgur.com/Bd9dxkH.jpeg",
    features: ["King Bed", "Living Area", "Private Terrace", "Smart TV"],
    size: "85 sqm",
    offset: -1
  },
  {
    name: "BUSINESS Suite",
    price: "70000",
    image: "https://i.imgur.com/fKenxrQ.jpeg",
    features: ["2 Bedrooms", "Bunk Area", "Breakfast Inc.", "Mini Bar"],
    size: "110 sqm",
    offset: -0.5
  },
  {
    name: "KAMO Suite",
    price: "75000",
    image: "https://i.imgur.com/hAaXMrf.jpeg",
    features: ["Private Pool", "3 Bedrooms", "Butler Service", "Gourmet Kitchen"],
    size: "240 sqm",
    offset: 1.5
  }
];

export function useRooms() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'rooms'), orderBy('price', 'asc'));
    
    let isSeeding = false;

    const unsub = onSnapshot(q, async (snapshot) => {
        if (!snapshot.empty) {
            setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoomData)));
            setLoading(false);
        } else if (!isSeeding) {
            // Empty database, let's use fallback
            setRooms(fallbackRooms);
            setLoading(false);

            // Attempt to seed if the user is an admin
            if (userData?.role === 'SUPER_ADMIN' || userData?.role === 'ADMIN') {
               isSeeding = true;
               try {
                  await Promise.all(fallbackRooms.map((room, i) => 
                     setDoc(doc(db, 'rooms', `room_${i}`), room)
                  ));
               } catch (e) {
                  console.warn("Could not seed rooms database", e);
               }
            }
        }
    }, (error) => {
        console.warn("Using fallback rooms. Please deploy Firestore rules (Missing or insufficient permissions).", error.message);
        setRooms(fallbackRooms);
        setLoading(false);
    });

    return () => unsub();
  }, [userData?.role]);

  return { rooms, loading };
}

// Dynamic currency decorator based on price magnitude
export function formatRoomPrice(priceStr: string | number): string {
  const cleanPrice = String(priceStr).replace(/,/g, '');
  const numValue = Number(cleanPrice);
  if (isNaN(numValue)) {
    return String(priceStr);
  }
  if (numValue >= 3000) {
    return `₦${numValue.toLocaleString()}`;
  }
  return `$${numValue.toLocaleString()}`;
}

