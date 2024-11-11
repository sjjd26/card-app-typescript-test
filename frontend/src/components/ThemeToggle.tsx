export default function ThemeToggle() {
  const onClickToggle = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button className="p-4 bg-gray-300 hover:bg-gray-400 text-black text-xl font-medium rounded-md" onClick={onClickToggle}>
      Toggle dark mode
    </button>
  );
}
