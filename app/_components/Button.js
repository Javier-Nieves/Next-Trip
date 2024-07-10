function Button({ children, disabled }) {
  return (
    <button
      disabled={disabled}
      className={`px-6 py-4 font-semibold transition-all rounded-lg bg-[var(--color-accent-base)] text-stone-800 hover:bg-[var(--color-accent-dark)] hover:text-white disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 text-xl`}
    >
      {!disabled ? children : 'Loading...'}
    </button>
  );
}

export default Button;
