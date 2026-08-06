import { useKnowledgeBase } from '../../hooks/useKnowledgeBase';
import { SectionRenderer } from './SectionRenderer';

interface AppShellProps {
  dataPath: string;
}

/**
 * AppShell — Root layout component.
 * Fetch dữ liệu từ JSON, hiển thị tên môn học và các sections.
 */
export function AppShell({ dataPath }: AppShellProps) {
  const { data, loading, error } = useKnowledgeBase(dataPath);

  if (loading) {
    return (
      <div className="app-container">
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-3xl)',
          color: 'var(--color-text-muted)',
        }}>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-3xl)',
          color: 'var(--color-danger)',
        }}>
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="app-container">
      <h1 className="app-title">{data.subject}</h1>
      <SectionRenderer sections={data.sections} />
    </div>
  );
}
