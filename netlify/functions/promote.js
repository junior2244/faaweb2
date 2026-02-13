const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
  const { promoterId, targetId, newRank } = JSON.parse(event.body);

  const { data: promoter } = await supabase.from('users').select('*').eq('id', promoterId).single();

  if (promoter.rank < 4) {
    return { statusCode: 403, body: "Not authorized" };
  }

  const { data: target } = await supabase.from('users').select('*').eq('id', targetId).single();

  await supabase.from('users').update({ rank: newRank }).eq('id', targetId);

  await supabase.from('promotion_logs').insert({
    promoted_user: targetId,
    promoted_by: promoterId,
    old_rank: target.rank,
    new_rank: newRank
  });

  return { statusCode: 200, body: "Promotion Logged" };
};
