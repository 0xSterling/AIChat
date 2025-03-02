import { useEffect } from 'react';

interface KeyboardShortcutsOptions {
  onSearch?: () => void;
  onSettings?: () => void;
  onNewChat?: () => void;
  onExport?: () => void;
  onFocusInput?: () => void;
}

export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Allow Ctrl+F in input fields to still work for search
        if (!(event.ctrlKey && event.key === 'f')) {
          return;
        }
      }

      const { ctrlKey, metaKey, key, altKey } = event;
      const isModKey = ctrlKey || metaKey;

      switch (true) {
        // Ctrl+F / Cmd+F - Search messages
        case isModKey && key === 'f':
          event.preventDefault();
          options.onSearch?.();
          break;

        // Ctrl+, / Cmd+, - Settings
        case isModKey && key === ',':
          event.preventDefault();
          options.onSettings?.();
          break;

        // Ctrl+N / Cmd+N - New chat
        case isModKey && key === 'n':
          event.preventDefault();
          options.onNewChat?.();
          break;

        // Ctrl+E / Cmd+E - Export chat
        case isModKey && key === 'e':
          event.preventDefault();
          options.onExport?.();
          break;

        // Ctrl+/ / Cmd+/ - Focus input
        case isModKey && key === '/':
          event.preventDefault();
          options.onFocusInput?.();
          break;

        // Escape - Close modals/panels
        case key === 'Escape':
          // This will be handled by individual components
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [options]);

  // Return keyboard shortcuts help text
  const shortcuts = [
    { keys: ['Ctrl', 'F'], description: 'Search messages' },
    { keys: ['Ctrl', ','], description: 'Open settings' },
    { keys: ['Ctrl', 'N'], description: 'New chat' },
    { keys: ['Ctrl', 'E'], description: 'Export chat' },
    { keys: ['Ctrl', '/'], description: 'Focus message input' },
    { keys: ['Esc'], description: 'Close modal/panel' },
  ];

  return { shortcuts };
};