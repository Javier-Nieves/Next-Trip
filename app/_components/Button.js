function Button({ children, disabled }) {
  return (
    <button
      disabled={disabled}
      className="bg-stone-500 px-8 py-4 text-stone-800 font-semibold hover:bg-stone-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 rounded-lg"
    >
      {!disabled ? children : 'Loading...'}
    </button>
  );
}

export default Button;
