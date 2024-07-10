function Button({ children, disabled }) {
  return (
    <button
      disabled={disabled}
      className={`px-8 py-4 font-semibold transition-all rounded-lg bg-[var(--color-light-yellow)] text-stone-800 hover:bg-[var(--color-yellow)] disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300`}
    >
      {!disabled ? children : 'Loading...'}
    </button>
  );
}

export default Button;
