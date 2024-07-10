function SmallToggle({ children, register }) {
  return (
    <div className="flex items-center justify-center w-1/4">
      <label className="flex flex-col items-center gap-4 cursor-pointer sm:flex-row justity-center">
        <span className="text-sm font-medium text-center text-gray-900 dark:text-gray-300">
          {children}
        </span>
        <div>
          <input
            type="checkbox"
            className="sr-only peer"
            {...register('private')}
          />
          <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-light-yellow)] dark:peer-focus:ring-[var(--color-light-yellow)] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-yellow)]"></div>
        </div>
      </label>
    </div>
  );
}

export default SmallToggle;
