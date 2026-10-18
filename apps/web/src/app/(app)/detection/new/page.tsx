import { RuleEditor } from '@/components/detections/RuleEditor';

export const metadata = {
  title: 'New detection rule | SecOps',
};

export default function NewDetectionPage() {
  return <RuleEditor mode="create" />;
}
