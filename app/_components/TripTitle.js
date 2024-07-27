import { format } from 'date-fns';

function TripTitle({
  trip = { name: 'Loading...', date: undefined, duration: undefined },
}) {
  const { date, duration, name } = trip;
  const formattedDate = date ? format(date, 'dd.MM.yyyy') : '';
  const hasDate = typeof duration === 'number' && duration !== 0;

  return (
    <>
      {/* <div className="text-4xl font-semibold rounded-lg backdrop-blur-sm bg-[var(--color-grey-tr)] p-2">
        {name}
      </div> */}
      {hasDate && (
        <div className="text-2xl font-normal rounded-lg backdrop-blur-sm">
          {formattedDate}, {duration} {duration > 1 ? 'days' : 'day'}
        </div>
      )}
    </>
  );
}

export default TripTitle;
