function AddLocationsButton({
  isEditingSession,
  setRegenerateMap,
  setIsEditingSession,
  setLocationInfo,
}) {
  return (
    <button
      onClick={() => {
        isEditingSession && setRegenerateMap(() => true);
        setIsEditingSession((cur) => !cur);
        setLocationInfo(null);
      }}
      className={`${isEditingSession ? 'bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-dark)]' : 'bg-[var(--color-light-yellow)] hover:bg-[var(--color-yellow)]'} p-2 mt-2 rounded-md text-lg`}
    >
      {isEditingSession ? 'Back to trip' : 'Add locations'}
    </button>
  );
}

export default AddLocationsButton;
