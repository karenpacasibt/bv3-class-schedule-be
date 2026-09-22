const formatTime = (time) => (time ? String(time).slice(0, 5) : time);

const timeSlotDecorator = (timeSlot) => {
  if (!timeSlot) return null;

  return {
    id: timeSlot.id,
    start_time: formatTime(timeSlot.start_time),
    end_time: formatTime(timeSlot.end_time),
  };
};

module.exports = timeSlotDecorator;
