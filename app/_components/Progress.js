const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
      <div
        className="h-full bg-green-500 transition-width duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
