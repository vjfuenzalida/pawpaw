// src/services/walkerService.ts
import { supabase } from "../lib/supabaseClient";

// Función para obtener los paseadores
export async function getWalkers() {
  const { data, error } = await supabase
    .from('walkers')
    .select('id, name');

  if (error) {
    console.error('Error fetching walkers:', error);
    return [];
  }

  return data;
}
