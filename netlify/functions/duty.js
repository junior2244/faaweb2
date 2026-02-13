const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
  const { userId, action } = JSON.parse(event.body);

  if (action === "on") {
    await supabase.from('users').update({
      duty_status: true,
      duty_start: new Date()
    }).eq('id', userId);

    return { statusCode: 200, body: "On Duty" };
  }

  if (action === "off") {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    const duration = Math.floor((new Date() - new Date(data.duty_start)) / 1000);

    await supabase.from('duty_logs').insert({
      user_id: userId,
      start_time: data.duty_start,
      end_time: new Date(),
      duration
    });

    await supabase.from('users').update({
      duty_status: false,
      duty_start: null,
      total_duty_time: data.total_duty_time + duration
    }).eq('id', userId);

    return { statusCode: 200, body: "Off Duty Logged" };
  }

  return { statusCode: 400 };
};
