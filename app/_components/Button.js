function Button({ children, disabled, type, onClick }) {
  const additionalClass =
    type === 'delete'
      ? 'bg-[var(--color-danger)] hover:bg-[var(--color-danger-dark)] text-md'
      : 'bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-dark)] text-lg';
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${additionalClass} flex items-center gap-1 px-3 py-2 font-semibold transition-all rounded-lg  text-stone-800  hover:text-white disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300`}
    >
      {!disabled ? children : 'Loading...'}
    </button>
  );
}

export default Button;
