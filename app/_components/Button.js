function Button({ children, disabled, type, onClick }) {
  let additionalClass =
    'bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-dark)] hover:text-white';
  if (type === 'delete')
    additionalClass =
      'flex justify-center bg-[var(--color-danger)] w-full hover:bg-[var(--color-danger-dark)] hover:text-white';
  if (type === 'bright')
    additionalClass =
      'bg-[var(--color-orange)] hover:bg-[var(--color-dark-orange)]';
  if (type === 'menu')
    additionalClass =
      'w-full flex justify-center p-2 cursor-pointer hover:bg-[var(--color-grey-tr-7)] hover:rounded-lg font-medium text-stone-600 hover:text-black';

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${additionalClass} flex text-lg items-center gap-1 px-3 py-2 font-semibold transition-all rounded-lg  text-stone-800 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300`}
    >
      {!disabled ? children : 'Loading...'}
    </button>
  );
}

export default Button;
