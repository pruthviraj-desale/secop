import { RBACView } from '@/components/settings/RBACView';

export const metadata = {
  title: 'Roles & Permissions | SecOps',
};

export default function RBACPage() {
  return (
    <div className="p-6">
      <RBACView />
    </div>
  );
}
