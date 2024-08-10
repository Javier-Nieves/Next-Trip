function Button({ children, className, disabled, type, onClick }) {
  let additionalClass =
    'bg-black hover:bg-[var(--color-grey-tr-7)] text-[var(--color-yellow)] rounded-full shadow-lg';
  if (type === 'delete')
    additionalClass =
      'flex justify-center bg-[var(--color-danger)] w-full hover:bg-[var(--color-danger-dark)] hover:text-white rounded-lg';
  if (type === 'bright')
    additionalClass =
      'bg-[var(--color-orange)] hover:bg-[var(--color-dark-orange)] rounded-lg';
  if (type === 'menu')
    additionalClass =
      'w-full flex justify-center p-2 hover:bg-[var(--color-grey-tr-7)] hover:rounded-lg font-medium text-black hover:text-black';
  if (type === 'small')
    additionalClass =
      '!text-sm bg-[var(--color-orange)] hover:bg-[var(--color-dark-orange)] rounded-lg !p-2';
  if (type === 'smallDelete')
    additionalClass =
      '!text-sm bg-[var(--color-danger)] hover:bg-[var(--color-danger-dark)] hover:text-white rounded-lg !p-2';

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
