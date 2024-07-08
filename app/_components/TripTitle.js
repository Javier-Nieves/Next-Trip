function TripTitle({ trip }) {
  const { date, duration, name } = trip;
  const formattedDate = date ? format(date, 'dd.MM.yyyy') : '';
  const hasDate = typeof duration === 'number' && !Number.isNaN(+duration);
  return (
    <>
      <div className="text-4xl font-semibold">{name}</div>
      {hasDate && (
        <div className="text-xl font-normal">
          {formattedDate}, {duration} {duration > 1 ? 'days' : 'day'}
        </div>
      )}
    </>
  );
}

export default TripTitle;
