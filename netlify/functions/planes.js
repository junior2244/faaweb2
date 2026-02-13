const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
  const { userId, planeName } = JSON.parse(event.body);

  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();

  if (user.rank < 3) {
    return { statusCode: 403, body: "Not authorized" };
  }

  await supabase.from('planes').insert({
    plane_name: planeName,
    assigned_pilot: userId,
    status: "Active"
  });

  return { statusCode: 200, body: "Plane Added" };
};
