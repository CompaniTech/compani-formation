import { ComponentType, ReactNode } from 'react';
import { MarkdownProps } from 'react-native-markdown-display';

declare module 'react-native-markdown-display' {
  const ExtendedMarkdown: ComponentType<{ children: ReactNode } & MarkdownProps>;
  export default ExtendedMarkdown;
}