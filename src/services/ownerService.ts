import { supabase } from '../lib/supabaseClient';

export async function getOwnersWithPets() {
  const { data, error } = await supabase
    .from('owners')
    .select(`
      id,
      name,
      pets (
        id,
        name,
        type
      )
    `);

  if (error) {
    console.error('Error fetching owners and pets:', error);
    return [];
  }

  return data;
}
