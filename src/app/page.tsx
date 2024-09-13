"use client"; // Indicar que es un Client Component

import { useEffect, useState } from "react";
import { getOwnersWithPets } from "../services/ownerService";

// Definir las interfaces para los datos que obtenemos de Supabase
interface Pet {
  id: number;
  name: string;
  type: string;
}

interface Owner {
  id: number;
  name: string;
  pets: Pet[];
}

export default function Home() {
  const [owners, setOwners] = useState<Owner[]>([]); // Usar el tipo `Owner[]`

  useEffect(() => {
    async function fetchData() {
      const data = await getOwnersWithPets();
      setOwners(data);
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Owners and their Pets</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Owner</th>
            <th className="py-2 px-4 border-b">Pets</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.id}>
              <td className="py-2 px-4 border-b">{owner.name}</td>
              <td className="py-2 px-4 border-b">
                {owner.pets.length > 0 ? (
                  <ul>
                    {owner.pets.map((pet) => (
                      <li key={pet.id}>
                        {pet.name} ({pet.type})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>No pets</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
