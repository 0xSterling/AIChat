import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, changeTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: '☀️', label: 'Light' },
    { value: 'dark' as const, icon: '🌙', label: 'Dark' },
    { value: 'system' as const, icon: '💻', label: 'System' },
  ];

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {themes.map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => changeTheme(themeOption.value)}
            className={`p-1.5 rounded-md transition-colors text-sm flex items-center space-x-1 ${
              theme === themeOption.value
                ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
            title={themeOption.label}
          >
            <span className="text-sm">{themeOption.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}