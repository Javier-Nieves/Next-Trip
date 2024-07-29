function Button({ children, className, disabled, type, onClick }) {
  let additionalClass =
    'bg-black hover:bg-[var(--color-grey-tr-7)] text-[var(--color-yellow)] rounded-full shadow-lg';
  if (type === 'delete')
    additionalClass =
      'flex justify-center bg-[var(--color-danger)] w-full hover:bg-[var(--color-danger-dark)] hover:text-white rounded-lg';
  if (type === 'bright')
    additionalClass =
      'bg-[var(--color-orange)] hover:bg-[var(--color-dark-orange)]';
  if (type === 'menu')
    additionalClass =
      'w-full flex justify-center p-2 cursor-pointer hover:bg-[var(--color-grey-tr-7)] hover:rounded-lg font-medium text-black hover:text-black';

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex text-lg items-center gap-1 px-4 py-3 font-semibold transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 ${additionalClass} ${className || ''}`}
    >
      {!disabled ? children : 'Loading...'}
    </button>
  );
}

export default Button;
